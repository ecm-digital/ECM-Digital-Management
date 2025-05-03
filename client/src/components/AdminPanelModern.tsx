import React, { useState } from 'react';
import { Service } from '@/types';
import { queryClient, apiRequest } from '@/lib/queryClient';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation } from '@tanstack/react-query';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Edit, Trash2, Plus, Sparkles, Loader2, Info } from 'lucide-react';

// Import FontAwesome components
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faThLarge, 
  faBriefcase,
  faServer,
  faUsers,
  faComments,
  faChartLine,
  faClipboardList,
  faCog,
  faCube,
  faBars,
  faTimes,
  faPlus,
  faEdit,
  faTrash,
  faEye
} from '@fortawesome/free-solid-svg-icons';

export default function AdminPanelModern() {
  const { data: services = [], isLoading, isError } = useQuery<Service[]>({ 
    queryKey: ['/api/services'], 
    staleTime: 5000 
  });
  
  const [activeTab, setActiveTab] = useState('services');
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState<Service | null>(null);
  const [isNewDialogOpen, setIsNewDialogOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  // Dane dla listy klientów
  const { data: clients = [], isLoading: isClientsLoading } = useQuery<any[]>({ 
    queryKey: ['/api/admin/clients'], 
    staleTime: 5000,
    enabled: activeTab === 'clients' // Ładuj dane tylko gdy zakładka klientów jest aktywna
  });
  
  const [newService, setNewService] = useState<Partial<Service>>({
    name: '',
    shortDescription: '',
    description: '',
    longDescription: '',
    basePrice: 0,
    deliveryTime: 1,
    features: [] as string[],
    benefits: [] as string[],
    scope: [] as string[],
    category: 'Inne',
    status: 'Aktywna'
  });
  
  const [newFeature, setNewFeature] = useState('');
  const [newBenefit, setNewBenefit] = useState('');
  const [newScope, setNewScope] = useState('');
  const { toast } = useToast();
  
  // Obsługa edycji usługi
  const handleEditService = (service: Service) => {
    setEditingService({...service});
    setIsEditDialogOpen(true);
  };

  // Obsługa usunięcia usługi
  const handleDeleteService = (service: Service) => {
    setServiceToDelete(service);
    setIsDeleteDialogOpen(true);
  };

  // Obsługa zapisywania zmian w edytowanej usłudze
  const handleSaveEdit = async () => {
    if (!editingService) return;
    
    try {
      await apiRequest(`/api/admin/services/${editingService.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingService)
      });
      
      queryClient.invalidateQueries({queryKey: ['/api/services']});
      setIsEditDialogOpen(false);
      
      toast({
        title: "Zmiany zapisane",
        description: `Usługa "${editingService.name}" została zaktualizowana`,
        variant: "default"
      });
    } catch (error) {
      console.error('Błąd podczas zapisywania zmian:', error);
      toast({
        title: "Błąd",
        description: `Nie udało się zapisać zmian: ${error instanceof Error ? error.message : 'Nieznany błąd'}`,
        variant: "destructive"
      });
    }
  };

  // Obsługa potwierdzenia usunięcia usługi
  const handleConfirmDelete = async () => {
    if (!serviceToDelete) return;
    
    try {
      await apiRequest(`/api/admin/services/${serviceToDelete.id}`, {
        method: 'DELETE'
      });
      
      queryClient.invalidateQueries({queryKey: ['/api/services']});
      setIsDeleteDialogOpen(false);
      
      toast({
        title: "Usługa usunięta",
        description: `Usługa "${serviceToDelete.name}" została usunięta`,
        variant: "default"
      });
    } catch (error) {
      console.error('Błąd podczas usuwania usługi:', error);
      toast({
        title: "Błąd",
        description: `Nie udało się usunąć usługi: ${error instanceof Error ? error.message : 'Nieznany błąd'}`,
        variant: "destructive"
      });
    }
  };

  // Obsługa dodawania nowej usługi
  const handleAddService = async () => {
    try {
      // Tworzymy usługę bezpośrednio przez nowy endpoint
      const serviceToAdd = {
        ...newService
      };
      
      await apiRequest('/api/services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(serviceToAdd)
      });
      
      // Odśwież listę usług po dodaniu nowej
      queryClient.invalidateQueries({queryKey: ['/api/services']});
      
      // Zamknij dialog i wyczyść formularz
      setIsNewDialogOpen(false);
      setNewService({
        name: '',
        shortDescription: '',
        description: '',
        longDescription: '',
        basePrice: 0,
        deliveryTime: 1,
        features: [],
        benefits: [],
        scope: [],
        category: 'Inne',
        status: 'Aktywna'
      });
      
      toast({
        title: "Usługa dodana",
        description: `Usługa "${serviceToAdd.name}" została dodana do bazy danych`,
        variant: "default"
      });
    } catch (error) {
      console.error('Błąd podczas dodawania usługi:', error);
      toast({
        title: "Błąd",
        description: `Nie udało się dodać usługi: ${error instanceof Error ? error.message : 'Nieznany błąd'}`,
        variant: "destructive"
      });
    }
  };

  // Obsługa dodawania funkcji do nowej usługi
  const handleAddFeature = () => {
    if (!newFeature.trim()) return;
    
    setNewService(prev => ({
      ...prev,
      features: [...(prev.features || []), newFeature]
    }));
    
    setNewFeature('');
  };

  // Obsługa usunięcia funkcji z nowej usługi
  const handleRemoveFeature = (index: number) => {
    setNewService(prev => ({
      ...prev,
      features: (prev.features || []).filter((_, i) => i !== index)
    }));
  };
  
  // Obsługa dodawania korzyści do nowej usługi
  const handleAddBenefit = () => {
    if (!newBenefit.trim()) return;
    
    setNewService(prev => ({
      ...prev,
      benefits: [...(prev.benefits || []), newBenefit]
    }));
    
    setNewBenefit('');
  };

  // Obsługa usunięcia korzyści z nowej usługi
  const handleRemoveBenefit = (index: number) => {
    setNewService(prev => ({
      ...prev,
      benefits: (prev.benefits || []).filter((_, i) => i !== index)
    }));
  };
  
  // Obsługa dodawania zakresu do nowej usługi
  const handleAddScope = () => {
    if (!newScope.trim()) return;
    
    setNewService(prev => ({
      ...prev,
      scope: [...(prev.scope || []), newScope]
    }));
    
    setNewScope('');
  };

  // Obsługa usunięcia zakresu z nowej usługi
  const handleRemoveScope = (index: number) => {
    setNewService(prev => ({
      ...prev,
      scope: (prev.scope || []).filter((_, i) => i !== index)
    }));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <Loader2 className="h-10 w-10 animate-spin text-primary mx-auto mb-4" />
          <p className="text-gray-600">Ładowanie danych...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-8 text-center">
        <div className="max-w-md mx-auto">
          <Alert variant="destructive" className="mb-4">
            <AlertTitle>Błąd</AlertTitle>
            <AlertDescription>
              Nie udało się załadować danych. Spróbuj odświeżyć stronę.
            </AlertDescription>
          </Alert>
          <Button onClick={() => window.location.reload()}>Odśwież stronę</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Mobile sidebar toggle */}
      <button 
        className="fixed top-4 left-4 z-50 p-2 rounded-lg bg-white shadow-md md:hidden text-primary"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        <FontAwesomeIcon icon={isSidebarOpen ? faTimes : faBars} className="h-5 w-5" />
      </button>
      
      {/* Sidebar dla menu */}
      <div 
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-white shadow-xl transform ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } transition-transform duration-300 ease-in-out md:translate-x-0`}
      >
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary text-transparent bg-clip-text">ECM Digital</h2>
            <p className="text-gray-500 text-sm mt-1">Panel Administratora</p>
          </div>
          
          <nav className="flex-1 py-6 px-4">
            <div className="mb-2 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Główne
            </div>
            <ul className="space-y-1 mb-8">
              <li>
                <button
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                    activeTab === 'dashboard' 
                      ? 'bg-primary-50 text-primary-700 font-medium' 
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                  onClick={() => setActiveTab('dashboard')}
                >
                  <FontAwesomeIcon icon={faThLarge} className="h-5 w-5" />
                  <span>Dashboard</span>
                </button>
              </li>
              <li>
                <button
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                    activeTab === 'services' 
                      ? 'bg-primary-50 text-primary-700 font-medium' 
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                  onClick={() => setActiveTab('services')}
                >
                  <FontAwesomeIcon icon={faCube} className="h-5 w-5" />
                  <span>Usługi</span>
                </button>
              </li>
              <li>
                <button
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                    activeTab === 'clients' 
                      ? 'bg-primary-50 text-primary-700 font-medium' 
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                  onClick={() => setActiveTab('clients')}
                >
                  <FontAwesomeIcon icon={faUsers} className="h-5 w-5" />
                  <span>Klienci</span>
                </button>
              </li>
            </ul>

            <div className="mb-2 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Narzędzia
            </div>
            <ul className="space-y-1">
              <li>
                <button
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                    activeTab === 'ai' 
                      ? 'bg-primary-50 text-primary-700 font-medium' 
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                  onClick={() => setActiveTab('ai')}
                >
                  <FontAwesomeIcon icon={faServer} className="h-5 w-5" />
                  <span>Asystent AI</span>
                </button>
              </li>
              <li>
                <button
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 text-gray-600 hover:bg-gray-100`}
                >
                  <FontAwesomeIcon icon={faChartLine} className="h-5 w-5" />
                  <span>Statystyki</span>
                </button>
              </li>
              <li>
                <button
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 text-gray-600 hover:bg-gray-100`}
                >
                  <FontAwesomeIcon icon={faCog} className="h-5 w-5" />
                  <span>Ustawienia</span>
                </button>
              </li>
            </ul>
          </nav>
          
          <div className="p-4 border-t border-gray-200">
            <button
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-100 transition-all duration-200"
              onClick={() => console.log('Wylogowano')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span>Wyloguj</span>
            </button>
          </div>
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex-1 ml-0 md:ml-64 transition-all duration-300 ease-in-out">
        <main className="p-8">
          {activeTab === 'dashboard' && (
            <div>
              <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-bold">Dashboard</h1>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <Card className="bg-white border-0 shadow-md hover:shadow-lg transition-all duration-300">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-medium">Aktywne usługi</CardTitle>
                    <CardDescription>Liczba dostępnych usług</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold text-primary">
                      {services.filter(s => s.status === 'Aktywna').length}
                    </p>
                  </CardContent>
                </Card>
                
                <Card className="bg-white border-0 shadow-md hover:shadow-lg transition-all duration-300">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-medium">Klienci</CardTitle>
                    <CardDescription>Łączna liczba klientów</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold text-secondary">
                      {clients.length || 0}
                    </p>
                  </CardContent>
                </Card>
                
                <Card className="bg-white border-0 shadow-md hover:shadow-lg transition-all duration-300">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-medium">Kategorie</CardTitle>
                    <CardDescription>Liczba kategorii usług</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold text-accent">
                      {new Set(services.map(s => s.category)).size}
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
          
          {activeTab === 'services' && (
            <div>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div>
                  <h1 className="text-2xl font-bold">Zarządzanie usługami</h1>
                  <p className="text-gray-500">Przeglądaj, edytuj i dodawaj usługi</p>
                </div>
                
                <Button 
                  onClick={() => setIsNewDialogOpen(true)} 
                  className="bg-gradient-to-r from-primary to-secondary text-white hover:opacity-90 transition-opacity"
                >
                  <FontAwesomeIcon icon={faPlus} className="mr-2 h-4 w-4" />
                  Dodaj nową usługę
                </Button>
              </div>
              
              <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
                <div className="p-6 border-b border-gray-100">
                  <h2 className="text-lg font-semibold">Lista usług</h2>
                </div>
                
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-50">
                        <TableHead className="w-[50px] text-center">#</TableHead>
                        <TableHead>Nazwa</TableHead>
                        <TableHead className="hidden md:table-cell">Kategoria</TableHead>
                        <TableHead className="hidden md:table-cell text-right">Cena (PLN)</TableHead>
                        <TableHead className="hidden lg:table-cell text-center">Status</TableHead>
                        <TableHead className="text-right">Akcje</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {services.map((service, index) => (
                        <TableRow key={service.id} className="hover:bg-gray-50 transition-colors">
                          <TableCell className="text-center font-medium">{index + 1}</TableCell>
                          <TableCell className="font-medium">{service.name}</TableCell>
                          <TableCell className="hidden md:table-cell text-gray-600">{service.category}</TableCell>
                          <TableCell className="hidden md:table-cell text-right">{service.basePrice.toLocaleString()}</TableCell>
                          <TableCell className="hidden lg:table-cell text-center">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              service.status === 'Aktywna' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {service.status}
                            </span>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end space-x-2">
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                onClick={() => handleEditService(service)}
                                className="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                              >
                                <FontAwesomeIcon icon={faEdit} className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                onClick={() => handleDeleteService(service)}
                                className="text-red-600 hover:text-red-800 hover:bg-red-50"
                              >
                                <FontAwesomeIcon icon={faTrash} className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'clients' && (
            <div>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div>
                  <h1 className="text-2xl font-bold">Klienci</h1>
                  <p className="text-gray-500">Zarządzaj klientami i ich zamówieniami</p>
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                  <h2 className="text-lg font-semibold">Lista klientów</h2>
                </div>
                
                {isClientsLoading ? (
                  <div className="p-8 text-center">
                    <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
                    <p className="text-gray-600">Ładowanie listy klientów...</p>
                  </div>
                ) : clients && clients.length > 0 ? (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-gray-50">
                          <TableHead className="w-[50px]">#</TableHead>
                          <TableHead>Nazwa</TableHead>
                          <TableHead className="hidden md:table-cell">Email</TableHead>
                          <TableHead className="hidden lg:table-cell">Telefon</TableHead>
                          <TableHead className="hidden md:table-cell">Ostatnie zamówienie</TableHead>
                          <TableHead className="text-right">Akcje</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {clients.map((client, index) => (
                          <TableRow key={client.id} className="hover:bg-gray-50 transition-colors">
                            <TableCell className="font-medium">{index + 1}</TableCell>
                            <TableCell>{client.name}</TableCell>
                            <TableCell className="hidden md:table-cell">{client.email}</TableCell>
                            <TableCell className="hidden lg:table-cell">{client.phone || '-'}</TableCell>
                            <TableCell className="hidden md:table-cell">{client.lastOrderDate || '-'}</TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end space-x-2">
                                <Button 
                                  variant="ghost" 
                                  size="icon"
                                  className="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                                >
                                  <FontAwesomeIcon icon={faEye} className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="p-8 text-center">
                    <p className="text-gray-500">Brak klientów do wyświetlenia</p>
                  </div>
                )}
              </div>
            </div>
          )}
          
          {activeTab === 'ai' && (
            <div>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div>
                  <h1 className="text-2xl font-bold">Asystent AI</h1>
                  <p className="text-gray-500">Generuj treści dla usług za pomocą sztucznej inteligencji</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card className="bg-white border-0 shadow-md">
                  <CardHeader>
                    <CardTitle>Wygeneruj nową usługę</CardTitle>
                    <CardDescription>Wpisz podstawowe informacje, a AI wygeneruje szczegóły usługi</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="ai-service-name">Nazwa usługi</Label>
                      <Input 
                        id="ai-service-name"
                        placeholder="np. Audyt UX"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="ai-service-category">Kategoria</Label>
                      <Input 
                        id="ai-service-category"
                        placeholder="np. UX/UI"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="ai-service-price">Cena bazowa (PLN)</Label>
                      <Input 
                        id="ai-service-price"
                        type="number"
                        placeholder="np. 1500"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="ai-service-keywords">Słowa kluczowe (oddzielone przecinkami)</Label>
                      <Input 
                        id="ai-service-keywords"
                        placeholder="np. UX, analiza, raport"
                      />
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Switch id="ai-service-detailed" />
                      <Label htmlFor="ai-service-detailed">Szczegółowy opis</Label>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full bg-gradient-to-r from-primary to-secondary text-white hover:opacity-90">
                      <Sparkles className="mr-2 h-4 w-4" />
                      Generuj usługę
                    </Button>
                  </CardFooter>
                </Card>
                
                <Card className="bg-white border-0 shadow-md">
                  <CardHeader>
                    <CardTitle>Ulepsz opis usługi</CardTitle>
                    <CardDescription>Wpisz swój opis, a AI pomoże go ulepszyć</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="ai-enhance-name">Nazwa usługi</Label>
                      <Input 
                        id="ai-enhance-name"
                        placeholder="np. Audyt UX"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="ai-enhance-description">Obecny opis</Label>
                      <Textarea 
                        id="ai-enhance-description"
                        placeholder="Wpisz aktualny opis usługi, który chcesz ulepszyć..."
                        className="min-h-[150px]"
                      />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full bg-gradient-to-r from-primary to-secondary text-white hover:opacity-90">
                      <Sparkles className="mr-2 h-4 w-4" />
                      Ulepsz opis
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </div>
          )}
        </main>
      </div>
      
      {/* Dialog edycji usługi */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edytuj usługę</DialogTitle>
            <DialogDescription>
              Wprowadź zmiany dla wybranej usługi.
            </DialogDescription>
          </DialogHeader>
          
          {editingService && (
            <div className="grid gap-4 py-4">
              {/* Tutaj formularz edycji */}
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Anuluj
            </Button>
            <Button onClick={handleSaveEdit}>
              Zapisz zmiany
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Dialog potwierdzenia usunięcia */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Potwierdź usunięcie</DialogTitle>
            <DialogDescription>
              Czy na pewno chcesz usunąć tę usługę? Ta operacja jest nieodwracalna.
            </DialogDescription>
          </DialogHeader>
          
          {serviceToDelete && (
            <div className="py-4">
              <p className="font-medium">{serviceToDelete.name}</p>
              <p className="text-sm text-muted-foreground">
                {serviceToDelete.description && serviceToDelete.description.length > 100
                  ? `${serviceToDelete.description.substring(0, 100)}...`
                  : serviceToDelete.description}
              </p>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Anuluj
            </Button>
            <Button variant="destructive" onClick={handleConfirmDelete}>
              Usuń
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Dialog dodawania nowej usługi */}
      <Dialog open={isNewDialogOpen} onOpenChange={setIsNewDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Dodaj nową usługę</DialogTitle>
            <DialogDescription>
              Wprowadź dane dla nowej usługi.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            {/* Tutaj formularz dodawania */}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsNewDialogOpen(false)}>
              Anuluj
            </Button>
            <Button onClick={handleAddService}>
              Dodaj usługę
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}