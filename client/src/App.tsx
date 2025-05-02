import { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import WelcomeScreen from "@/components/WelcomeScreen";
import MainApp from "@/components/MainApp";
import { useQuery } from "@tanstack/react-query";
import { Service } from "@/types";

function App() {
  const [showWelcome, setShowWelcome] = useState(true);

  // Fetch services from Firestore via our API
  const { data: services, isLoading } = useQuery<Service[]>({
    queryKey: ['/api/services'],
  });

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
          <MainApp services={services || []} isLoading={isLoading} key="main-app" />
        )}
      </AnimatePresence>
      <Toaster />
    </TooltipProvider>
  );
}

export default App;
