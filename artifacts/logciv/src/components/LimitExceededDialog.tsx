import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useLocation } from "wouter";
import { AlertTriangle } from "lucide-react";

interface LimitExceededDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentCount: number;
  maxCount: number;
  currentPlan: string;
}

export default function LimitExceededDialog({
  open,
  onOpenChange,
  currentCount,
  maxCount,
  currentPlan,
}: LimitExceededDialogProps) {
  const [, setLocation] = useLocation();

  const handleGoToPricing = () => {
    setLocation("/tarifs");
    onOpenChange(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="sm:max-w-md">
        <AlertDialogHeader className="gap-2">
          <div className="flex gap-3">
            <AlertTriangle className="h-6 w-6 text-orange-500 flex-shrink-0" />
            <AlertDialogTitle>Limite de publications atteinte</AlertDialogTitle>
          </div>
          <AlertDialogDescription className="text-base">
            Vous avez atteint la limite de <strong>{maxCount} annonce{maxCount > 1 ? "s" : ""}</strong> pour le plan <strong>{currentPlan}</strong>.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="bg-blue-50 rounded-lg border border-blue-200 p-4 my-4">
          <p className="text-sm text-gray-700">
            Vous utiliserez <strong>{currentCount + 1}/{maxCount}</strong> annonces après l'ajout de cette publication.
          </p>
          <p className="text-sm text-gray-600 mt-2">
            Passez à une offre premium pour publier plus d'annonces et accéder à des fonctionnalités exclusives.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <AlertDialogCancel>Annuler</AlertDialogCancel>
          <AlertDialogAction onClick={handleGoToPricing} className="bg-blue-600 hover:bg-blue-700">
            Voir les offres
          </AlertDialogAction>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
