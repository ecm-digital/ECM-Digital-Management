import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowLeft, Loader2 } from "lucide-react";

interface NavigationButtonsProps {
  onBack: () => void;
  onNext: () => void;
  isFirstStep: boolean;
  isLastStep?: boolean;
  isSubmitting: boolean;
}

export default function NavigationButtons({
  onBack,
  onNext,
  isFirstStep,
  isLastStep = false,
  isSubmitting
}: NavigationButtonsProps) {
  return (
    <div className="flex justify-between">
      <Button
        variant="outline"
        onClick={onBack}
        disabled={isFirstStep || isSubmitting}
        style={{ visibility: isFirstStep ? "hidden" : "visible" }}
        className="px-6 py-3 border border-gray-300 text-dark-light font-medium rounded-lg hover:bg-gray-50 transition-colors flex items-center"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Wstecz
      </Button>
      
      <Button
        onClick={onNext}
        disabled={isSubmitting}
        className="px-6 py-3 bg-accent hover:bg-accent/90 text-white font-medium rounded-lg transition-colors flex items-center"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Przetwarzanie...
          </>
        ) : (
          <>
            {isLastStep ? "Zamawiam" : "Dalej"}
            <ArrowRight className="h-4 w-4 ml-2" />
          </>
        )}
      </Button>
    </div>
  );
}
