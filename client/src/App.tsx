import { useEffect, useState, useRef } from "react";
import { AnimatePresence } from "framer-motion";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import WelcomeScreen from "@/components/WelcomeScreen";
import MainApp from "@/components/MainApp";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Service } from "@/types";
import { fetchServicesFromCatalog, setServiceCatalogBaseUrl } from "@/lib/serviceCatalogApi";
import { toast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// Typ dla źródła danych
type DataSource = 'local' | 'serviceCatalog';

function App() {
  const [showWelcome, setShowWelcome] = useState(true);
  // Określa, z którego źródła pobieramy dane
  const [dataSource, setDataSource] = useState<DataSource>('local');
  const [showSettings, setShowSettings] = useState(false);
  const [serviceUrl, setServiceUrl] = useState("https://servicecatalog.replit.app");
  
  const queryClient = useQueryClient();
  
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
    isError: isCatalogError,
    error: catalogErrorDetails
  } = useQuery<Service[]>({
    queryKey: ['serviceCatalog', 'services'],
    queryFn: fetchServicesFromCatalog,
    retry: 1,
    enabled: dataSource === 'serviceCatalog' // aktywne tylko dla ServiceCatalog
  });
  
  // Obsługa błędów i przełączanie na lokalne dane w przypadku problemów
  useEffect(() => {
    if (isCatalogError && dataSource === 'serviceCatalog') {
      console.error('Nie udało się pobrać danych z ServiceCatalog', catalogErrorDetails);
      // Przełącz na lokalne dane w przypadku błędu
      setDataSource('local');
      toast({
        title: "Błąd integracji",
        description: `Nie udało się połączyć z ServiceCatalog. Używam lokalnych danych. Błąd: ${catalogErrorDetails instanceof Error ? catalogErrorDetails.message : 'Nieznany błąd'}`,
        variant: "destructive"
      });
    }
  }, [isCatalogError, dataSource, catalogErrorDetails]);

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
      description: `Używam danych z ${newSource === 'local' ? 'lokalnego API' : 'ServiceCatalog'}`
    });
  };
  
  // Zmiana URL ServiceCatalog
  const handleServiceUrlChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setServiceUrl(event.target.value);
  };
  
  // Zastosowanie nowego URL i odświeżenie danych
  const applyServiceUrlChange = () => {
    setServiceCatalogBaseUrl(serviceUrl);
    // Resetowanie cache dla zapytania
    queryClient.invalidateQueries({queryKey: ['serviceCatalog', 'services']});
    toast({
      title: "Zaktualizowano URL",
      description: `ServiceCatalog URL zmieniony na: ${serviceUrl}`
    });
    
    // Jeśli jesteśmy w trybie lokalnym, przełączmy na ServiceCatalog
    if (dataSource === 'local') {
      setDataSource('serviceCatalog');
    }
  };

  return (
    <TooltipProvider>
      {/* Panel kontrolny źródła danych */}
      <div className="fixed top-0 right-0 bg-slate-800 text-white p-2 text-xs z-50 rounded-bl-lg shadow-md">
        <div className="flex flex-col space-y-2">
          <div className="flex items-center justify-between">
            <span>Źródło danych:</span>
            <div className="flex space-x-2">
              <button 
                onClick={toggleDataSource}
                className="px-2 py-1 rounded bg-blue-700 hover:bg-blue-600 transition-colors"
              >
                {dataSource === 'local' ? 'Lokalne API' : 'ServiceCatalog'} 
                {isLoading && ' (ładowanie...)'}
              </button>
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="px-2 py-1 rounded bg-gray-700 hover:bg-gray-600 transition-colors"
              >
                ⚙️
              </button>
            </div>
          </div>
          
          {showSettings && (
            <div className="pt-2 border-t border-gray-700">
              <div className="flex items-center space-x-2 mb-2">
                <Input
                  value={serviceUrl}
                  onChange={handleServiceUrlChange}
                  placeholder="URL ServiceCatalog"
                  className="h-7 text-xs text-black"
                />
                <Button
                  onClick={applyServiceUrlChange}
                  className="h-7 px-2 py-0 text-xs"
                  variant="secondary"
                >
                  Zastosuj
                </Button>
              </div>
            </div>
          )}
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
