import { useEffect, useState, useRef } from "react";
import { AnimatePresence } from "framer-motion";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import WelcomeScreen from "@/components/WelcomeScreen";
import MainApp from "@/components/MainApp";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { Service } from "@/types";
import { fetchServicesFromCatalog, setServiceCatalogBaseUrl } from "@/lib/serviceCatalogApi";
import { toast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { apiRequest } from "@/lib/queryClient";

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
              
              {/* Przyciski synchronizacji usług */}
              <div className="pt-2 border-t border-gray-700">
                <div className="flex flex-col space-y-2">
                  <button
                    onClick={async () => {
                      try {
                        // Najpierw pobierz usługi z ServiceCatalog
                        const servicesFromCatalog = await fetchServicesFromCatalog();
                        
                        if (!servicesFromCatalog || servicesFromCatalog.length === 0) {
                          toast({
                            title: "Brak usług",
                            description: "Nie znaleziono żadnych usług do synchronizacji w ServiceCatalog",
                            variant: "destructive"
                          });
                          return;
                        }
                        
                        // Wyślij usługi do synchronizacji
                        const response = await apiRequest(
                          `/api/admin/sync-from-servicecatalog?key=ecm-database-sharing-key`,
                          {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                              serviceUrl,
                              services: servicesFromCatalog
                            })
                          }
                        );
                        
                        // Odśwież listę usług
                        queryClient.invalidateQueries({queryKey: ['/api/services']});
                        
                        toast({
                          title: "Synchronizacja zakończona",
                          description: `Zsynchronizowano ${response.results.added} nowych i ${response.results.updated} zaktualizowanych usług.`
                        });
                        
                        // Jeśli używamy źródła ServiceCatalog, przełączmy na lokalne dane aby zobaczyć zsynchronizowane usługi
                        if (dataSource === 'serviceCatalog') {
                          setDataSource('local');
                        }
                        
                      } catch (error) {
                        console.error('Błąd podczas synchronizacji usług:', error);
                        toast({
                          title: "Błąd synchronizacji",
                          description: `Nie udało się zsynchronizować usług: ${error instanceof Error ? error.message : 'Nieznany błąd'}`,
                          variant: "destructive"
                        });
                      }
                    }}
                    className="w-full px-2 py-1 rounded bg-green-700 hover:bg-green-600 transition-colors"
                  >
                    Synchronizuj usługi z ServiceCatalog
                  </button>
                  
                  <button
                    onClick={async () => {
                      try {
                        // Pobierz dane przykładowych usług z bazy
                        const response = await apiRequest(
                          `/api/services`,
                          { method: 'GET' }
                        );
                        
                        // Sprawdź czy mamy jakieś usługi
                        if (!response || response.length === 0) {
                          toast({
                            title: "Brak usług",
                            description: "Nie znaleziono żadnych usług w lokalnej bazie danych",
                            variant: "destructive"
                          });
                          return;
                        }
                        
                        toast({
                          title: "Usługi załadowane",
                          description: `W lokalnej bazie danych znajduje się ${response.length} usług.`,
                          variant: "default"
                        });
                        
                        // Przełącz na lokalne źródło danych
                        if (dataSource !== 'local') {
                          setDataSource('local');
                        }
                        
                      } catch (error) {
                        console.error('Błąd podczas sprawdzania lokalnych usług:', error);
                        toast({
                          title: "Błąd",
                          description: `Nie udało się pobrać lokalnych usług: ${error instanceof Error ? error.message : 'Nieznany błąd'}`,
                          variant: "destructive"
                        });
                      }
                    }}
                    className="w-full px-2 py-1 rounded bg-blue-700 hover:bg-blue-600 transition-colors"
                  >
                    Użyj lokalnych usług
                  </button>
                  
                  {/* Ręczne dodawanie usług - dla przypadku gdy ServiceCatalog nie jest dostępny */}
                  <button
                    onClick={async () => {
                      try {
                        // Przykładowe nowe usługi do dodania
                        const exampleNewServices = [
                          {
                            id: "7",
                            name: "Projektowanie Logo",
                            description: "Profesjonalne projektowanie logo dla Twojej marki, z wieloma wersjami i plikami źródłowymi",
                            basePrice: 1500,
                            deliveryTime: 14,
                            features: [
                              "3 propozycje logo do wyboru",
                              "Nielimitowane poprawki wybranej wersji",
                              "Pliki źródłowe (AI, PSD)",
                              "Księga znaku"
                            ],
                            steps: [
                              {
                                id: "logo-styl",
                                title: "Styl logo",
                                layout: "grid",
                                options: [
                                  {
                                    id: "logo-styl-wybor",
                                    type: "select",
                                    label: "Wybierz styl logo",
                                    choices: [
                                      { label: "Minimalistyczne", value: "minimalistyczne", priceAdjustment: 0, deliveryTimeAdjustment: 0 },
                                      { label: "Ilustracyjne", value: "ilustracyjne", priceAdjustment: 500, deliveryTimeAdjustment: 3 },
                                      { label: "Typograficzne", value: "typograficzne", priceAdjustment: 200, deliveryTimeAdjustment: 1 },
                                      { label: "Vintage/Retro", value: "vintage", priceAdjustment: 300, deliveryTimeAdjustment: 2 }
                                    ]
                                  }
                                ]
                              },
                              {
                                id: "logo-dodatki",
                                title: "Dodatkowe opcje",
                                layout: "checkbox-grid",
                                options: [
                                  {
                                    id: "logo-wizytowki",
                                    type: "checkbox",
                                    label: "Projekt wizytówek",
                                    description: "Projekt wizytówek z nowym logo",
                                    priceAdjustment: 300,
                                    deliveryTimeAdjustment: 2
                                  },
                                  {
                                    id: "logo-papier-firmowy",
                                    type: "checkbox",
                                    label: "Papier firmowy",
                                    description: "Projekt papieru firmowego z nowym logo",
                                    priceAdjustment: 200,
                                    deliveryTimeAdjustment: 1
                                  }
                                ]
                              }
                            ]
                          },
                          {
                            id: "8",
                            name: "Copywriting SEO",
                            description: "Profesjonalne teksty zoptymalizowane pod kątem SEO dla Twojej strony internetowej",
                            basePrice: 800,
                            deliveryTime: 7,
                            features: [
                              "Analiza słów kluczowych",
                              "Optymalizacja pod wyszukiwarki",
                              "Formatowanie tekstu",
                              "Dwie rundy poprawek"
                            ],
                            steps: [
                              {
                                id: "copywriting-ilosc",
                                title: "Ilość tekstu",
                                layout: "grid",
                                options: [
                                  {
                                    id: "copywriting-strony",
                                    type: "select",
                                    label: "Liczba stron",
                                    choices: [
                                      { label: "1 strona (do 500 słów)", value: "1", priceAdjustment: 0, deliveryTimeAdjustment: 0 },
                                      { label: "3 strony (do 1500 słów)", value: "3", priceAdjustment: 700, deliveryTimeAdjustment: 3 },
                                      { label: "5 stron (do 2500 słów)", value: "5", priceAdjustment: 1500, deliveryTimeAdjustment: 5 },
                                      { label: "10 stron (do 5000 słów)", value: "10", priceAdjustment: 3000, deliveryTimeAdjustment: 10 }
                                    ]
                                  }
                                ]
                              },
                              {
                                id: "copywriting-dodatki",
                                title: "Dodatkowe opcje",
                                layout: "checkbox-grid",
                                options: [
                                  {
                                    id: "copywriting-meta",
                                    type: "checkbox",
                                    label: "Meta tagi",
                                    description: "Przygotowanie meta tytułów i opisów dla stron",
                                    priceAdjustment: 200,
                                    deliveryTimeAdjustment: 1
                                  },
                                  {
                                    id: "copywriting-blog",
                                    type: "checkbox",
                                    label: "Artykuły na blog",
                                    description: "Dodatkowe artykuły na blog (2000 słów)",
                                    priceAdjustment: 600,
                                    deliveryTimeAdjustment: 3
                                  }
                                ]
                              }
                            ]
                          }
                        ];
                        
                        // Pytanie użytkownika o potwierdzenie
                        if (!confirm(`Czy chcesz dodać 2 nowe usługi do bazy danych?\n- Projektowanie Logo\n- Copywriting SEO`)) {
                          return;
                        }
                        
                        // Wyślij usługi do importu
                        const response = await apiRequest(
                          `/api/admin/import-services`,
                          {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                              services: exampleNewServices
                            })
                          }
                        );
                        
                        // Odśwież listę usług
                        queryClient.invalidateQueries({queryKey: ['/api/services']});
                        
                        toast({
                          title: "Dodano nowe usługi",
                          description: `Pomyślnie dodano ${response.count} nowych usług do bazy danych.`,
                          variant: "default"
                        });
                        
                        // Przełącz na lokalne źródło danych
                        if (dataSource !== 'local') {
                          setDataSource('local');
                        }
                        
                      } catch (error) {
                        console.error('Błąd podczas dodawania nowych usług:', error);
                        toast({
                          title: "Błąd",
                          description: `Nie udało się dodać nowych usług: ${error instanceof Error ? error.message : 'Nieznany błąd'}`,
                          variant: "destructive"
                        });
                      }
                    }}
                    className="w-full px-2 py-1 rounded bg-green-700 hover:bg-green-600 transition-colors mt-2"
                  >
                    Dodaj przykładowe nowe usługi
                  </button>
                  
                  {/* Przycisk do połączenia baz danych */}
                  <button
                    onClick={async () => {
                      try {
                        // Pobierz konfigurację bazy danych
                        const response = await apiRequest(
                          `/api/admin/database-config?key=ecm-database-sharing-key`,
                          { method: 'GET' }
                        );
                        
                        if (!response || !response.connectionUrl) {
                          toast({
                            title: "Błąd",
                            description: "Nie udało się pobrać konfiguracji bazy danych",
                            variant: "destructive"
                          });
                          return;
                        }
                        
                        // Przygotowanie URL do ServiceCatalog
                        const scUrl = prompt("Podaj URL aplikacji ServiceCatalog (z https://):", "https://servicecatalog.replit.app");
                        
                        if (!scUrl) return;
                        
                        // Potwierdzenie użytkownika
                        if (!confirm(`Czy na pewno chcesz połączyć bazy danych?\n\nURL ServiceCatalog: ${scUrl}\n\nUwaga: Spowoduje to NADPISANIE bazy danych w ServiceCatalog danymi z ECM Digital!`)) {
                          return;
                        }

                        // Próba wysłania konfiguracji bazy danych do ServiceCatalog
                        const sendConfig = await fetch(`${scUrl}/api/admin/connect-to-ecm-database?key=ecm-database-sharing-key`, {
                          method: 'POST',
                          headers: {
                            'Content-Type': 'application/json'
                          },
                          body: JSON.stringify(response)
                        });
                        
                        if (!sendConfig.ok) {
                          const errorText = await sendConfig.text();
                          throw new Error(`Nie udało się połączyć z ServiceCatalog: ${sendConfig.status} ${errorText}`);
                        }
                        
                        const result = await sendConfig.json();
                        
                        toast({
                          title: "Sukces",
                          description: `Pomyślnie połączono bazę danych z ServiceCatalog: ${result.message}`,
                          variant: "default"
                        });
                        
                      } catch (error) {
                        console.error('Błąd podczas łączenia baz danych:', error);
                        toast({
                          title: "Błąd połączenia",
                          description: `Nie udało się połączyć baz danych: ${error instanceof Error ? error.message : 'Nieznany błąd'}`,
                          variant: "destructive"
                        });
                      }
                    }}
                    className="w-full px-2 py-1 rounded bg-purple-700 hover:bg-purple-600 transition-colors mt-2"
                  >
                    Połącz bazy danych z ServiceCatalog
                  </button>
                </div>
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
