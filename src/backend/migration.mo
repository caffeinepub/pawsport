import Map "mo:core/Map";
import Int "mo:core/Int";
import Set "mo:core/Set";
import Principal "mo:core/Principal";
import Storage "blob-storage/Storage";

module {
  type OldPet = {
    id : Text;
    name : Text;
    species : Text;
    breed : Text;
    dateOfBirth : Nat;
    microchip : Text;
    allergies : Text;
    emergencyContact : Text;
    photoBlob : Storage.ExternalBlob;
    owner : Principal;
    sharedWith : Set.Set<Principal>;
    createdAt : Nat;
  };

  type OldHealthRecord = {
    id : Text;
    petId : Text;
    recordType : Text;
    title : Text;
    date : Nat;
    notes : Text;
    blobIds : [Text];
    createdAt : Nat;
  };

  type OldCareReminder = {
    id : Text;
    petId : Text;
    reminderType : Text;
    title : Text;
    dueDate : Nat;
    completed : Bool;
    notes : Text;
    createdAt : Nat;
  };

  type OldSitterToken = {
    token : Text;
    petId : Text;
    createdAt : Nat;
    expiresAt : Nat;
  };

  type OldActor = {
    pets : Map.Map<Text, OldPet>;
    healthRecords : Map.Map<Text, OldHealthRecord>;
    careReminders : Map.Map<Text, OldCareReminder>;
    sitterTokens : Map.Map<Text, OldSitterToken>;
  };

  type NewPetProfile = {
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

  type NewHealthEvent = {
    id : Text;
    petId : Text;
    eventType : Text;
    date : Int;
    description : Text;
    documentBlobs : [Storage.ExternalBlob];
    createdAt : Int;
  };

  type NewCareReminder = {
    id : Text;
    petId : Text;
    title : Text;
    dueDate : Int;
    recurrence : Text;
    isCompleted : Bool;
    createdAt : Int;
  };

  type NewSitterToken = {
    token : Text;
    petId : Text;
    createdAt : Int;
    expiresAt : Int;
  };

  type NewActor = {
    petProfiles : Map.Map<Text, NewPetProfile>;
    healthEvents : Map.Map<Text, NewHealthEvent>;
    careReminders : Map.Map<Text, NewCareReminder>;
    sitterTokens : Map.Map<Text, NewSitterToken>;
  };

  public func run(old : OldActor) : NewActor {
    let newPetProfiles = old.pets.map<Text, OldPet, NewPetProfile>(
      func(_id, oldPet) {
        {
          // old fields cleanup/rename
          id = oldPet.id;
          owner = oldPet.owner;
          createdAt = oldPet.createdAt;
          updatedAt = oldPet.createdAt;
          name = oldPet.name;
          species = oldPet.species;
          breed = oldPet.breed;
          photoBlob = oldPet.photoBlob;
          sharedWith = oldPet.sharedWith;
          // initialize new fields
          age = 0;
          weight = 0;
          notes = "";
        };
      }
    );

    let newHealthEvents = old.healthRecords.map<Text, OldHealthRecord, NewHealthEvent>(
      func(_id, oldRecord) {
        {
          // direct field mappings
          id = oldRecord.id;
          petId = oldRecord.petId;
          eventType = oldRecord.recordType;
          date = oldRecord.date;
          description = oldRecord.notes;
          // new fields
          documentBlobs = [];
          // type conversion
          createdAt = oldRecord.createdAt;
        };
      }
    );
    let newCareReminders = old.careReminders.map<Text, OldCareReminder, NewCareReminder>(
      func(_id, oldReminder) {
        {
          id = oldReminder.id;
          petId = oldReminder.petId;
          title = oldReminder.title;
          dueDate = oldReminder.dueDate;
          recurrence = oldReminder.reminderType;
          isCompleted = oldReminder.completed;
          createdAt = oldReminder.createdAt;
        };
      }
    );
    let newSitterTokens = old.sitterTokens.map<Text, OldSitterToken, NewSitterToken>(
      func(_id, oldToken) {
        {
          oldToken with
          createdAt = oldToken.createdAt;
          expiresAt = oldToken.expiresAt;
        };
      }
    );
    {
      petProfiles = newPetProfiles;
      healthEvents = newHealthEvents;
      careReminders = newCareReminders;
      sitterTokens = newSitterTokens;
    };
  };
};
