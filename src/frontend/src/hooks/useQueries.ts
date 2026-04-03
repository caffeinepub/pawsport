import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  CareReminderSnapshot,
  HealthEventSnapshot,
  PetProfileSnapshot,
  SymptomAssessmentSnapshot,
  UserProfile,
} from "../backend";
import type { ExternalBlob } from "../backend";
import {
  SAMPLE_HEALTH_EVENTS,
  SAMPLE_PETS,
  SAMPLE_REMINDERS,
} from "../data/sampleData";
import { useActor } from "./useActor";

// ---- Pet Profiles ----
export function useMyPets() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["pets"] as const,
    queryFn: async (): Promise<PetProfileSnapshot[]> => {
      if (!actor) return SAMPLE_PETS;
      try {
        const pets = await actor.getPetProfiles();
        return pets.length > 0 ? pets : SAMPLE_PETS;
      } catch {
        return SAMPLE_PETS;
      }
    },
    enabled: !isFetching,
    initialData: SAMPLE_PETS,
  });
}

export function useCreatePet() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (pet: PetProfileSnapshot) => {
      if (!actor) throw new Error("Not connected");
      return actor.createPetProfile(pet);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["pets"] }),
  });
}

export function useDeletePet() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (petId: string) => {
      if (!actor) throw new Error("Not connected");
      return actor.deletePetProfile(petId);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["pets"] }),
  });
}

// ---- Health Events ----
export function usePetHealthEvents(petId: string | null) {
  const { actor, isFetching } = useActor();
  const fallback = petId
    ? SAMPLE_HEALTH_EVENTS.filter((e) => e.petId === petId)
    : [];
  return useQuery({
    queryKey: ["health-events", petId] as const,
    queryFn: async (): Promise<HealthEventSnapshot[]> => {
      if (!petId) return [];
      if (!actor) return fallback;
      try {
        const events = await actor.getHealthEvents(petId);
        return events.length > 0 ? events : fallback;
      } catch {
        return fallback;
      }
    },
    enabled: !!petId && !isFetching,
    initialData: fallback,
  });
}

export function useAddHealthEvent() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (event: HealthEventSnapshot) => {
      if (!actor) throw new Error("Not connected");
      return actor.addHealthEvent(event);
    },
    onSuccess: (_data: string, variables: HealthEventSnapshot) => {
      qc.invalidateQueries({ queryKey: ["health-events", variables.petId] });
    },
  });
}

export function useDeleteHealthEvent() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      eventId,
      petId: _petId,
    }: { eventId: string; petId: string }) => {
      if (!actor) throw new Error("Not connected");
      return actor.deleteHealthEvent(eventId);
    },
    onSuccess: (_data, variables: { eventId: string; petId: string }) => {
      qc.invalidateQueries({ queryKey: ["health-events", variables.petId] });
    },
  });
}

// ---- Care Reminders ----
export function usePetReminders(petId: string | null) {
  const { actor, isFetching } = useActor();
  const fallback = petId
    ? SAMPLE_REMINDERS.filter((r) => r.petId === petId)
    : [];
  return useQuery({
    queryKey: ["reminders", petId] as const,
    queryFn: async (): Promise<CareReminderSnapshot[]> => {
      if (!petId) return [];
      if (!actor) return fallback;
      try {
        const reminders = await actor.getCareReminders(petId);
        return reminders.length > 0 ? reminders : fallback;
      } catch {
        return fallback;
      }
    },
    enabled: !!petId && !isFetching,
    initialData: fallback,
  });
}

export function useAddReminder() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (reminder: CareReminderSnapshot) => {
      if (!actor) throw new Error("Not connected");
      return actor.addCareReminder(reminder);
    },
    onSuccess: (_data: string, variables: CareReminderSnapshot) => {
      qc.invalidateQueries({ queryKey: ["reminders", variables.petId] });
    },
  });
}

export function useMarkReminderComplete() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (reminderId: string) => {
      if (!actor) throw new Error("Not connected");
      return actor.markReminderCompleted(reminderId);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["reminders"] });
    },
  });
}

export function useDeleteReminder() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      reminderId,
      petId: _petId,
    }: { reminderId: string; petId: string }) => {
      if (!actor) throw new Error("Not connected");
      return actor.deleteCareReminder(reminderId);
    },
    onSuccess: (_data, variables: { reminderId: string; petId: string }) => {
      qc.invalidateQueries({ queryKey: ["reminders", variables.petId] });
    },
  });
}

// ---- Symptom Assessments ----
export function usePetSymptomAssessments(petId: string | null) {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["symptoms", petId] as const,
    queryFn: async (): Promise<SymptomAssessmentSnapshot[]> => {
      if (!petId || !actor) return [];
      try {
        return await actor.getSymptomAssessments(petId);
      } catch {
        return [];
      }
    },
    enabled: !!petId && !isFetching,
    initialData: [],
  });
}

export function useSubmitSymptomReport() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      petId,
      description,
      photoBlob,
    }: {
      petId: string;
      description: string;
      photoBlob: ExternalBlob | null;
    }) => {
      if (!actor) {
        // Demo fallback
        await new Promise((res) => setTimeout(res, 1500));
        if (
          description.toLowerCase().includes("blood") ||
          description.toLowerCase().includes("seizure")
        ) {
          return "HIGH RISK: Symptoms described suggest a potentially serious condition. Please contact your veterinarian immediately or visit an emergency animal clinic.";
        }
        if (
          description.toLowerCase().includes("vomit") ||
          description.toLowerCase().includes("scratch")
        ) {
          return "MODERATE RISK: These symptoms warrant monitoring. If they persist for more than 24 hours or worsen, schedule a vet appointment.";
        }
        return "LOW RISK: The described symptoms appear mild. Monitor your pet closely for the next 24 hours. Ensure they have access to fresh water and rest.";
      }
      return actor.submitSymptomReport(petId, description, photoBlob);
    },
    onSuccess: (
      _data: string,
      variables: {
        petId: string;
        description: string;
        photoBlob: ExternalBlob | null;
      },
    ) => {
      qc.invalidateQueries({ queryKey: ["symptoms", variables.petId] });
    },
  });
}

// ---- Sitter Share ----
export function useGenerateSitterToken() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: async (petId: string) => {
      if (!actor) {
        // Demo fallback
        return `demo-token-${petId}-${Date.now().toString(36)}`;
      }
      return actor.generateSitterToken(petId);
    },
  });
}

export function usePetByToken(token: string | undefined) {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["sitter-pet", token] as const,
    queryFn: async (): Promise<PetProfileSnapshot | null> => {
      if (!token) return null;
      if (!actor) {
        // Demo fallback — return first sample pet
        return SAMPLE_PETS[0];
      }
      try {
        return await actor.getPetSummaryByToken(token);
      } catch {
        return null;
      }
    },
    enabled: !!token && !isFetching,
  });
}

// ---- User Profile ----
export function useUserProfile() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["user-profile"] as const,
    queryFn: async (): Promise<UserProfile | null> => {
      if (!actor) return null;
      try {
        return await actor.getCallerUserProfile();
      } catch {
        return null;
      }
    },
    enabled: !isFetching,
  });
}

export function useSaveUserProfile() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error("Not connected");
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["user-profile"] }),
  });
}
