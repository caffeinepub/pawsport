import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import {
  Bird,
  Calendar,
  Cat,
  Dog,
  Loader2,
  PawPrint,
  Plus,
  Trash2,
  Weight,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { ExternalBlob } from "../backend";
import type { PetProfileSnapshot } from "../backend";
import { PET_PHOTOS } from "../data/sampleData";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useCreatePet, useDeletePet, useMyPets } from "../hooks/useQueries";

function PetSpeciesIcon({ species }: { species: string }) {
  if (species === "Dog") return <Dog className="w-4 h-4" />;
  if (species === "Cat") return <Cat className="w-4 h-4" />;
  if (species === "Bird") return <Bird className="w-4 h-4" />;
  return <PawPrint className="w-4 h-4" />;
}

function AddPetModal({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const { identity } = useInternetIdentity();
  const [name, setName] = useState("");
  const [species, setSpecies] = useState("");
  const [breed, setBreed] = useState("");
  const [age, setAge] = useState("");
  const [weight, setWeight] = useState("");
  const [notes, setNotes] = useState("");
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const createPet = useCreatePet();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !species || !breed || !age) {
      toast.error("Please fill in all required fields");
      return;
    }

    let photoBlob = ExternalBlob.fromURL("");
    if (photoFile) {
      const buf = await photoFile.arrayBuffer();
      const bytes = new Uint8Array(buf);
      photoBlob = ExternalBlob.fromBytes(bytes).withUploadProgress((p) =>
        setUploadProgress(p),
      );
    }

    const profile: PetProfileSnapshot = {
      id: "",
      name,
      species,
      breed,
      age: BigInt(Math.round(Number(age))),
      weight: BigInt(Math.round(Number(weight) || 0)),
      notes,
      owner: identity?.getPrincipal() ?? ({ toText: () => "" } as any),
      sharedWith: [],
      createdAt: BigInt(Date.now()),
      updatedAt: BigInt(Date.now()),
      photoBlob,
    };

    createPet.mutate(profile, {
      onSuccess: () => {
        toast.success(`${name} added to your Pawsport!`);
        onOpenChange(false);
        setName("");
        setSpecies("");
        setBreed("");
        setAge("");
        setWeight("");
        setNotes("");
        setPhotoFile(null);
        setUploadProgress(0);
      },
      onError: (err) => {
        toast.error(err.message || "Failed to add pet");
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-md bg-card-bg border-warm-border"
        data-ocid="addpet.dialog"
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-navy">
            <PawPrint className="w-4 h-4 text-orange" />
            Add New Pet
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label
                htmlFor="pet-name"
                className="text-xs font-medium text-navy"
              >
                Name *
              </Label>
              <Input
                id="pet-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Buddy"
                className="h-9 text-sm border-warm-border"
                data-ocid="addpet.input"
              />
            </div>
            <div className="space-y-1">
              <Label
                htmlFor="pet-species"
                className="text-xs font-medium text-navy"
              >
                Species *
              </Label>
              <Select value={species} onValueChange={setSpecies}>
                <SelectTrigger
                  id="pet-species"
                  className="h-9 text-sm border-warm-border"
                  data-ocid="addpet.select"
                >
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Dog">Dog</SelectItem>
                  <SelectItem value="Cat">Cat</SelectItem>
                  <SelectItem value="Bird">Bird</SelectItem>
                  <SelectItem value="Rabbit">Rabbit</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label
                htmlFor="pet-breed"
                className="text-xs font-medium text-navy"
              >
                Breed *
              </Label>
              <Input
                id="pet-breed"
                value={breed}
                onChange={(e) => setBreed(e.target.value)}
                placeholder="e.g. Labrador"
                className="h-9 text-sm border-warm-border"
                data-ocid="addpet.input"
              />
            </div>
            <div className="space-y-1">
              <Label
                htmlFor="pet-age"
                className="text-xs font-medium text-navy"
              >
                Age (years) *
              </Label>
              <Input
                id="pet-age"
                type="number"
                min="0"
                max="30"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                placeholder="e.g. 3"
                className="h-9 text-sm border-warm-border"
                data-ocid="addpet.input"
              />
            </div>
          </div>

          <div className="space-y-1">
            <Label
              htmlFor="pet-weight"
              className="text-xs font-medium text-navy"
            >
              Weight (kg)
            </Label>
            <Input
              id="pet-weight"
              type="number"
              min="0"
              step="0.1"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              placeholder="e.g. 12.5"
              className="h-9 text-sm border-warm-border"
              data-ocid="addpet.input"
            />
          </div>

          <div className="space-y-1">
            <Label
              htmlFor="pet-photo"
              className="text-xs font-medium text-navy"
            >
              Photo
            </Label>
            <Input
              id="pet-photo"
              type="file"
              accept="image/*"
              onChange={(e) => setPhotoFile(e.target.files?.[0] ?? null)}
              className="h-9 text-sm border-warm-border"
              data-ocid="addpet.upload_button"
            />
          </div>

          <div className="space-y-1">
            <Label
              htmlFor="pet-notes"
              className="text-xs font-medium text-navy"
            >
              Notes
            </Label>
            <Textarea
              id="pet-notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Allergies, special needs, vet contact..."
              className="text-sm min-h-[70px] resize-none border-warm-border"
              data-ocid="addpet.textarea"
            />
          </div>

          {uploadProgress > 0 && uploadProgress < 100 && (
            <div className="w-full bg-muted rounded-full h-1.5">
              <div
                className="bg-orange h-1.5 rounded-full transition-all"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
              className="border-warm-border"
              data-ocid="addpet.cancel_button"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={createPet.isPending}
              className="bg-orange text-white hover:bg-orange/90 rounded-pill"
              data-ocid="addpet.submit_button"
            >
              {createPet.isPending ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 mr-1 animate-spin" /> Adding…
                </>
              ) : (
                "Add Pet"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function MyPetsPage() {
  const [addOpen, setAddOpen] = useState(false);
  const { data: pets = [], isLoading } = useMyPets();
  const deletePet = useDeletePet();

  const handleDelete = (petId: string, petName: string) => {
    if (!confirm(`Remove ${petName} from your Pawsport?`)) return;
    deletePet.mutate(petId, {
      onSuccess: () => toast.success(`${petName} removed`),
      onError: () => toast.error("Failed to remove pet"),
    });
  };

  return (
    <div className="p-6 max-w-5xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-navy">My Pets</h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            Manage your pet profiles
          </p>
        </div>
        <Button
          onClick={() => setAddOpen(true)}
          className="bg-orange text-white hover:bg-orange/90 rounded-pill gap-2"
          data-ocid="pets.open_modal_button"
        >
          <Plus className="w-4 h-4" />
          Add Pet
        </Button>
      </div>

      {isLoading ? (
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          data-ocid="pets.loading_state"
        >
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-48 rounded-2xl" />
          ))}
        </div>
      ) : pets.length === 0 ? (
        <div
          className="text-center py-16 bg-card-bg rounded-2xl border border-warm-border"
          data-ocid="pets.empty_state"
        >
          <PawPrint className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
          <p className="text-navy font-medium mb-1">No pets yet</p>
          <p className="text-muted-foreground text-sm">
            Add your first pet to get started
          </p>
        </div>
      ) : (
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          data-ocid="pets.list"
        >
          {pets.map((pet, idx) => (
            <div
              key={pet.id}
              className="bg-card-bg rounded-2xl border border-warm-border shadow-card hover:shadow-card-hover transition-shadow overflow-hidden group"
              data-ocid={`pets.item.${idx + 1}`}
            >
              {/* Pet photo */}
              <div className="h-36 bg-pale-blue/40 relative overflow-hidden">
                {pet.photoBlob.getDirectURL() ? (
                  <img
                    src={pet.photoBlob.getDirectURL() || PET_PHOTOS[pet.id]}
                    alt={pet.name}
                    className="w-full h-full object-cover"
                  />
                ) : PET_PHOTOS[pet.id] ? (
                  <img
                    src={PET_PHOTOS[pet.id]}
                    alt={pet.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <PetSpeciesIcon species={pet.species} />
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => handleDelete(pet.id, pet.name)}
                  className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/80 hover:bg-red-50 text-muted-foreground hover:text-destructive flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-xs"
                  data-ocid={`pets.delete_button.${idx + 1}`}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
              {/* Pet info */}
              <div className="p-4">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <h3 className="font-bold text-navy">{pet.name}</h3>
                    <p className="text-muted-foreground text-xs">{pet.breed}</p>
                  </div>
                  <Badge
                    variant="secondary"
                    className="text-[10px] px-2 py-0.5 bg-pale-blue/50 text-navy border-0 flex items-center gap-1"
                  >
                    <PetSpeciesIcon species={pet.species} />
                    {pet.species}
                  </Badge>
                </div>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {Number(pet.age)}yr
                  </span>
                  {Number(pet.weight) > 0 && (
                    <span className="flex items-center gap-1">
                      <Weight className="w-3 h-3" />
                      {Number(pet.weight)}kg
                    </span>
                  )}
                </div>
                {pet.notes && (
                  <p className="text-xs text-muted-foreground mt-2 line-clamp-2">
                    {pet.notes}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <AddPetModal open={addOpen} onOpenChange={setAddOpen} />
    </div>
  );
}
