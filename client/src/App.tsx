import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import WelcomeScreen from "@/components/WelcomeScreen";
import MainApp from "@/components/MainApp";
import { services as localServices } from "@/data/services";

function App() {
  const [showWelcome, setShowWelcome] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  // Handle start button click
  const handleStart = () => {
    setShowWelcome(false);
  };

  return (
    <TooltipProvider>
      <AnimatePresence mode="wait">
        {showWelcome ? (
          <WelcomeScreen onStart={handleStart} key="welcome" />
        ) : (
          <MainApp services={localServices} isLoading={isLoading} key="main-app" />
        )}
      </AnimatePresence>
      <Toaster />
    </TooltipProvider>
  );
}

export default App;
