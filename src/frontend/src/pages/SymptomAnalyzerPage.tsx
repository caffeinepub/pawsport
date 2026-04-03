import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertCircle,
  AlertTriangle,
  Brain,
  CheckCircle,
  ImageIcon,
  Loader2,
  PawPrint,
  Upload,
} from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { ExternalBlob } from "../backend";
import { formatDate } from "../data/sampleData";
import {
  useMyPets,
  usePetSymptomAssessments,
  useSubmitSymptomReport,
} from "../hooks/useQueries";

function getRiskLevel(result: string): "high" | "moderate" | "low" {
  const upper = result.toUpperCase();
  if (upper.includes("HIGH RISK")) return "high";
  if (upper.includes("MODERATE RISK")) return "moderate";
  return "low";
}

export function SymptomAnalyzerPage() {
  const [selectedPetId, setSelectedPetId] = useState<string | null>(null);
  const [description, setDescription] = useState("");
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [latestResult, setLatestResult] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: pets = [] } = useMyPets();
  const activePetId = selectedPetId ?? pets[0]?.id ?? null;

  const { data: assessments = [], isLoading: loadingAssessments } =
    usePetSymptomAssessments(activePetId);
  const submitReport = useSubmitSymptomReport();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activePetId) {
      toast.error("Please select a pet");
      return;
    }
    if (!description.trim()) {
      toast.error("Please describe the symptoms");
      return;
    }

    let photoBlob: ExternalBlob | null = null;
    if (photoFile) {
      const buf = await photoFile.arrayBuffer();
      photoBlob = ExternalBlob.fromBytes(new Uint8Array(buf));
    }

    submitReport.mutate(
      { petId: activePetId, description, photoBlob },
      {
        onSuccess: (result) => {
          setLatestResult(result);
          setDescription("");
          setPhotoFile(null);
          toast.success("Assessment complete!");
        },
        onError: (err) => toast.error(err.message || "Assessment failed"),
      },
    );
  };

  const riskIcon = latestResult ? getRiskLevel(latestResult) : null;

  return (
    <div className="p-6 max-w-3xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-navy">Symptom Analyzer</h1>
        <p className="text-muted-foreground text-sm mt-0.5">
          Describe symptoms and get AI-powered health assessments
        </p>
      </div>

      {/* Pet selector */}
      <div className="flex flex-wrap gap-2 mb-6">
        {pets.map((pet) => (
          <button
            key={pet.id}
            type="button"
            onClick={() => setSelectedPetId(pet.id)}
            data-ocid="symptoms.tab"
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

      {/* Submission form */}
      <form
        onSubmit={handleSubmit}
        className="bg-card-bg rounded-2xl border border-warm-border p-5 mb-6 shadow-card"
      >
        <div className="flex items-center gap-2 mb-4">
          <Brain className="w-5 h-5 text-orange" />
          <h2 className="font-bold text-navy">Describe Symptoms</h2>
        </div>

        <Textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe what you've noticed: behavior changes, physical symptoms, appetite, activity level..."
          className="text-sm min-h-[100px] resize-none border-warm-border mb-3"
          data-ocid="symptoms.textarea"
        />

        <div className="flex items-center gap-3 mb-4">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground bg-pale-blue/30 hover:bg-pale-blue/50 rounded-xl border border-warm-border transition-colors"
            data-ocid="symptoms.upload_button"
          >
            <Upload className="w-4 h-4" />
            {photoFile ? photoFile.name : "Attach Photo (optional)"}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => setPhotoFile(e.target.files?.[0] ?? null)}
          />
          {photoFile && (
            <button
              type="button"
              onClick={() => setPhotoFile(null)}
              className="text-xs text-muted-foreground hover:text-destructive transition-colors"
            >
              Remove
            </button>
          )}
        </div>

        <Button
          type="submit"
          disabled={submitReport.isPending || !activePetId}
          className="w-full bg-orange text-white hover:bg-orange/90 rounded-pill font-semibold"
          data-ocid="symptoms.submit_button"
        >
          {submitReport.isPending ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Analyzing…
            </>
          ) : (
            <>
              <Brain className="w-4 h-4 mr-2" /> Analyze Symptoms
            </>
          )}
        </Button>
      </form>

      {/* Latest result */}
      {submitReport.isPending && (
        <div
          className="bg-pale-blue/20 rounded-2xl border border-pale-blue p-5 mb-4 animate-pulse"
          data-ocid="symptoms.loading_state"
        >
          <div className="flex items-center gap-2 mb-2">
            <Loader2 className="w-4 h-4 text-navy animate-spin" />
            <span className="text-sm font-medium text-navy">
              AI is analyzing symptoms…
            </span>
          </div>
        </div>
      )}

      {latestResult && (
        <div
          className={`rounded-2xl border p-5 mb-6 ${
            riskIcon === "high"
              ? "bg-red-50 border-red-200"
              : riskIcon === "moderate"
                ? "bg-orange-50 border-orange-200"
                : "bg-green-50 border-green-200"
          }`}
          data-ocid="symptoms.success_state"
        >
          <div className="flex items-center gap-2 mb-2">
            {riskIcon === "high" ? (
              <AlertTriangle className="w-5 h-5 text-red-600" />
            ) : riskIcon === "moderate" ? (
              <AlertCircle className="w-5 h-5 text-orange-600" />
            ) : (
              <CheckCircle className="w-5 h-5 text-green-600" />
            )}
            <span
              className={`text-sm font-bold ${
                riskIcon === "high"
                  ? "text-red-700"
                  : riskIcon === "moderate"
                    ? "text-orange-700"
                    : "text-green-700"
              }`}
            >
              AI Assessment Result
            </span>
          </div>
          <p className="text-sm leading-relaxed text-foreground">
            {latestResult}
          </p>
        </div>
      )}

      {/* Past assessments */}
      <div>
        <h2 className="font-bold text-navy mb-3 flex items-center gap-2">
          <ImageIcon className="w-4 h-4 text-muted-foreground" />
          Past Assessments
        </h2>
        {loadingAssessments ? (
          <div className="space-y-3" data-ocid="symptoms.loading_state">
            {[1, 2].map((i) => (
              <Skeleton key={i} className="h-24 rounded-xl" />
            ))}
          </div>
        ) : assessments.length === 0 ? (
          <div
            className="text-center py-10 bg-card-bg rounded-2xl border border-warm-border"
            data-ocid="symptoms.empty_state"
          >
            <PawPrint className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">No past assessments</p>
          </div>
        ) : (
          <div className="space-y-3" data-ocid="symptoms.list">
            {assessments.map((a, idx) => (
              <div
                key={a.id}
                className="bg-card-bg rounded-xl border border-warm-border p-4 shadow-card"
                data-ocid={`symptoms.item.${idx + 1}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-muted-foreground">
                    {formatDate(a.createdAt)}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      getRiskLevel(a.assessmentResult) === "high"
                        ? "bg-red-100 text-red-700"
                        : getRiskLevel(a.assessmentResult) === "moderate"
                          ? "bg-orange-100 text-orange-700"
                          : "bg-green-100 text-green-700"
                    }`}
                  >
                    {getRiskLevel(a.assessmentResult).toUpperCase()} RISK
                  </span>
                </div>
                <p className="text-xs text-navy font-medium mb-1">
                  Symptoms: {a.symptomDescription}
                </p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {a.assessmentResult}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
