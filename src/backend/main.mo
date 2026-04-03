import Map "mo:core/Map";
import Set "mo:core/Set";
import Text "mo:core/Text";
import Iter "mo:core/Iter";
import Principal "mo:core/Principal";
import Nat "mo:core/Nat";
import Runtime "mo:core/Runtime";
import Order "mo:core/Order";
import Time "mo:core/Time";
import Int "mo:core/Int";
import Migration "migration";

import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";
import Storage "blob-storage/Storage";
import MixinStorage "blob-storage/Mixin";

(with migration = Migration.run)
actor {
  // Shared types
  module PetProfile {
    public func compare(profile1 : PetProfile, profile2 : PetProfile) : Order.Order {
      Text.compare(profile1.id, profile2.id);
    };
  };

  module HealthEvent {
    public func compare(event1 : HealthEvent, event2 : HealthEvent) : Order.Order {
      Text.compare(event1.id, event2.id);
    };
  };

  module CareReminder {
    public func compare(reminder1 : CareReminder, reminder2 : CareReminder) : Order.Order {
      Text.compare(reminder1.id, reminder2.id);
    };
  };

  module SitterToken {
    public func compare(token1 : SitterToken, token2 : SitterToken) : Order.Order {
      Text.compare(token1.token, token2.token);
    };
  };

  type PetProfile = {
    id : Text;
    owner : Principal;
    createdAt : Int;
    updatedAt : Int;
    name : Text;
    species : Text;
    breed : Text;
    age : Nat;
    weight : Nat;
    notes : Text;
    photoBlob : Storage.ExternalBlob;
    sharedWith : Set.Set<Principal>;
  };

  type PetProfileSnapshot = {
    id : Text;
    owner : Principal;
    createdAt : Int;
    updatedAt : Int;
    name : Text;
    species : Text;
    breed : Text;
    age : Nat;
    weight : Nat;
    notes : Text;
    photoBlob : Storage.ExternalBlob;
    sharedWith : [Principal];
  };

  type HealthEvent = {
    id : Text;
    petId : Text;
    eventType : Text;
    date : Int;
    description : Text;
    documentBlobs : [Storage.ExternalBlob];
    createdAt : Int;
  };

  type HealthEventSnapshot = HealthEvent;

  type CareReminder = {
    id : Text;
    petId : Text;
    title : Text;
    dueDate : Int;
    recurrence : Text;
    isCompleted : Bool;
    createdAt : Int;
  };

  type CareReminderSnapshot = CareReminder;

  type SitterToken = {
    token : Text;
    petId : Text;
    createdAt : Int;
    expiresAt : Int;
  };

  type SymptomAssessment = {
    id : Text;
    petId : Text;
    owner : Principal;
    symptomDescription : Text;
    photoBlob : ?Storage.ExternalBlob;
    assessmentResult : Text;
    createdAt : Int;
  };

  type SymptomAssessmentSnapshot = SymptomAssessment;

  public type UserProfile = {
    name : Text;
  };

  // State management
  let petProfiles = Map.empty<Text, PetProfile>();
  let healthEvents = Map.empty<Text, HealthEvent>();
  let careReminders = Map.empty<Text, CareReminder>();
  let sitterTokens = Map.empty<Text, SitterToken>();
  let symptomAssessments = Map.empty<Text, SymptomAssessment>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  // COMPONENT: Authorization
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);
  // COMPONENT: Blob storage
  include MixinStorage();

  // Helper function to check pet access
  func hasPetAccess(caller : Principal, pet : PetProfile) : Bool {
    pet.owner == caller or pet.sharedWith.contains(caller);
  };

  // USER PROFILE MANAGEMENT

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // PET PROFILE MANAGEMENT

  public shared ({ caller }) func createPetProfile(profile : PetProfileSnapshot) : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create pet profiles");
    };
    // Validate input
    let sharedWithSet = Set.fromArray(profile.sharedWith);
    let newProfile : PetProfile = {
      profile with
      owner = caller;
      createdAt = Int.abs(Time.now());
      updatedAt = Int.abs(Time.now());
      sharedWith = sharedWithSet;
    };
    petProfiles.add(profile.id, newProfile);
    profile.id;
  };

  public query ({ caller }) func getPetProfiles() : async [PetProfileSnapshot] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view pet profiles");
    };

    // FIXED: Only return pets owned by or shared with the caller
    petProfiles.values().toArray().filter(
      func(p) { hasPetAccess(caller, p) }
    ).map(
      func(p) {
        {
          p with sharedWith = p.sharedWith.toArray();
        };
      }
    );
  };

  public query ({ caller }) func getPetProfile(petId : Text) : async ?PetProfileSnapshot {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view pet profiles");
    };

    switch (petProfiles.get(petId)) {
      case (null) { null };
      case (?pet) {
        if (not hasPetAccess(caller, pet)) {
          Runtime.trap("Unauthorized: You do not have access to this pet");
        };
        ?{ pet with sharedWith = pet.sharedWith.toArray() };
      };
    };
  };

  public shared ({ caller }) func updatePetProfile(petId : Text, profile : PetProfileSnapshot) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update pet profiles");
    };

    switch (petProfiles.get(petId)) {
      case (null) { Runtime.trap("Pet not found") };
      case (?existingPet) {
        if (existingPet.owner != caller) {
          Runtime.trap("Unauthorized: Only the pet owner can update the profile");
        };
        let sharedWithSet = Set.fromArray(profile.sharedWith);
        let updatedProfile : PetProfile = {
          profile with
          owner = existingPet.owner;
          createdAt = existingPet.createdAt;
          updatedAt = Int.abs(Time.now());
          sharedWith = sharedWithSet;
        };
        petProfiles.add(petId, updatedProfile);
      };
    };
  };

  public shared ({ caller }) func deletePetProfile(petId : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can delete pet profiles");
    };

    switch (petProfiles.get(petId)) {
      case (null) { Runtime.trap("Pet not found") };
      case (?pet) {
        if (pet.owner != caller) {
          Runtime.trap("Unauthorized: Only the pet owner can delete the profile");
        };
        petProfiles.remove(petId);
      };
    };
  };

  // HEALTH RECORDS

  public shared ({ caller }) func addHealthEvent(event : HealthEventSnapshot) : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add health events");
    };

    // Validate input
    switch (petProfiles.get(event.petId)) {
      case (null) { Runtime.trap("Pet not found") };
      case (?pet) {
        if (not hasPetAccess(caller, pet)) {
          Runtime.trap("Unauthorized: You do not have access to this pet");
        };
      };
    };

    // Create and store health event
    let newEvent : HealthEvent = {
      event with
      createdAt = Int.abs(Time.now());
    };
    healthEvents.add(event.id, newEvent);
    event.id;
  };

  public query ({ caller }) func getHealthEvents(petId : Text) : async [HealthEventSnapshot] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view health events");
    };

    // Validate access to pet
    switch (petProfiles.get(petId)) {
      case (null) { Runtime.trap("Pet not found") };
      case (?pet) {
        if (not hasPetAccess(caller, pet)) {
          Runtime.trap("Unauthorized: You do not have access to this pet");
        };
      };
    };

    // Get and sort events by date
    healthEvents.values().toArray().filter(
      func(e) { e.petId == petId }
    ).sort();
  };

  public shared ({ caller }) func deleteHealthEvent(eventId : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can delete health events");
    };

    switch (healthEvents.get(eventId)) {
      case (null) { Runtime.trap("Health event not found") };
      case (?event) {
        // Validate access to pet
        switch (petProfiles.get(event.petId)) {
          case (null) { Runtime.trap("Associated pet not found") };
          case (?pet) {
            if (not hasPetAccess(caller, pet)) {
              Runtime.trap("Unauthorized: You do not have access to this pet");
            };
          };
        };
        healthEvents.remove(eventId);
      };
    };
  };

  // CARE REMINDERS

  public shared ({ caller }) func addCareReminder(reminder : CareReminderSnapshot) : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add care reminders");
    };

    // Validate input
    switch (petProfiles.get(reminder.petId)) {
      case (null) { Runtime.trap("Pet not found") };
      case (?pet) {
        if (not hasPetAccess(caller, pet)) {
          Runtime.trap("Unauthorized: You do not have access to this pet");
        };
      };
    };

    let newReminder : CareReminder = {
      reminder with
      createdAt = Int.abs(Time.now());
    };
    careReminders.add(reminder.id, newReminder);
    reminder.id;
  };

  public shared ({ caller }) func markReminderCompleted(reminderId : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can mark reminders as completed");
    };

    switch (careReminders.get(reminderId)) {
      case (null) { Runtime.trap("Reminder not found") };
      case (?reminder) {
        // Validate access to pet
        switch (petProfiles.get(reminder.petId)) {
          case (null) { Runtime.trap("Associated pet not found") };
          case (?pet) {
            if (not hasPetAccess(caller, pet)) {
              Runtime.trap("Unauthorized: You do not have access to this pet");
            };
          };
        };
        let updatedReminder : CareReminder = {
          reminder with
          isCompleted = true;
        };
        careReminders.add(reminderId, updatedReminder);
      };
    };
  };

  public query ({ caller }) func getCareReminders(petId : Text) : async [CareReminderSnapshot] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view care reminders");
    };
    // Validate access to pet
    switch (petProfiles.get(petId)) {
      case (null) { Runtime.trap("Pet not found") };
      case (?pet) {
        if (not hasPetAccess(caller, pet)) {
          Runtime.trap("Unauthorized: You do not have access to this pet");
        };
      };
    };

    // Get and sort reminders by due date
    careReminders.values().toArray().filter(
      func(r) { r.petId == petId }
    ).sort();
  };

  public shared ({ caller }) func deleteCareReminder(reminderId : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can delete care reminders");
    };

    switch (careReminders.get(reminderId)) {
      case (null) { Runtime.trap("Reminder not found") };
      case (?reminder) {
        // Validate access to pet
        switch (petProfiles.get(reminder.petId)) {
          case (null) { Runtime.trap("Associated pet not found") };
          case (?pet) {
            if (not hasPetAccess(caller, pet)) {
              Runtime.trap("Unauthorized: You do not have access to this pet");
            };
          };
        };
        careReminders.remove(reminderId);
      };
    };
  };

  // SITTER SHARE TOKEN

  public shared ({ caller }) func generateSitterToken(petId : Text) : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can generate sitter tokens");
    };
    switch (petProfiles.get(petId)) {
      case (null) { Runtime.trap("Pet not found") };
      case (?pet) {
        if (pet.owner != caller) {
          Runtime.trap("Unauthorized: Only the pet owner can generate sitter tokens");
        };
      };
    };

    let token = petId # "_" # Time.now().toText();
    let now = Int.abs(Time.now());
    let newToken : SitterToken = {
      token;
      petId;
      createdAt = now;
      expiresAt = now + 15 * 60 * 1000 * 1000000; // 15 minutes from now in nanoseconds
    };
    sitterTokens.add(token, newToken);
    token;
  };

  public query func getPetSummaryByToken(token : Text) : async PetProfileSnapshot {
    // No authentication required - public access via token
    switch (sitterTokens.get(token)) {
      case (null) { Runtime.trap("Token not found") };
      case (?tokenData) {
        if (tokenData.expiresAt < Int.abs(Time.now())) {
          Runtime.trap("Token expired");
        };
        switch (petProfiles.get(tokenData.petId)) {
          case (null) { Runtime.trap("Pet not found") };
          case (?pet) {
            { pet with sharedWith = pet.sharedWith.toArray() };
          };
        };
      };
    };
  };

  // SYMPTOM ANALYSIS

  public shared ({ caller }) func submitSymptomReport(
    petId : Text,
    description : Text,
    photoBlob : ?Storage.ExternalBlob
  ) : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can submit symptom reports");
    };

    // Validate access to pet
    switch (petProfiles.get(petId)) {
      case (null) { Runtime.trap("Pet not found") };
      case (?pet) {
        if (not hasPetAccess(caller, pet)) {
          Runtime.trap("Unauthorized: You do not have access to this pet");
        };
      };
    };

    // Generate assessment ID
    let assessmentId = petId # "_assessment_" # Time.now().toText();

    // Mock assessment result (in real implementation, this would call an AI service)
    let assessmentResult = "Based on the symptoms described, we recommend monitoring your pet closely. If symptoms persist or worsen, please consult a veterinarian.";

    let assessment : SymptomAssessment = {
      id = assessmentId;
      petId;
      owner = caller;
      symptomDescription = description;
      photoBlob;
      assessmentResult;
      createdAt = Int.abs(Time.now());
    };

    symptomAssessments.add(assessmentId, assessment);
    assessmentId;
  };

  public query ({ caller }) func getSymptomAssessments(petId : Text) : async [SymptomAssessmentSnapshot] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view symptom assessments");
    };

    // Validate access to pet
    switch (petProfiles.get(petId)) {
      case (null) { Runtime.trap("Pet not found") };
      case (?pet) {
        if (not hasPetAccess(caller, pet)) {
          Runtime.trap("Unauthorized: You do not have access to this pet");
        };
      };
    };

    // Get assessments for this pet
    symptomAssessments.values().toArray().filter(
      func(a) { a.petId == petId }
    );
  };
};
