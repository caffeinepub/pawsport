import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle, Loader2, Save, User } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useSaveUserProfile, useUserProfile } from "../hooks/useQueries";

export function SettingsPage() {
  const [name, setName] = useState("");
  const [saved, setSaved] = useState(false);

  const { data: profile } = useUserProfile();
  const saveProfile = useSaveUserProfile();
  const { identity } = useInternetIdentity();

  useEffect(() => {
    if (profile?.name) {
      setName(profile.name);
    }
  }, [profile?.name]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    saveProfile.mutate(
      { name },
      {
        onSuccess: () => {
          setSaved(true);
          toast.success("Settings saved!");
          setTimeout(() => setSaved(false), 2000);
        },
        onError: () => toast.error("Failed to save settings"),
      },
    );
  };

  const principal = identity?.getPrincipal().toString();

  return (
    <div className="p-6 max-w-xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-navy">Settings</h1>
        <p className="text-muted-foreground text-sm mt-0.5">
          Manage your account and preferences
        </p>
      </div>

      <div className="bg-card-bg rounded-2xl border border-warm-border p-6 shadow-card mb-4">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-12 h-12 rounded-full bg-orange/10 flex items-center justify-center">
            <User className="w-6 h-6 text-orange" />
          </div>
          <div>
            <h2 className="font-bold text-navy">Profile</h2>
            {principal && (
              <p className="text-xs text-muted-foreground font-mono">
                ID: {principal.slice(0, 20)}…
              </p>
            )}
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div className="space-y-1.5">
            <Label
              htmlFor="settings-name"
              className="text-sm font-medium text-navy"
            >
              Display Name
            </Label>
            <Input
              id="settings-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              className="border-warm-border"
              data-ocid="settings.input"
            />
          </div>

          <Button
            type="submit"
            disabled={saveProfile.isPending}
            className="w-full bg-orange text-white hover:bg-orange/90 rounded-pill font-semibold gap-2"
            data-ocid="settings.save_button"
          >
            {saveProfile.isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Saving…
              </>
            ) : saved ? (
              <>
                <CheckCircle className="w-4 h-4" /> Saved!
              </>
            ) : (
              <>
                <Save className="w-4 h-4" /> Save Settings
              </>
            )}
          </Button>
        </form>
      </div>

      <div className="bg-pale-blue/20 rounded-xl border border-pale-blue p-4">
        <h3 className="text-sm font-semibold text-navy mb-1">
          Internet Identity
        </h3>
        <p className="text-xs text-muted-foreground">
          Your account is secured by Internet Identity. No password required.
          Your data is stored securely on the blockchain.
        </p>
      </div>
    </div>
  );
}
