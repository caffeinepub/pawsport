import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export interface SymptomAssessmentSnapshot {
    id: string;
    photoBlob?: ExternalBlob;
    owner: Principal;
    createdAt: bigint;
    assessmentResult: string;
    petId: string;
    symptomDescription: string;
}
export interface PetProfileSnapshot {
    id: string;
    age: bigint;
    weight: bigint;
    photoBlob: ExternalBlob;
    owner: Principal;
    name: string;
    createdAt: bigint;
    sharedWith: Array<Principal>;
    updatedAt: bigint;
    notes: string;
    breed: string;
    species: string;
}
export interface HealthEventSnapshot {
    id: string;
    date: bigint;
    createdAt: bigint;
    description: string;
    documentBlobs: Array<ExternalBlob>;
    petId: string;
    eventType: string;
}
export interface CareReminderSnapshot {
    id: string;
    title: string;
    isCompleted: boolean;
    createdAt: bigint;
    dueDate: bigint;
    recurrence: string;
    petId: string;
}
export interface UserProfile {
    name: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addCareReminder(reminder: CareReminderSnapshot): Promise<string>;
    addHealthEvent(event: HealthEventSnapshot): Promise<string>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createPetProfile(profile: PetProfileSnapshot): Promise<string>;
    deleteCareReminder(reminderId: string): Promise<void>;
    deleteHealthEvent(eventId: string): Promise<void>;
    deletePetProfile(petId: string): Promise<void>;
    generateSitterToken(petId: string): Promise<string>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getCareReminders(petId: string): Promise<Array<CareReminderSnapshot>>;
    getHealthEvents(petId: string): Promise<Array<HealthEventSnapshot>>;
    getPetProfile(petId: string): Promise<PetProfileSnapshot | null>;
    getPetProfiles(): Promise<Array<PetProfileSnapshot>>;
    getPetSummaryByToken(token: string): Promise<PetProfileSnapshot>;
    getSymptomAssessments(petId: string): Promise<Array<SymptomAssessmentSnapshot>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    markReminderCompleted(reminderId: string): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    submitSymptomReport(petId: string, description: string, photoBlob: ExternalBlob | null): Promise<string>;
    updatePetProfile(petId: string, profile: PetProfileSnapshot): Promise<void>;
}
