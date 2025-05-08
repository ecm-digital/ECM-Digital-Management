import { useEffect, useState, lazy, Suspense } from "react";
import { AnimatePresence } from "framer-motion";
import { Route, Switch, Link } from 'wouter';
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Service } from "@/types";
import { fetchServicesFromCatalog, setServiceCatalogBaseUrl } from "@/lib/serviceCatalogApi";
import { toast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { apiRequest } from "@/lib/queryClient";

// Komponent do ładowania
import { Loader } from "lucide-react";

// Głowne komponenty
import WelcomeScreen from "@/components/WelcomeScreen";
import MainApp from "@/components/MainApp";
import ChatWidget from "@/components/chat/ChatWidget";
import NotFound from "@/pages/not-found";

// Leniwe ładowanie komponentów stron
const ClientHomePage = lazy(() => import("@/pages/ClientHomePage"));
const ServicesPage = lazy(() => import("@/pages/ServicesPage"));
const ServiceDetailsPage = lazy(() => import("@/components/ServiceDetailsPage"));
const ConfigureServicePage = lazy(() => import("@/pages/ConfigureServicePage"));
const AdminPage = lazy(() => import("@/pages/AdminPage"));
const AboutPage = lazy(() => import("@/pages/AboutPage"));

// Leniwe ładowanie case studies
const CaseStudyOne = lazy(() => import("@/pages/case-studies/CaseStudyOne"));
const CaseStudyTwo = lazy(() => import("@/pages/case-studies/CaseStudyTwo"));

// Leniwe ładowanie panelu klienta
const ClientDashboardPage = lazy(() => import("@/pages/ClientDashboardPage"));
const ClientOrdersPage = lazy(() => import("@/pages/ClientOrdersPage"));
const ClientOrderDetailsPage = lazy(() => import("@/pages/ClientOrderDetailsPage"));
const ClientProfilePage = lazy(() => import("@/pages/ClientProfilePage"));

// Leniwe ładowanie sekcji blog
const BlogPage = lazy(() => import("./pages/BlogPage"));
const BlogPostPage = lazy(() => import("./pages/BlogPostPage"));
const BlogSearchPage = lazy(() => import("./pages/BlogSearchPage"));

// Leniwe ładowanie sekcji Knowledge Base
const KnowledgeBasePage = lazy(() => import("./pages/KnowledgeBasePage"));
const KnowledgeArticlePage = lazy(() => import("./pages/KnowledgeArticlePage"));
const KnowledgeSearchPage = lazy(() => import("./pages/KnowledgeSearchPage"));

// Komponent do wyświetlania podczas ładowania
const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="flex flex-col items-center">
      <Loader className="w-12 h-12 text-green-600 animate-spin" />
      <p className="mt-4 text-lg text-gray-700">Ładowanie...</p>
    </div>
  </div>
);

// Typ dla źródła danych
type DataSource = 'local' | 'serviceCatalog';

function HomePage() {
  const [showWelcome, setShowWelcome] = useState(true);
  const [dataSource, setDataSource] = useState<DataSource>('local');
  const [showSettings, setShowSettings] = useState(false);
  const [serviceUrl, setServiceUrl] = useState("https://servicecatalog.replit.app");
  
  const queryClient = useQueryClient();
  
  // Pobierz aktualny język - użyj useMemo do uniknięcia zbędnych renderów
  const currentLanguage = useState(() => localStorage.getItem('i18nextLng') || 'pl')[0];
  
  // Pobieranie usług z lokalnej bazy z parametrem języka - zoptymalizowane
  const { 
    data: localServices, 
    isLoading: isLocalLoading 
  } = useQuery<Service[]>({
    queryKey: ['/api/services', currentLanguage],
    queryFn: () => apiRequest(`/api/services?lang=${currentLanguage}`),
    enabled: dataSource === 'local',
    staleTime: 30000, // 30 sekund zanim dane staną się "stare"
    gcTime: 300000, // 5 minut przechowywania w cache (zastąpiło cacheTime w TanStack Query v5)
  });

  // Pobieranie usług z ServiceCatalog - zoptymalizowane
  const {
    data: catalogServices,
    isLoading: isCatalogLoading,
    isError: isCatalogError,
    error: catalogErrorDetails
  } = useQuery<Service[]>({
    queryKey: ['serviceCatalog', 'services'],
    queryFn: fetchServicesFromCatalog,
    retry: 1,
    enabled: dataSource === 'serviceCatalog',
    staleTime: 60000, // 1 minuta zanim dane staną się "stare"
    gcTime: 300000, // 5 minut przechowywania w cache (zastąpiło cacheTime w TanStack Query v5)
  });
  
  // Obsługa błędów
  useEffect(() => {
    if (isCatalogError && dataSource === 'serviceCatalog') {
      console.error('Nie udało się pobrać danych z ServiceCatalog', catalogErrorDetails);
      setDataSource('local');
      toast({
        title: "Błąd integracji",
        description: `Nie udało się połączyć z ServiceCatalog. Używam lokalnych danych. Błąd: ${catalogErrorDetails instanceof Error ? catalogErrorDetails.message : 'Nieznany błąd'}`,
        variant: "destructive"
      });
    }
  }, [isCatalogError, dataSource, catalogErrorDetails]);

  // Wybór źródła danych - użyj useMemo do uniknięcia zbędnych obliczeń
  const services = dataSource === 'local' ? localServices : catalogServices;
  const isLoading = dataSource === 'local' ? isLocalLoading : isCatalogLoading;

  // Obsługa przycisku Start
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
  
  // Zastosowanie nowego URL
  const applyServiceUrlChange = () => {
    setServiceCatalogBaseUrl(serviceUrl);
    queryClient.invalidateQueries({queryKey: ['serviceCatalog', 'services']});
    toast({
      title: "Zaktualizowano URL",
      description: `ServiceCatalog URL zmieniony na: ${serviceUrl}`
    });
    
    if (dataSource === 'local') {
      setDataSource('serviceCatalog');
    }
  };

  return (
    <>
      {/* Panel kontrolny */}
      <div className="fixed top-0 right-0 bg-slate-800 text-white p-2 text-xs z-50 rounded-bl-lg shadow-md">
        <div className="flex flex-col space-y-2">
          <div className="flex items-center justify-between">
            <span>Źródło danych:</span>
            <div className="flex space-x-2">
              <Link href="/admin">
                <button className="px-2 py-1 rounded bg-purple-700 hover:bg-purple-600 transition-colors mr-2">
                  👑 Admin
                </button>
              </Link>
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
              
              {/* Przyciski operacji */}
              <div className="pt-2 border-t border-gray-700">
                <div className="flex flex-col space-y-2">
                  <button
                    onClick={async () => {
                      try {
                        const servicesFromCatalog = await fetchServicesFromCatalog();
                        
                        if (!servicesFromCatalog || servicesFromCatalog.length === 0) {
                          toast({
                            title: "Brak usług",
                            description: "Nie znaleziono żadnych usług do synchronizacji w ServiceCatalog",
                            variant: "destructive"
                          });
                          return;
                        }
                        
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
                        
                        queryClient.invalidateQueries({queryKey: ['/api/services']});
                        
                        toast({
                          title: "Synchronizacja zakończona",
                          description: `Zsynchronizowano ${response.results.added} nowych i ${response.results.updated} zaktualizowanych usług.`
                        });
                        
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
                        const response = await apiRequest(
                          `/api/services`,
                          { method: 'GET' }
                        );
                        
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
                  
                  <button
                    onClick={async () => {
                      try {
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
                        
                        if (!confirm(`Czy chcesz dodać 2 nowe usługi do bazy danych?\n- Projektowanie Logo\n- Copywriting SEO`)) {
                          return;
                        }
                        
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
                        
                        queryClient.invalidateQueries({queryKey: ['/api/services']});
                        
                        toast({
                          title: "Dodano nowe usługi",
                          description: `Pomyślnie dodano ${response.count} nowych usług do bazy danych.`,
                          variant: "default"
                        });
                        
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
                  
                  <button
                    onClick={async () => {
                      try {
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
                        
                        const scUrl = prompt("Podaj URL aplikacji ServiceCatalog (z https://):", "https://servicecatalog.replit.app");
                        
                        if (!scUrl) return;
                        
                        if (!confirm(`Czy na pewno chcesz połączyć bazy danych?\n\nURL ServiceCatalog: ${scUrl}\n\nUwaga: Spowoduje to NADPISANIE bazy danych w ServiceCatalog danymi z ECM Digital!`)) {
                          return;
                        }

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
    </>
  );
}

function App() {
  return (
    <TooltipProvider>
      <Suspense fallback={<LoadingFallback />}>
        <Switch>
          {/* Trasy z parametrami */}
          <Route path="/service/:id" component={ServiceDetailsPage} />
          <Route path="/configure/:id" component={ConfigureServicePage} />
          <Route path="/client/orders/:orderId" component={ClientOrderDetailsPage} />
          <Route path="/blog/:slug" component={BlogPostPage} />
          <Route path="/knowledge/:slug" component={KnowledgeArticlePage} />
          
          {/* Trasy statyczne - ważne aby były po trasach sparametryzowanych */}
          <Route path="/admin" component={AdminPage} />
          <Route path="/services" component={ServicesPage} />
          <Route path="/configure" component={ConfigureServicePage} />
          <Route path="/about" component={AboutPage} />
          
          {/* Case Studies Routes */}
          <Route path="/case-studies/1" component={CaseStudyOne} />
          <Route path="/case-studies/2" component={CaseStudyTwo} />
          
          {/* Client Panel Routes */}
          <Route path="/client/dashboard" component={ClientDashboardPage} />
          <Route path="/client/orders" component={ClientOrdersPage} />
          <Route path="/client/profile" component={ClientProfilePage} />
          
          {/* Blog Routes */}
          <Route path="/blog/search" component={BlogSearchPage} />
          <Route path="/blog" component={BlogPage} />
          
          {/* Knowledge Base Routes */}
          <Route path="/knowledge/search" component={KnowledgeSearchPage} />
          <Route path="/knowledge" component={KnowledgeBasePage} />
          
          {/* Strona główna - musi być na końcu przed 404 */}
          <Route path="/" component={ClientHomePage} />
          
          {/* Strona 404 - musi być ostatnia */}
          <Route component={NotFound} />
        </Switch>
      </Suspense>
      {/* Chatbot Widget - wyświetlany na każdej stronie */}
      <ChatWidget />
      <Toaster />
    </TooltipProvider>
  );
}

export default App;