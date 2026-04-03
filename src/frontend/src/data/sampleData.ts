import { ExternalBlob } from "../backend";
import type {
  CareReminderSnapshot,
  HealthEventSnapshot,
  PetProfileSnapshot,
} from "../backend";

// Mock Principal for sample data
const mockPrincipal = { toText: () => "2vxsx-fae" } as any;

const emptyBlob = ExternalBlob.fromURL("");

export const SAMPLE_PETS: PetProfileSnapshot[] = [
  {
    id: "pet-1",
    name: "Buddy",
    species: "Dog",
    breed: "Golden Retriever",
    age: BigInt(4),
    weight: BigInt(28),
    notes:
      "Loves fetch and swimming. Allergic to chicken-based foods and pollen.",
    owner: mockPrincipal,
    sharedWith: [],
    createdAt: BigInt(Date.now()),
    updatedAt: BigInt(Date.now()),
    photoBlob: emptyBlob,
  },
  {
    id: "pet-2",
    name: "Luna",
    species: "Cat",
    breed: "Siamese",
    age: BigInt(3),
    weight: BigInt(4),
    notes: "Indoor cat. Dairy sensitive. Very vocal at night.",
    owner: mockPrincipal,
    sharedWith: [],
    createdAt: BigInt(Date.now()),
    updatedAt: BigInt(Date.now()),
    photoBlob: emptyBlob,
  },
  {
    id: "pet-3",
    name: "Milo",
    species: "Dog",
    breed: "Beagle",
    age: BigInt(6),
    weight: BigInt(12),
    notes: "Energetic and curious. No known allergies.",
    owner: mockPrincipal,
    sharedWith: [],
    createdAt: BigInt(Date.now()),
    updatedAt: BigInt(Date.now()),
    photoBlob: emptyBlob,
  },
];

export const PET_PHOTOS: Record<string, string> = {
  "pet-1": "/assets/generated/pet-buddy.dim_400x400.jpg",
  "pet-2": "/assets/generated/pet-luna.dim_400x400.jpg",
  "pet-3": "/assets/generated/pet-milo.dim_400x400.jpg",
};

export const SAMPLE_HEALTH_EVENTS: HealthEventSnapshot[] = [
  {
    id: "he-1",
    petId: "pet-1",
    eventType: "vaccination",
    date: BigInt(new Date("2026-01-15").getTime()),
    description: "Annual rabies vaccine administered. Next due: January 2029.",
    documentBlobs: [],
    createdAt: BigInt(Date.now()),
  },
  {
    id: "he-2",
    petId: "pet-1",
    eventType: "vet_visit",
    date: BigInt(new Date("2026-01-15").getTime()),
    description:
      "Annual wellness exam. Weight: 28kg. All vitals normal. Dental cleaning recommended.",
    documentBlobs: [],
    createdAt: BigInt(Date.now()),
  },
  {
    id: "he-3",
    petId: "pet-1",
    eventType: "medication",
    date: BigInt(new Date("2025-12-01").getTime()),
    description: "NexGard flea & tick chewable administered. 1 tablet monthly.",
    documentBlobs: [],
    createdAt: BigInt(Date.now()),
  },
  {
    id: "he-4",
    petId: "pet-2",
    eventType: "vaccination",
    date: BigInt(new Date("2026-02-10").getTime()),
    description:
      "FVRCP booster — feline viral rhinotracheitis, calicivirus, panleukopenia. Annual.",
    documentBlobs: [],
    createdAt: BigInt(Date.now()),
  },
  {
    id: "he-5",
    petId: "pet-3",
    eventType: "vaccination",
    date: BigInt(new Date("2026-01-28").getTime()),
    description:
      "DHPP vaccination — distemper, hepatitis, parvovirus, parainfluenza combo booster.",
    documentBlobs: [],
    createdAt: BigInt(Date.now()),
  },
];

export const SAMPLE_REMINDERS: CareReminderSnapshot[] = [
  {
    id: "rem-1",
    petId: "pet-1",
    title: "Flea & Tick Treatment",
    isCompleted: false,
    dueDate: BigInt(new Date("2026-04-01").getTime()),
    recurrence: "monthly",
    createdAt: BigInt(Date.now()),
  },
  {
    id: "rem-2",
    petId: "pet-1",
    title: "Annual Dental Check-up",
    isCompleted: false,
    dueDate: BigInt(new Date("2026-04-15").getTime()),
    recurrence: "yearly",
    createdAt: BigInt(Date.now()),
  },
  {
    id: "rem-3",
    petId: "pet-2",
    title: "Rabies Vaccination",
    isCompleted: false,
    dueDate: BigInt(new Date("2026-04-10").getTime()),
    recurrence: "yearly",
    createdAt: BigInt(Date.now()),
  },
  {
    id: "rem-4",
    petId: "pet-3",
    title: "Deworming Treatment",
    isCompleted: false,
    dueDate: BigInt(new Date("2026-03-15").getTime()),
    recurrence: "quarterly",
    createdAt: BigInt(Date.now()),
  },
  {
    id: "rem-5",
    petId: "pet-3",
    title: "Annual Wellness Exam",
    isCompleted: false,
    dueDate: BigInt(new Date("2026-04-28").getTime()),
    recurrence: "yearly",
    createdAt: BigInt(Date.now()),
  },
];

export function formatDate(ts: bigint): string {
  return new Date(Number(ts)).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function getDueDateStatus(
  dueDate: bigint,
): "overdue" | "soon" | "upcoming" {
  const now = Date.now();
  const due = Number(dueDate);
  const diff = due - now;
  if (diff < 0) return "overdue";
  if (diff < 7 * 24 * 60 * 60 * 1000) return "soon";
  return "upcoming";
}

export function getEventTypeLabel(eventType: string): string {
  const labels: Record<string, string> = {
    vaccination: "Vaccination",
    vet_visit: "Vet Visit",
    medication: "Medication",
    procedure: "Procedure",
    other: "Other",
  };
  return labels[eventType] ?? eventType;
}

export function getEventTypeColor(eventType: string): string {
  const colors: Record<string, string> = {
    vaccination: "bg-blue-100 text-blue-700",
    vet_visit: "bg-green-100 text-green-700",
    medication: "bg-orange-100 text-orange-700",
    procedure: "bg-purple-100 text-purple-700",
    other: "bg-gray-100 text-gray-700",
  };
  return colors[eventType] ?? "bg-gray-100 text-gray-700";
}
