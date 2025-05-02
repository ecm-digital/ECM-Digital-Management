import { useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import WelcomeScreen from "@/components/WelcomeScreen";
import MainApp from "@/components/MainApp";
import { useQuery } from "@tanstack/react-query";
import { Service } from "@/types";
import { fetchServicesFromCatalog } from "@/lib/serviceCatalogApi";
import { toast } from "@/hooks/use-toast";

// Typ dla źródła danych
type DataSource = 'local' | 'serviceCatalog';

function App() {
  const [showWelcome, setShowWelcome] = useState(true);
  // Określa, z którego źródła pobieramy dane
  const [dataSource, setDataSource] = useState<DataSource>('local');
  
  // Fetch services from our PostgreSQL database via API
  const { 
    data: localServices, 
    isLoading: isLocalLoading 
  } = useQuery<Service[]>({
    queryKey: ['/api/services'],
    enabled: dataSource === 'local', // aktywne tylko dla lokalnego źródła
  });

  // Pobieranie usług z ServiceCatalog
  const {
    data: catalogServices,
    isLoading: isCatalogLoading,
    isError: isCatalogError
  } = useQuery({
    queryKey: ['serviceCatalog', 'services'],
    queryFn: fetchServicesFromCatalog,
    retry: 1,
    enabled: dataSource === 'serviceCatalog', // aktywne tylko dla ServiceCatalog
    onError: (error) => {
      console.error('Nie udało się pobrać danych z ServiceCatalog:', error);
      // Przełącz na lokalne dane w przypadku błędu
      setDataSource('local');
      toast({
        title: "Błąd integracji",
        description: "Nie udało się połączyć z ServiceCatalog. Używam lokalnych danych.",
        variant: "destructive"
      });
    }
  });

  // Wybierz odpowiednie dane i stan na podstawie źródła
  const services = dataSource === 'local' ? localServices : catalogServices;
  const isLoading = dataSource === 'local' ? isLocalLoading : isCatalogLoading;

  // Handle start button click
  const handleStart = () => {
    setShowWelcome(false);
  };

  // Przełącznik źródła danych
  const toggleDataSource = () => {
    const newSource = dataSource === 'local' ? 'serviceCatalog' : 'local';
    setDataSource(newSource);
    toast({
      title: "Zmieniono źródło danych",
      description: `Używam danych z ${newSource === 'local' ? 'lokalnego API' : 'ServiceCatalog'}`,
    });
  };

  return (
    <TooltipProvider>
      {/* Panel kontrolny źródła danych */}
      <div className="fixed top-0 right-0 bg-slate-800 text-white p-2 text-xs z-50 rounded-bl-lg shadow-md">
        <div className="flex items-center space-x-2">
          <span>Źródło danych:</span>
          <button 
            onClick={toggleDataSource}
            className="px-2 py-1 rounded bg-blue-700 hover:bg-blue-600 transition-colors"
          >
            {dataSource === 'local' ? 'Lokalne API' : 'ServiceCatalog'} 
            {isLoading && ' (ładowanie...)'}
          </button>
        </div>
      </div>

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
