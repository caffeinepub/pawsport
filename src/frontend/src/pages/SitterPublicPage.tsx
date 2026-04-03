import { Skeleton } from "@/components/ui/skeleton";
import { useParams } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { Calendar, Cat, Dog, FileText, PawPrint, Weight } from "lucide-react";
import { usePetByToken } from "../hooks/useQueries";

export function SitterPublicPage() {
  const { token } = useParams({ from: "/share/$token" });
  const { data: pet, isLoading, isError } = usePetByToken(token);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center p-4">
        <div className="bg-card-bg rounded-3xl border border-warm-border shadow-card-hover p-8 w-full max-w-md text-center">
          <Skeleton className="w-20 h-20 rounded-full mx-auto mb-4" />
          <Skeleton className="h-6 w-32 mx-auto mb-2" />
          <Skeleton className="h-4 w-24 mx-auto" />
        </div>
      </div>
    );
  }

  if (isError || !pet) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center p-4">
        <div className="bg-card-bg rounded-3xl border border-warm-border shadow-card-hover p-8 w-full max-w-md text-center">
          <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center mx-auto mb-4">
            <PawPrint className="w-8 h-8 text-muted-foreground" />
          </div>
          <h1 className="text-xl font-bold text-navy mb-2">Link Not Found</h1>
          <p className="text-muted-foreground text-sm mb-6">
            This share link may have expired or is invalid.
          </p>
          <Link to="/">
            <span className="text-orange text-sm font-medium hover:underline">
              Back to Pawsport
            </span>
          </Link>
        </div>
      </div>
    );
  }

  const photoUrl = pet.photoBlob.getDirectURL();

  return (
    <div className="min-h-screen bg-cream">
      {/* Header */}
      <header className="bg-dark-btn border-b border-white/10 h-14 flex items-center px-4">
        <div className="max-w-2xl mx-auto w-full flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-orange flex items-center justify-center">
              <PawPrint className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-white font-bold">Pawsport</span>
          </div>
          <span className="text-white/50 text-xs">Shared pet profile</span>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8">
        {/* Pet profile card */}
        <div className="bg-card-bg rounded-3xl border border-warm-border shadow-card-hover overflow-hidden mb-6">
          {/* Photo header */}
          <div className="h-48 bg-pale-blue relative">
            {photoUrl ? (
              <img
                src={photoUrl}
                alt={pet.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                {pet.species === "Dog" ? (
                  <Dog className="w-16 h-16 text-navy/30" />
                ) : pet.species === "Cat" ? (
                  <Cat className="w-16 h-16 text-navy/30" />
                ) : (
                  <PawPrint className="w-16 h-16 text-navy/30" />
                )}
              </div>
            )}
          </div>

          <div className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-2xl font-bold text-navy">{pet.name}</h1>
                <p className="text-muted-foreground">
                  {pet.breed} · {pet.species}
                </p>
              </div>
              <div className="bg-orange/10 rounded-xl px-3 py-1.5">
                <span className="text-orange text-xs font-bold">Read Only</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-5">
              <div className="bg-pale-blue/20 rounded-xl p-3">
                <div className="flex items-center gap-1.5 mb-1">
                  <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">Age</span>
                </div>
                <span className="font-bold text-navy">
                  {Number(pet.age)} years
                </span>
              </div>
              <div className="bg-pale-blue/20 rounded-xl p-3">
                <div className="flex items-center gap-1.5 mb-1">
                  <Weight className="w-3.5 h-3.5 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">Weight</span>
                </div>
                <span className="font-bold text-navy">
                  {Number(pet.weight) > 0
                    ? `${Number(pet.weight)} kg`
                    : "Not set"}
                </span>
              </div>
            </div>

            {pet.notes && (
              <div className="border-t border-warm-border pt-4">
                <div className="flex items-center gap-1.5 mb-2">
                  <FileText className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-semibold text-navy">Notes</span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {pet.notes}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center">
          <p className="text-xs text-muted-foreground">
            Shared via{" "}
            <Link to="/">
              <span className="text-orange font-semibold hover:underline">
                Pawsport
              </span>
            </Link>{" "}
            — The AI-Powered Pet Health Tracker
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            &copy; {new Date().getFullYear()}. Built with ❤ using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
              className="hover:text-navy transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </main>
    </div>
  );
}
