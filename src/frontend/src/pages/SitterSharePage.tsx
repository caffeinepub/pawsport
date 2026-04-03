import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { CheckCheck, Copy, Link, PawPrint, Share2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useGenerateSitterToken, useMyPets } from "../hooks/useQueries";

export function SitterSharePage() {
  const [selectedPetId, setSelectedPetId] = useState<string | null>(null);
  const [generatedUrl, setGeneratedUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const { data: pets = [] } = useMyPets();
  const activePetId = selectedPetId ?? pets[0]?.id ?? null;
  const activePet = pets.find((p) => p.id === activePetId);

  const generateToken = useGenerateSitterToken();

  const handleGenerate = () => {
    if (!activePetId) {
      toast.error("Please select a pet");
      return;
    }
    generateToken.mutate(activePetId, {
      onSuccess: (token) => {
        const url = `${window.location.origin}/share/${token}`;
        setGeneratedUrl(url);
        toast.success("Share link generated!");
      },
      onError: () => toast.error("Failed to generate link"),
    });
  };

  const handleCopy = () => {
    if (!generatedUrl) return;
    navigator.clipboard.writeText(generatedUrl).then(() => {
      setCopied(true);
      toast.success("Link copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="p-6 max-w-2xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-navy">Sitter Share</h1>
        <p className="text-muted-foreground text-sm mt-0.5">
          Generate a secure, read-only link to share your pet’s health info with
          a sitter or kennel
        </p>
      </div>

      {/* Pet selector */}
      <div className="flex flex-wrap gap-2 mb-6">
        {pets.map((pet) => (
          <button
            key={pet.id}
            type="button"
            onClick={() => {
              setSelectedPetId(pet.id);
              setGeneratedUrl(null);
            }}
            data-ocid="share.tab"
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

      {/* Pet info card */}
      {activePet && (
        <div className="bg-pale-blue/20 rounded-2xl border border-pale-blue p-5 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-pale-blue flex items-center justify-center">
              <PawPrint className="w-6 h-6 text-navy" />
            </div>
            <div>
              <h3 className="font-bold text-navy">{activePet.name}</h3>
              <p className="text-sm text-muted-foreground">
                {activePet.breed} · {activePet.species}
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <span className="text-xs text-muted-foreground block">Age</span>
              <span className="font-medium text-navy">
                {Number(activePet.age)} years
              </span>
            </div>
            <div>
              <span className="text-xs text-muted-foreground block">
                Weight
              </span>
              <span className="font-medium text-navy">
                {Number(activePet.weight) > 0
                  ? `${Number(activePet.weight)} kg`
                  : "Not set"}
              </span>
            </div>
          </div>
          {activePet.notes && (
            <div className="mt-3 pt-3 border-t border-pale-blue/50">
              <span className="text-xs text-muted-foreground block mb-1">
                Notes
              </span>
              <p className="text-sm text-navy">{activePet.notes}</p>
            </div>
          )}
        </div>
      )}

      {/* Generate button */}
      <Button
        onClick={handleGenerate}
        disabled={generateToken.isPending || !activePetId}
        className="w-full bg-dark-btn text-white hover:bg-dark-btn/90 rounded-pill font-semibold mb-4 gap-2"
        data-ocid="share.primary_button"
      >
        <Share2 className="w-4 h-4" />
        {generateToken.isPending ? "Generating…" : "Generate Share Link"}
      </Button>

      {/* Generated URL */}
      {generatedUrl && (
        <div
          className="bg-card-bg rounded-2xl border border-warm-border p-5 shadow-card"
          data-ocid="share.success_state"
        >
          <div className="flex items-center gap-2 mb-3">
            <Link className="w-4 h-4 text-orange" />
            <span className="font-medium text-navy text-sm">
              Share Link Ready
            </span>
          </div>
          <div className="flex gap-2">
            <Input
              value={generatedUrl}
              readOnly
              className="text-xs font-mono bg-pale-blue/20 border-warm-border flex-1"
              data-ocid="share.input"
            />
            <Button
              onClick={handleCopy}
              variant="outline"
              size="sm"
              className="flex-shrink-0 border-warm-border gap-1.5"
              data-ocid="share.secondary_button"
            >
              {copied ? (
                <>
                  <CheckCheck className="w-4 h-4 text-health-green" /> Copied!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" /> Copy
                </>
              )}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Share this link with your pet sitter. They’ll see a read-only view
            of {activePet?.name}’s health info.
          </p>
        </div>
      )}

      {/* Info box */}
      <div className="mt-6 bg-card-bg rounded-xl border border-warm-border p-4">
        <h3 className="text-sm font-semibold text-navy mb-2">
          What sitters will see
        </h3>
        <ul className="space-y-1">
          {[
            "Pet profile: name, species, breed, age",
            "Photo",
            "Notes and special requirements",
          ].map((item) => (
            <li
              key={item}
              className="text-xs text-muted-foreground flex items-start gap-2"
            >
              <span className="text-health-green mt-0.5">•</span>
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
