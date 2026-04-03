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
import {
  Bell,
  CheckCircle,
  Clock,
  Loader2,
  PawPrint,
  Plus,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { CareReminderSnapshot } from "../backend";
import { formatDate, getDueDateStatus } from "../data/sampleData";
import {
  useAddReminder,
  useDeleteReminder,
  useMarkReminderComplete,
  useMyPets,
  usePetReminders,
} from "../hooks/useQueries";

function AddReminderModal({
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
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [recurrence, setRecurrence] = useState("none");

  const addReminder = useAddReminder();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !dueDate) {
      toast.error("Please fill in all required fields");
      return;
    }
    const reminder: CareReminderSnapshot = {
      id: "",
      petId,
      title,
      isCompleted: false,
      dueDate: BigInt(new Date(dueDate).getTime()),
      recurrence,
      createdAt: BigInt(Date.now()),
    };
    addReminder.mutate(reminder, {
      onSuccess: () => {
        toast.success("Reminder added!");
        onOpenChange(false);
        setTitle("");
        setDueDate("");
        setRecurrence("none");
      },
      onError: (err) => toast.error(err.message || "Failed to add reminder"),
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-md bg-card-bg border-warm-border"
        data-ocid="addreminder.dialog"
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-navy">
            <Bell className="w-4 h-4 text-orange" />
            Add Reminder for {petName}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="space-y-1">
            <Label className="text-xs font-medium text-navy">Title *</Label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Flea treatment"
              className="h-9 text-sm border-warm-border"
              data-ocid="addreminder.input"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-xs font-medium text-navy">
                Due Date *
              </Label>
              <Input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="h-9 text-sm border-warm-border"
                data-ocid="addreminder.input"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs font-medium text-navy">
                Recurrence
              </Label>
              <Select value={recurrence} onValueChange={setRecurrence}>
                <SelectTrigger
                  className="h-9 text-sm border-warm-border"
                  data-ocid="addreminder.select"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="quarterly">Quarterly</SelectItem>
                  <SelectItem value="yearly">Yearly</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
              className="border-warm-border"
              data-ocid="addreminder.cancel_button"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={addReminder.isPending}
              className="bg-orange text-white hover:bg-orange/90 rounded-pill"
              data-ocid="addreminder.submit_button"
            >
              {addReminder.isPending ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 mr-1 animate-spin" /> Adding…
                </>
              ) : (
                "Add Reminder"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function RemindersPage() {
  const [selectedPetId, setSelectedPetId] = useState<string | null>(null);
  const [addOpen, setAddOpen] = useState(false);

  const { data: pets = [] } = useMyPets();
  const activePetId = selectedPetId ?? pets[0]?.id ?? null;
  const activePet = pets.find((p) => p.id === activePetId);

  const { data: reminders = [], isLoading } = usePetReminders(activePetId);
  const markComplete = useMarkReminderComplete();
  const deleteReminder = useDeleteReminder();

  const pendingReminders = reminders.filter((r) => !r.isCompleted);
  const completedReminders = reminders.filter((r) => r.isCompleted);

  const statusConfig = {
    overdue: { label: "Overdue", className: "bg-red-100 text-red-700" },
    soon: { label: "Due Soon", className: "bg-orange-100 text-orange-700" },
    upcoming: { label: "Upcoming", className: "bg-blue-100 text-blue-700" },
  };

  return (
    <div className="p-6 max-w-3xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-navy">Care Reminders</h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            Stay on top of your pet’s care schedule
          </p>
        </div>
        {activePetId && (
          <Button
            onClick={() => setAddOpen(true)}
            className="bg-orange text-white hover:bg-orange/90 rounded-pill gap-2"
            data-ocid="reminders.open_modal_button"
          >
            <Plus className="w-4 h-4" />
            Add Reminder
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
            data-ocid="reminders.tab"
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
        <div className="space-y-3" data-ocid="reminders.loading_state">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-16 rounded-xl" />
          ))}
        </div>
      ) : reminders.length === 0 ? (
        <div
          className="text-center py-16 bg-card-bg rounded-2xl border border-warm-border"
          data-ocid="reminders.empty_state"
        >
          <Bell className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
          <p className="text-navy font-medium mb-1">No reminders yet</p>
          <p className="text-muted-foreground text-sm">
            Add care reminders for {activePet?.name ?? "your pet"}
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          {/* Pending */}
          {pendingReminders.length > 0 && (
            <div>
              <h2 className="text-sm font-semibold text-navy mb-2">
                Pending ({pendingReminders.length})
              </h2>
              <div className="space-y-2" data-ocid="reminders.list">
                {pendingReminders.map((reminder, idx) => {
                  const status = getDueDateStatus(reminder.dueDate);
                  const sc = statusConfig[status];
                  return (
                    <div
                      key={reminder.id}
                      className="flex items-center gap-3 bg-card-bg rounded-xl border border-warm-border p-4 shadow-card group"
                      data-ocid={`reminders.item.${idx + 1}`}
                    >
                      <button
                        type="button"
                        onClick={() =>
                          markComplete.mutate(reminder.id, {
                            onSuccess: () => toast.success("Marked complete!"),
                            onError: () => toast.error("Failed to update"),
                          })
                        }
                        className="w-5 h-5 rounded-full border-2 border-warm-border hover:border-health-green flex items-center justify-center flex-shrink-0 transition-colors"
                        data-ocid={`reminders.checkbox.${idx + 1}`}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm text-navy truncate">
                          {reminder.title}
                        </p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {formatDate(reminder.dueDate)}
                          </span>
                          {reminder.recurrence !== "none" && (
                            <Badge className="text-[10px] px-1.5 py-0 bg-pale-blue/50 text-navy border-0">
                              {reminder.recurrence}
                            </Badge>
                          )}
                        </div>
                      </div>
                      <Badge
                        className={`text-[10px] px-2 py-0.5 border-0 ${sc.className}`}
                      >
                        {sc.label}
                      </Badge>
                      <button
                        type="button"
                        onClick={() =>
                          deleteReminder.mutate(
                            { reminderId: reminder.id, petId: reminder.petId },
                            {
                              onSuccess: () =>
                                toast.success("Reminder deleted"),
                              onError: () => toast.error("Failed to delete"),
                            },
                          )
                        }
                        className="opacity-0 group-hover:opacity-100 transition-opacity w-7 h-7 rounded-full hover:bg-red-50 flex items-center justify-center text-muted-foreground hover:text-destructive"
                        data-ocid={`reminders.delete_button.${idx + 1}`}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Completed */}
          {completedReminders.length > 0 && (
            <div>
              <h2 className="text-sm font-semibold text-muted-foreground mb-2">
                Completed ({completedReminders.length})
              </h2>
              <div className="space-y-2">
                {completedReminders.map((reminder, idx) => (
                  <div
                    key={reminder.id}
                    className="flex items-center gap-3 bg-card-bg rounded-xl border border-warm-border p-4 opacity-60"
                    data-ocid={`reminders.item.${pendingReminders.length + idx + 1}`}
                  >
                    <CheckCircle className="w-5 h-5 text-health-green flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm text-navy line-through truncate">
                        {reminder.title}
                      </p>
                      <span className="text-xs text-muted-foreground">
                        {formatDate(reminder.dueDate)}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        deleteReminder.mutate(
                          { reminderId: reminder.id, petId: reminder.petId },
                          { onSuccess: () => toast.success("Deleted") },
                        )
                      }
                      className="w-7 h-7 rounded-full hover:bg-red-50 flex items-center justify-center text-muted-foreground hover:text-destructive transition-colors"
                      data-ocid={`reminders.delete_button.${pendingReminders.length + idx + 1}`}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {activePetId && activePet && (
        <AddReminderModal
          open={addOpen}
          onOpenChange={setAddOpen}
          petId={activePetId}
          petName={activePet.name}
        />
      )}
    </div>
  );
}
