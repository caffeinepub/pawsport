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
import { Activity, Loader2, PawPrint, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { HealthEventSnapshot } from "../backend";
import { ExternalBlob } from "../backend";
import {
  formatDate,
  getEventTypeColor,
  getEventTypeLabel,
} from "../data/sampleData";
import {
  useAddHealthEvent,
  useDeleteHealthEvent,
  useMyPets,
  usePetHealthEvents,
} from "../hooks/useQueries";

function AddEventModal({
  open,
  onOpenChange,
  petId,
  petName,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  petId: string;
  petName: string;
}) {
  const [eventType, setEventType] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");

  const addEvent = useAddHealthEvent();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventType || !date || !description) {
      toast.error("Please fill in all required fields");
      return;
    }
    const event: HealthEventSnapshot = {
      id: "",
      petId,
      eventType,
      date: BigInt(new Date(date).getTime()),
      description,
      documentBlobs: [],
      createdAt: BigInt(Date.now()),
    };
    addEvent.mutate(event, {
      onSuccess: () => {
        toast.success("Health event added!");
        onOpenChange(false);
        setEventType("");
        setDate("");
        setDescription("");
      },
      onError: (err) => toast.error(err.message || "Failed to add event"),
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-md bg-card-bg border-warm-border"
        data-ocid="addevent.dialog"
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-navy">
            <Activity className="w-4 h-4 text-orange" />
            Add Health Event for {petName}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-xs font-medium text-navy">
                Event Type *
              </Label>
              <Select value={eventType} onValueChange={setEventType}>
                <SelectTrigger
                  className="h-9 text-sm border-warm-border"
                  data-ocid="addevent.select"
                >
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="vaccination">Vaccination</SelectItem>
                  <SelectItem value="vet_visit">Vet Visit</SelectItem>
                  <SelectItem value="medication">Medication</SelectItem>
                  <SelectItem value="procedure">Procedure</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label className="text-xs font-medium text-navy">Date *</Label>
              <Input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="h-9 text-sm border-warm-border"
                data-ocid="addevent.input"
              />
            </div>
          </div>
          <div className="space-y-1">
            <Label className="text-xs font-medium text-navy">
              Description *
            </Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Notes, dosage, observations..."
              className="text-sm min-h-[80px] resize-none border-warm-border"
              data-ocid="addevent.textarea"
            />
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
              className="border-warm-border"
              data-ocid="addevent.cancel_button"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={addEvent.isPending}
              className="bg-orange text-white hover:bg-orange/90 rounded-pill"
              data-ocid="addevent.submit_button"
            >
              {addEvent.isPending ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 mr-1 animate-spin" /> Adding…
                </>
              ) : (
                "Add Event"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function HealthTimelinePage() {
  const [selectedPetId, setSelectedPetId] = useState<string | null>(null);
  const [addOpen, setAddOpen] = useState(false);

  const { data: pets = [] } = useMyPets();
  const activePetId = selectedPetId ?? pets[0]?.id ?? null;
  const activePet = pets.find((p) => p.id === activePetId);

  const { data: events = [], isLoading } = usePetHealthEvents(activePetId);
  const deleteEvent = useDeleteHealthEvent();

  const sortedEvents = [...events].sort(
    (a, b) => Number(b.date) - Number(a.date),
  );

  return (
    <div className="p-6 max-w-3xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-navy">Health Timeline</h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            Track all health events and medical history
          </p>
        </div>
        {activePetId && (
          <Button
            onClick={() => setAddOpen(true)}
            className="bg-orange text-white hover:bg-orange/90 rounded-pill gap-2"
            data-ocid="timeline.open_modal_button"
          >
            <Plus className="w-4 h-4" />
            Add Event
          </Button>
        )}
      </div>

      {/* Pet selector */}
      <div className="flex flex-wrap gap-2 mb-6">
        {pets.map((pet) => (
          <button
            key={pet.id}
            type="button"
            onClick={() => setSelectedPetId(pet.id)}
            data-ocid="timeline.tab"
            className={`px-4 py-2 rounded-pill text-sm font-medium transition-all border ${
              activePetId === pet.id
                ? "bg-orange text-white border-orange shadow-warm"
                : "bg-card-bg text-muted-foreground border-warm-border hover:bg-pale-blue/40 hover:text-navy"
            }`}
          >
            {pet.name}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="space-y-3" data-ocid="timeline.loading_state">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-20 rounded-xl" />
          ))}
        </div>
      ) : sortedEvents.length === 0 ? (
        <div
          className="text-center py-16 bg-card-bg rounded-2xl border border-warm-border"
          data-ocid="timeline.empty_state"
        >
          <Activity className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
          <p className="text-navy font-medium mb-1">No health events yet</p>
          <p className="text-muted-foreground text-sm">
            Add the first health event for {activePet?.name ?? "your pet"}
          </p>
        </div>
      ) : (
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-warm-border" />
          <div className="space-y-4" data-ocid="timeline.list">
            {sortedEvents.map((event, idx) => (
              <div
                key={event.id}
                className="flex gap-4 relative"
                data-ocid={`timeline.item.${idx + 1}`}
              >
                {/* Dot */}
                <div className="w-10 h-10 rounded-full bg-card-bg border-2 border-warm-border flex items-center justify-center flex-shrink-0 z-10">
                  <Activity className="w-4 h-4 text-orange" />
                </div>
                {/* Card */}
                <div className="flex-1 bg-card-bg rounded-xl border border-warm-border p-4 shadow-card group">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Badge
                          className={`text-[10px] px-2 py-0.5 border-0 ${getEventTypeColor(event.eventType)}`}
                        >
                          {getEventTypeLabel(event.eventType)}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {formatDate(event.date)}
                        </span>
                      </div>
                      <p className="text-sm text-navy leading-relaxed">
                        {event.description}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        deleteEvent.mutate(
                          { eventId: event.id, petId: event.petId },
                          {
                            onSuccess: () => toast.success("Event removed"),
                            onError: () => toast.error("Failed to remove"),
                          },
                        )
                      }
                      className="opacity-0 group-hover:opacity-100 transition-opacity w-7 h-7 rounded-full hover:bg-red-50 flex items-center justify-center text-muted-foreground hover:text-destructive"
                      data-ocid={`timeline.delete_button.${idx + 1}`}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activePetId && activePet && (
        <AddEventModal
          open={addOpen}
          onOpenChange={setAddOpen}
          petId={activePetId}
          petName={activePet.name}
        />
      )}
    </div>
  );
}
