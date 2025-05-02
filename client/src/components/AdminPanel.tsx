import React, { useState, useEffect } from 'react';
import { Service } from '@/types';
import { queryClient, apiRequest } from '@/lib/queryClient';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Edit, Trash2, Plus, Sparkles, Loader2 } from 'lucide-react';

export default function AdminPanel() {
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
  
  // Stan dla generacji AI
  const [aiServiceName, setAiServiceName] = useState('');
  const [aiServiceCategory, setAiServiceCategory] = useState('');
  const [aiServicePrice, setAiServicePrice] = useState<number | ''>('');
  const [aiServiceKeywords, setAiServiceKeywords] = useState('');
  const [aiServiceDetailed, setAiServiceDetailed] = useState(false);
  const [isGeneratingService, setIsGeneratingService] = useState(false);
  const [generatedService, setGeneratedService] = useState<Partial<Service> | null>(null);
  
  // Stan dla generowania korzyści
  const [aiBenefitsName, setAiBenefitsName] = useState('');
  const [aiBenefitsDescription, setAiBenefitsDescription] = useState('');
  const [isGeneratingBenefits, setIsGeneratingBenefits] = useState(false);
  const [generatedBenefits, setGeneratedBenefits] = useState<string[]>([]);
  
  // Stan dla generowania zakresu
  const [aiScopeName, setAiScopeName] = useState('');
  const [aiScopeDescription, setAiScopeDescription] = useState('');
  const [isGeneratingScope, setIsGeneratingScope] = useState(false);
  const [generatedScope, setGeneratedScope] = useState<string[]>([]);
  
  // Stan dla ulepszania opisu
  const [aiEnhanceName, setAiEnhanceName] = useState('');
  const [aiEnhanceDescription, setAiEnhanceDescription] = useState('');
  const [isEnhancingDescription, setIsEnhancingDescription] = useState(false);
  const [enhancedDescription, setEnhancedDescription] = useState('');

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
      // Dodajemy klucz API do żądania usunięcia usługi
      await apiRequest(`/api/admin/services/${serviceToDelete.id}?key=ecm-database-sharing-key&app=ECMDigital`, {
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
      // Generowanie unikatowego ID dla nowej usługi
      const newId = (services?.length ? Math.max(...services.map((s: Service) => parseInt(s.id))) + 1 : 1).toString();
      
      const serviceToAdd = {
        ...newService,
        id: newId
      };
      
      await apiRequest('/api/admin/import-services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          services: [serviceToAdd]
        })
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
      setNewFeature('');
      setNewBenefit('');
      setNewScope('');
      
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

  // Obsługa dodawania funkcji do edytowanej usługi
  const handleAddFeatureToEditing = () => {
    if (!newFeature.trim() || !editingService) return;
    
    setEditingService(prev => {
      if (!prev) return prev;
      
      return {
        ...prev,
        features: [...(prev.features || []), newFeature]
      };
    });
    
    setNewFeature('');
  };

  // Obsługa usunięcia funkcji z edytowanej usługi
  const handleRemoveFeatureFromEditing = (index: number) => {
    if (!editingService) return;
    
    setEditingService(prev => {
      if (!prev) return prev;
      
      return {
        ...prev,
        features: (prev.features || []).filter((_, i) => i !== index)
      };
    });
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

  // Obsługa dodawania korzyści do edytowanej usługi
  const handleAddBenefitToEditing = () => {
    if (!newBenefit.trim() || !editingService) return;
    
    setEditingService(prev => {
      if (!prev) return prev;
      
      return {
        ...prev,
        benefits: [...(prev.benefits || []), newBenefit]
      };
    });
    
    setNewBenefit('');
  };

  // Obsługa usunięcia korzyści z edytowanej usługi
  const handleRemoveBenefitFromEditing = (index: number) => {
    if (!editingService) return;
    
    setEditingService(prev => {
      if (!prev) return prev;
      
      return {
        ...prev,
        benefits: (prev.benefits || []).filter((_, i) => i !== index)
      };
    });
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

  // Obsługa dodawania zakresu do edytowanej usługi
  const handleAddScopeToEditing = () => {
    if (!newScope.trim() || !editingService) return;
    
    setEditingService(prev => {
      if (!prev) return prev;
      
      return {
        ...prev,
        scope: [...(prev.scope || []), newScope]
      };
    });
    
    setNewScope('');
  };

  // Obsługa usunięcia zakresu z edytowanej usługi
  const handleRemoveScopeFromEditing = (index: number) => {
    if (!editingService) return;
    
    setEditingService(prev => {
      if (!prev) return prev;
      
      return {
        ...prev,
        scope: (prev.scope || []).filter((_, i) => i !== index)
      };
    });
  };
  
  // Funkcje dla generowania AI
  
  // Generowanie całej usługi
  const handleGenerateService = async () => {
    setIsGeneratingService(true);
    setGeneratedService(null);
    
    try {
      const keywords = aiServiceKeywords.split(',').map(k => k.trim()).filter(k => k);
      
      const response = await apiRequest('/api/ai/generate-service', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: aiServiceName,
          category: aiServiceCategory,
          basePrice: aiServicePrice !== '' ? Number(aiServicePrice) : undefined,
          keywords,
          isDetailed: aiServiceDetailed
        })
      });
      
      setGeneratedService(response);
      
      toast({
        title: "Usługa wygenerowana",
        description: "Usługa została wygenerowana pomyślnie",
        variant: "default"
      });
    } catch (error) {
      console.error('Błąd podczas generowania usługi:', error);
      toast({
        title: "Błąd",
        description: `Nie udało się wygenerować usługi: ${error instanceof Error ? error.message : 'Nieznany błąd'}`,
        variant: "destructive"
      });
    } finally {
      setIsGeneratingService(false);
    }
  };
  
  // Dodawanie wygenerowanej usługi do bazy danych
  const handleAddGeneratedService = async () => {
    if (!generatedService) return;
    
    try {
      // Generowanie unikatowego ID dla nowej usługi
      const newId = (services?.length ? Math.max(...services.map((s: Service) => parseInt(s.id))) + 1 : 1).toString();
      
      const serviceToAdd = {
        ...generatedService,
        id: newId
      };
      
      await apiRequest('/api/admin/import-services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          services: [serviceToAdd]
        })
      });
      
      // Odśwież listę usług po dodaniu nowej
      queryClient.invalidateQueries({queryKey: ['/api/services']});
      
      setGeneratedService(null);
      
      toast({
        title: "Usługa dodana",
        description: `Usługa "${serviceToAdd.name}" została dodana do bazy danych`,
        variant: "default"
      });
    } catch (error) {
      console.error('Błąd podczas dodawania wygenerowanej usługi:', error);
      toast({
        title: "Błąd",
        description: `Nie udało się dodać usługi: ${error instanceof Error ? error.message : 'Nieznany błąd'}`,
        variant: "destructive"
      });
    }
  };
  
  // Generowanie korzyści
  const handleGenerateBenefits = async () => {
    if (!aiBenefitsName || !aiBenefitsDescription) {
      toast({
        title: "Błąd",
        description: "Podaj nazwę usługi i opis",
        variant: "destructive"
      });
      return;
    }
    
    setIsGeneratingBenefits(true);
    
    try {
      const response = await apiRequest('/api/ai/generate-benefits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: aiBenefitsName,
          description: aiBenefitsDescription
        })
      });
      
      setGeneratedBenefits(response);
      
      toast({
        title: "Korzyści wygenerowane",
        description: "Lista korzyści została wygenerowana pomyślnie",
        variant: "default"
      });
    } catch (error) {
      console.error('Błąd podczas generowania korzyści:', error);
      toast({
        title: "Błąd",
        description: `Nie udało się wygenerować korzyści: ${error instanceof Error ? error.message : 'Nieznany błąd'}`,
        variant: "destructive"
      });
    } finally {
      setIsGeneratingBenefits(false);
    }
  };
  
  // Generowanie zakresu usługi
  const handleGenerateScope = async () => {
    if (!aiScopeName || !aiScopeDescription) {
      toast({
        title: "Błąd",
        description: "Podaj nazwę usługi i opis",
        variant: "destructive"
      });
      return;
    }
    
    setIsGeneratingScope(true);
    
    try {
      const response = await apiRequest('/api/ai/generate-scope', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: aiScopeName,
          description: aiScopeDescription
        })
      });
      
      setGeneratedScope(response);
      
      toast({
        title: "Zakres wygenerowany",
        description: "Zakres usługi został wygenerowany pomyślnie",
        variant: "default"
      });
    } catch (error) {
      console.error('Błąd podczas generowania zakresu:', error);
      toast({
        title: "Błąd",
        description: `Nie udało się wygenerować zakresu: ${error instanceof Error ? error.message : 'Nieznany błąd'}`,
        variant: "destructive"
      });
    } finally {
      setIsGeneratingScope(false);
    }
  };
  
  // Ulepszanie opisu
  const handleEnhanceDescription = async () => {
    if (!aiEnhanceName || !aiEnhanceDescription) {
      toast({
        title: "Błąd",
        description: "Podaj nazwę usługi i obecny opis",
        variant: "destructive"
      });
      return;
    }
    
    setIsEnhancingDescription(true);
    
    try {
      const response = await apiRequest('/api/ai/enhance-description', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: aiEnhanceName,
          description: aiEnhanceDescription
        })
      });
      
      setEnhancedDescription(response);
      
      toast({
        title: "Opis ulepszony",
        description: "Opis usługi został ulepszony pomyślnie",
        variant: "default"
      });
    } catch (error) {
      console.error('Błąd podczas ulepszania opisu:', error);
      toast({
        title: "Błąd",
        description: `Nie udało się ulepszyć opisu: ${error instanceof Error ? error.message : 'Nieznany błąd'}`,
        variant: "destructive"
      });
    } finally {
      setIsEnhancingDescription(false);
    }
  };

  if (isLoading) {
    return <div className="p-8 text-center">Ładowanie panelu administracyjnego...</div>;
  }

  if (isError) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-red-500 font-bold mb-2">Błąd</h2>
        <p>Nie udało się załadować danych. Spróbuj odświeżyć stronę.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-blue-500 text-transparent bg-clip-text">
        Panel Administracyjny ECM Digital
      </h1>
      
      <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="services">Usługi</TabsTrigger>
          <TabsTrigger value="preview">Podgląd usług</TabsTrigger>
          <TabsTrigger value="ai">Generowanie AI</TabsTrigger>
          <TabsTrigger value="orders">Zamówienia</TabsTrigger>
          <TabsTrigger value="stats">Statystyki</TabsTrigger>
        </TabsList>
        
        <TabsContent value="services" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>Zarządzanie Usługami</span>
                <Button onClick={() => setIsNewDialogOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" /> Dodaj Usługę
                </Button>
              </CardTitle>
              <CardDescription>
                Przeglądaj, dodawaj, edytuj i usuwaj usługi oferowane przez ECM Digital.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableCaption>Lista dostępnych usług</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]">ID</TableHead>
                    <TableHead>Nazwa</TableHead>
                    <TableHead>Kategoria</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Cena</TableHead>
                    <TableHead className="text-right">Czas realizacji</TableHead>
                    <TableHead className="text-right">Akcje</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {services?.map((service: Service) => (
                    <TableRow key={service.id}>
                      <TableCell className="font-medium">{service.id}</TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{service.name}</div>
                          <div className="text-sm text-muted-foreground truncate">{service.description}</div>
                        </div>
                      </TableCell>
                      <TableCell>{service.category || 'Inne'}</TableCell>
                      <TableCell>
                        <div className={`px-2 py-1 rounded-full text-xs inline-block ${
                          service.status === 'Aktywna' ? 'bg-green-100 text-green-800' :
                          service.status === 'Nieaktywna' ? 'bg-gray-100 text-gray-800' :
                          service.status === 'Archiw' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {service.status || 'Aktywna'}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">{service.basePrice} PLN</TableCell>
                      <TableCell className="text-right">{service.deliveryTime} dni</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" size="icon" onClick={() => handleEditService(service)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="destructive" size="icon" onClick={() => handleDeleteService(service)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="ai" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Generowanie Usług z AI</CardTitle>
              <CardDescription>
                Wykorzystaj sztuczną inteligencję do automatycznego generowania opisów usług, korzyści i zakresu.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                <div className="border p-4 rounded-lg">
                  <h3 className="text-lg font-medium mb-4">Generowanie kompletnej usługi</h3>
                  <div className="grid gap-4">
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="ai-service-name">Nazwa usługi</Label>
                        <Input 
                          id="ai-service-name" 
                          placeholder="np. Kampania SEO" 
                          className="mt-1"
                          value={aiServiceName}
                          onChange={(e) => setAiServiceName(e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="ai-service-category">Kategoria</Label>
                        <Input 
                          id="ai-service-category" 
                          placeholder="np. Marketing" 
                          className="mt-1"
                          value={aiServiceCategory}
                          onChange={(e) => setAiServiceCategory(e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="ai-service-price">Cena bazowa (PLN)</Label>
                        <Input 
                          id="ai-service-price" 
                          type="number" 
                          placeholder="np. 5000" 
                          className="mt-1"
                          value={aiServicePrice}
                          onChange={(e) => setAiServicePrice(e.target.value === '' ? '' : Number(e.target.value))}
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="ai-service-keywords">Słowa kluczowe (oddzielone przecinkami)</Label>
                      <Input 
                        id="ai-service-keywords" 
                        placeholder="np. SEO, pozycjonowanie, słowa kluczowe" 
                        className="mt-1"
                        value={aiServiceKeywords}
                        onChange={(e) => setAiServiceKeywords(e.target.value)}
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="ai-service-detailed" 
                        checked={aiServiceDetailed}
                        onCheckedChange={(checked) => setAiServiceDetailed(checked === true)}
                      />
                      <Label htmlFor="ai-service-detailed">Generuj szczegółowy opis</Label>
                    </div>
                    <Button 
                      className="w-full" 
                      onClick={handleGenerateService} 
                      disabled={isGeneratingService}
                    >
                      {isGeneratingService ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-3 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg> Generowanie...
                        </>
                      ) : (
                        <>
                          <svg className="mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="m12 3-1.9 5.8a2 2 0 0 1-1.5 1.5L2.8 12l5.8 1.9a2 2 0 0 1 1.5 1.5L12 21l1.9-5.8a2 2 0 0 1 1.5-1.5L21.2 12l-5.8-1.9a2 2 0 0 1-1.5-1.5Z" />
                          </svg> Generuj usługę
                        </>
                      )}
                    </Button>
                    
                    {generatedService && (
                      <div className="mt-4 border rounded-lg p-4 bg-gray-50">
                        <h4 className="font-medium mb-3">Wygenerowana usługa:</h4>
                        <div className="mb-3">
                          <div className="font-medium">{generatedService.name}</div>
                          <div className="text-sm text-muted-foreground">{generatedService.category} | {generatedService.basePrice} PLN | {generatedService.deliveryTime} dni</div>
                        </div>
                        
                        <div className="mb-3">
                          <div className="text-sm font-medium">Krótki opis:</div>
                          <div className="text-sm">{generatedService.shortDescription}</div>
                        </div>
                        
                        <div className="mb-3">
                          <div className="text-sm font-medium">Opis:</div>
                          <div className="text-sm">{generatedService.description}</div>
                        </div>
                        
                        {generatedService.features && generatedService.features.length > 0 && (
                          <div className="mb-3">
                            <div className="text-sm font-medium">Funkcje:</div>
                            <ul className="text-sm list-disc list-inside">
                              {generatedService.features.map((feature, idx) => (
                                <li key={idx} className="ml-2">{feature}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        
                        {generatedService.benefits && generatedService.benefits.length > 0 && (
                          <div className="mb-3">
                            <div className="text-sm font-medium">Korzyści:</div>
                            <ul className="text-sm list-disc list-inside">
                              {generatedService.benefits.map((benefit, idx) => (
                                <li key={idx} className="ml-2">{benefit}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        
                        {generatedService.scope && generatedService.scope.length > 0 && (
                          <div className="mb-3">
                            <div className="text-sm font-medium">Zakres:</div>
                            <ul className="text-sm list-disc list-inside">
                              {generatedService.scope.map((scope, idx) => (
                                <li key={idx} className="ml-2">{scope}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        
                        <Button 
                          className="w-full mt-2" 
                          onClick={handleAddGeneratedService}
                        >
                          <Plus className="mr-2 h-4 w-4" /> Dodaj do bazy danych
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-6">
                  <div className="border p-4 rounded-lg">
                    <h3 className="text-lg font-medium mb-4">Generowanie korzyści</h3>
                    <div className="grid gap-4">
                      <div>
                        <Label htmlFor="ai-benefits-name">Nazwa usługi</Label>
                        <Input 
                          id="ai-benefits-name" 
                          placeholder="np. Kampania SEO" 
                          className="mt-1"
                          value={aiBenefitsName}
                          onChange={(e) => setAiBenefitsName(e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="ai-benefits-description">Opis usługi</Label>
                        <Textarea 
                          id="ai-benefits-description" 
                          placeholder="Wprowadź opis usługi..." 
                          className="mt-1"
                          rows={4}
                          value={aiBenefitsDescription}
                          onChange={(e) => setAiBenefitsDescription(e.target.value)}
                        />
                      </div>
                      <Button 
                        className="w-full"
                        onClick={handleGenerateBenefits}
                        disabled={isGeneratingBenefits}
                      >
                        {isGeneratingBenefits ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-3 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg> Generowanie...
                          </>
                        ) : (
                          <>
                            <svg className="mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="m12 3-1.9 5.8a2 2 0 0 1-1.5 1.5L2.8 12l5.8 1.9a2 2 0 0 1 1.5 1.5L12 21l1.9-5.8a2 2 0 0 1 1.5-1.5L21.2 12l-5.8-1.9a2 2 0 0 1-1.5-1.5Z" />
                            </svg> Generuj korzyści
                          </>
                        )}
                      </Button>
                      
                      {generatedBenefits.length > 0 && (
                        <div className="mt-2 p-3 bg-gray-50 rounded-md">
                          <h4 className="font-medium mb-2 text-sm">Wygenerowane korzyści:</h4>
                          <ul className="space-y-1 text-sm">
                            {generatedBenefits.map((benefit, idx) => (
                              <li key={idx} className="flex items-start">
                                <svg className="h-4 w-4 text-green-500 mr-2 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                <span>{benefit}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="border p-4 rounded-lg">
                    <h3 className="text-lg font-medium mb-4">Generowanie zakresu usługi</h3>
                    <div className="grid gap-4">
                      <div>
                        <Label htmlFor="ai-scope-name">Nazwa usługi</Label>
                        <Input 
                          id="ai-scope-name" 
                          placeholder="np. Kampania SEO" 
                          className="mt-1"
                          value={aiScopeName}
                          onChange={(e) => setAiScopeName(e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="ai-scope-description">Opis usługi</Label>
                        <Textarea 
                          id="ai-scope-description" 
                          placeholder="Wprowadź opis usługi..." 
                          className="mt-1"
                          rows={4}
                          value={aiScopeDescription}
                          onChange={(e) => setAiScopeDescription(e.target.value)}
                        />
                      </div>
                      <Button 
                        className="w-full"
                        onClick={handleGenerateScope}
                        disabled={isGeneratingScope}
                      >
                        {isGeneratingScope ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-3 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg> Generowanie...
                          </>
                        ) : (
                          <>
                            <svg className="mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="m12 3-1.9 5.8a2 2 0 0 1-1.5 1.5L2.8 12l5.8 1.9a2 2 0 0 1 1.5 1.5L12 21l1.9-5.8a2 2 0 0 1 1.5-1.5L21.2 12l-5.8-1.9a2 2 0 0 1-1.5-1.5Z" />
                            </svg> Generuj zakres
                          </>
                        )}
                      </Button>
                      
                      {generatedScope.length > 0 && (
                        <div className="mt-2 p-3 bg-gray-50 rounded-md">
                          <h4 className="font-medium mb-2 text-sm">Wygenerowany zakres:</h4>
                          <ul className="space-y-1 text-sm">
                            {generatedScope.map((scopeItem, idx) => (
                              <li key={idx} className="flex items-start">
                                <svg className="h-4 w-4 text-purple-500 mr-2 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                                <span>{scopeItem}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="border p-4 rounded-lg">
                  <h3 className="text-lg font-medium mb-4">Ulepszanie opisu</h3>
                  <div className="grid gap-4">
                    <div>
                      <Label htmlFor="ai-enhance-name">Nazwa usługi</Label>
                      <Input 
                        id="ai-enhance-name" 
                        placeholder="np. Kampania SEO" 
                        className="mt-1"
                        value={aiEnhanceName}
                        onChange={(e) => setAiEnhanceName(e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="ai-enhance-description">Obecny opis</Label>
                      <Textarea 
                        id="ai-enhance-description" 
                        placeholder="Wprowadź opis do ulepszenia..." 
                        className="mt-1"
                        rows={4}
                        value={aiEnhanceDescription}
                        onChange={(e) => setAiEnhanceDescription(e.target.value)}
                      />
                    </div>
                    <Button 
                      className="w-full"
                      onClick={handleEnhanceDescription}
                      disabled={isEnhancingDescription}
                    >
                      {isEnhancingDescription ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-3 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg> Przetwarzanie...
                        </>
                      ) : (
                        <>
                          <svg className="mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M5.52 19c.64-2.2 1.84-3 3.22-3h6.52c1.38 0 2.58.8 3.22 3"/>
                            <circle cx="12" cy="10" r="3"/>
                            <circle cx="12" cy="12" r="10"/>
                          </svg> Ulepsz opis
                        </>
                      )}
                    </Button>
                    
                    {enhancedDescription && (
                      <div className="mt-2 p-3 bg-gray-50 rounded-md">
                        <h4 className="font-medium mb-2 text-sm">Ulepszony opis:</h4>
                        <p className="text-sm">{enhancedDescription}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="preview" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Podgląd usług dla klienta</CardTitle>
              <CardDescription>
                Sprawdź, jak usługi wyglądają na stronie widocznej dla klienta.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {services?.filter(s => s.status === 'Aktywna').map((service: Service) => (
                  <div key={service.id} className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                    <div className="bg-gradient-to-r from-blue-500 to-indigo-600 h-3"></div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold mb-2">{service.name}</h3>
                      {service.shortDescription && (
                        <p className="text-muted-foreground mb-3">{service.shortDescription}</p>
                      )}
                      <p className="mb-4">{service.description}</p>
                      
                      <div className="mb-4">
                        <span className="font-bold text-lg text-blue-600">{service.basePrice} PLN</span>
                        <span className="text-muted-foreground text-sm ml-2">/ {service.deliveryTime} dni</span>
                      </div>
                      
                      {service.benefits && service.benefits.length > 0 && (
                        <div className="mt-4">
                          <h4 className="font-semibold mb-2">Korzyści:</h4>
                          <ul className="space-y-1">
                            {service.benefits.map((benefit, index) => (
                              <li key={index} className="flex items-start">
                                <svg className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                <span>{benefit}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      {service.features && service.features.length > 0 && (
                        <div className="mt-4">
                          <h4 className="font-semibold mb-2">Funkcje:</h4>
                          <ul className="space-y-1">
                            {service.features.map((feature, index) => (
                              <li key={index} className="flex items-start">
                                <svg className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span>{feature}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      {service.scope && service.scope.length > 0 && (
                        <div className="mt-4">
                          <h4 className="font-semibold mb-2">Zakres usługi:</h4>
                          <ul className="space-y-1">
                            {service.scope.map((scopeItem, index) => (
                              <li key={index} className="flex items-start">
                                <svg className="h-5 w-5 text-purple-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                                <span>{scopeItem}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      <div className="mt-6">
                        <button className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-2 px-4 rounded-md hover:from-blue-600 hover:to-indigo-700 transition-colors">
                          Wybierz usługę
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {services?.filter(s => s.status === 'Aktywna').length === 0 && (
                <p className="text-center text-muted-foreground py-10">
                  Brak aktywnych usług do wyświetlenia.
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="orders" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Zarządzanie Zamówieniami</CardTitle>
              <CardDescription>
                Przeglądaj i zarządzaj zamówieniami złożonymi przez klientów.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center text-muted-foreground py-10">
                Funkcja zarządzania zamówieniami jest w trakcie budowy.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="stats" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Statystyki</CardTitle>
              <CardDescription>
                Analiza popularności usług i statystyki sprzedaży.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center text-muted-foreground py-10">
                Funkcja statystyk jest w trakcie budowy.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Dialog edycji usługi */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edytuj usługę</DialogTitle>
            <DialogDescription>
              Wprowadź zmiany w szczegółach usługi. Kliknij "Zapisz" po zakończeniu edycji.
            </DialogDescription>
          </DialogHeader>
          
          {editingService && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">Nazwa</Label>
                <Input
                  id="name"
                  value={editingService.name}
                  onChange={(e) => setEditingService({...editingService, name: e.target.value})}
                  className="col-span-3"
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="shortDescription" className="text-right">Krótki opis</Label>
                <Input
                  id="shortDescription"
                  value={editingService.shortDescription || ''}
                  onChange={(e) => setEditingService({...editingService, shortDescription: e.target.value})}
                  className="col-span-3"
                  placeholder="Krótkie podsumowanie usługi (1-2 zdania)"
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">Opis podstawowy</Label>
                <Textarea
                  id="description"
                  value={editingService.description}
                  onChange={(e) => setEditingService({...editingService, description: e.target.value})}
                  className="col-span-3"
                  placeholder="Standardowy opis usługi"
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="longDescription" className="text-right">Długi opis</Label>
                <Textarea
                  id="longDescription"
                  value={editingService.longDescription || ''}
                  onChange={(e) => setEditingService({...editingService, longDescription: e.target.value})}
                  className="col-span-3"
                  placeholder="Szczegółowy opis usługi z dodatkowymi informacjami"
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="basePrice" className="text-right">Cena podstawowa</Label>
                <Input
                  id="basePrice"
                  type="number"
                  value={editingService.basePrice}
                  onChange={(e) => setEditingService({...editingService, basePrice: parseFloat(e.target.value)})}
                  className="col-span-3"
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="deliveryTime" className="text-right">Czas realizacji (dni)</Label>
                <Input
                  id="deliveryTime"
                  type="number"
                  value={editingService.deliveryTime}
                  onChange={(e) => setEditingService({...editingService, deliveryTime: parseInt(e.target.value)})}
                  className="col-span-3"
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="category" className="text-right">Kategoria</Label>
                <Select 
                  value={editingService.category || 'Inne'} 
                  onValueChange={(value) => setEditingService({...editingService, category: value})}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Wybierz kategorię" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="UX/UI">UX/UI</SelectItem>
                    <SelectItem value="Marketing">Marketing</SelectItem>
                    <SelectItem value="Web Development">Web Development</SelectItem>
                    <SelectItem value="Automatyzacja">Automatyzacja</SelectItem>
                    <SelectItem value="AI">AI</SelectItem>
                    <SelectItem value="Inne">Inne</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="status" className="text-right">Status</Label>
                <Select 
                  value={editingService.status || 'Aktywna'} 
                  onValueChange={(value) => setEditingService({...editingService, status: value})}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Wybierz status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Aktywna">Aktywna</SelectItem>
                    <SelectItem value="Nieaktywna">Nieaktywna</SelectItem>
                    <SelectItem value="Archiw">Archiwalna</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Funkcje</Label>
                <div className="col-span-3">
                  <div className="flex flex-col space-y-2 mb-4">
                    {editingService.features?.map((feature, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <span className="flex-1">{feature}</span>
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => handleRemoveFeatureFromEditing(index)}
                        >
                          Usuń
                        </Button>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex gap-2">
                    <Input
                      placeholder="Nowa funkcja"
                      value={newFeature}
                      onChange={(e) => setNewFeature(e.target.value)}
                      className="flex-1"
                    />
                    <Button onClick={handleAddFeatureToEditing}>Dodaj</Button>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Korzyści</Label>
                <div className="col-span-3">
                  <div className="flex flex-col space-y-2 mb-4">
                    {editingService.benefits?.map((benefit, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <span className="flex-1">{benefit}</span>
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => handleRemoveBenefitFromEditing(index)}
                        >
                          Usuń
                        </Button>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex gap-2">
                    <Input
                      placeholder="Nowa korzyść"
                      value={newBenefit}
                      onChange={(e) => setNewBenefit(e.target.value)}
                      className="flex-1"
                    />
                    <Button onClick={handleAddBenefitToEditing}>Dodaj</Button>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Zakres usługi</Label>
                <div className="col-span-3">
                  <div className="flex flex-col space-y-2 mb-4">
                    {editingService.scope?.map((scopeItem, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <span className="flex-1">{scopeItem}</span>
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => handleRemoveScopeFromEditing(index)}
                        >
                          Usuń
                        </Button>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex gap-2">
                    <Input
                      placeholder="Nowy element zakresu"
                      value={newScope}
                      onChange={(e) => setNewScope(e.target.value)}
                      className="flex-1"
                    />
                    <Button onClick={handleAddScopeToEditing}>Dodaj</Button>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Anuluj</Button>
            <Button onClick={handleSaveEdit}>Zapisz zmiany</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Dialog usuwania usługi */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Potwierdź usunięcie</DialogTitle>
            <DialogDescription>
              Czy na pewno chcesz usunąć usługę "{serviceToDelete?.name}"?
              Tej operacji nie można cofnąć.
            </DialogDescription>
          </DialogHeader>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Anuluj</Button>
            <Button variant="destructive" onClick={handleConfirmDelete}>Usuń</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Dialog dodawania nowej usługi */}
      <Dialog open={isNewDialogOpen} onOpenChange={setIsNewDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Dodaj nową usługę</DialogTitle>
            <DialogDescription>
              Wypełnij formularz, aby dodać nową usługę do oferty ECM Digital.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="new-name" className="text-right">Nazwa *</Label>
              <Input
                id="new-name"
                value={newService.name}
                onChange={(e) => setNewService({...newService, name: e.target.value})}
                className="col-span-3"
                placeholder="Nazwa usługi"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="new-shortDescription" className="text-right">Krótki opis</Label>
              <Input
                id="new-shortDescription"
                value={newService.shortDescription}
                onChange={(e) => setNewService({...newService, shortDescription: e.target.value})}
                className="col-span-3"
                placeholder="Krótkie podsumowanie usługi (1-2 zdania)"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="new-description" className="text-right">Opis podstawowy *</Label>
              <Textarea
                id="new-description"
                value={newService.description}
                onChange={(e) => setNewService({...newService, description: e.target.value})}
                className="col-span-3"
                placeholder="Standardowy opis usługi"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="new-longDescription" className="text-right">Długi opis</Label>
              <Textarea
                id="new-longDescription"
                value={newService.longDescription}
                onChange={(e) => setNewService({...newService, longDescription: e.target.value})}
                className="col-span-3"
                placeholder="Szczegółowy opis usługi z dodatkowymi informacjami"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="new-basePrice" className="text-right">Cena podstawowa</Label>
              <Input
                id="new-basePrice"
                type="number"
                value={newService.basePrice}
                onChange={(e) => setNewService({...newService, basePrice: parseFloat(e.target.value)})}
                className="col-span-3"
                placeholder="0"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="new-deliveryTime" className="text-right">Czas realizacji (dni)</Label>
              <Input
                id="new-deliveryTime"
                type="number"
                value={newService.deliveryTime}
                onChange={(e) => setNewService({...newService, deliveryTime: parseInt(e.target.value)})}
                className="col-span-3"
                placeholder="1"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="new-category" className="text-right">Kategoria</Label>
              <Select 
                value={newService.category || 'Inne'} 
                onValueChange={(value) => setNewService({...newService, category: value})}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Wybierz kategorię" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="UX/UI">UX/UI</SelectItem>
                  <SelectItem value="Marketing">Marketing</SelectItem>
                  <SelectItem value="Web Development">Web Development</SelectItem>
                  <SelectItem value="Automatyzacja">Automatyzacja</SelectItem>
                  <SelectItem value="AI">AI</SelectItem>
                  <SelectItem value="Inne">Inne</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="new-status" className="text-right">Status</Label>
              <Select 
                value={newService.status || 'Aktywna'} 
                onValueChange={(value) => setNewService({...newService, status: value})}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Wybierz status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Aktywna">Aktywna</SelectItem>
                  <SelectItem value="Nieaktywna">Nieaktywna</SelectItem>
                  <SelectItem value="Archiw">Archiwalna</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Funkcje</Label>
              <div className="col-span-3">
                <div className="flex flex-col space-y-2 mb-4">
                  {newService.features?.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <span className="flex-1">{feature}</span>
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => handleRemoveFeature(index)}
                      >
                        Usuń
                      </Button>
                    </div>
                  ))}
                </div>
                
                <div className="flex gap-2">
                  <Input
                    placeholder="Nowa funkcja"
                    value={newFeature}
                    onChange={(e) => setNewFeature(e.target.value)}
                    className="flex-1"
                  />
                  <Button onClick={handleAddFeature}>Dodaj</Button>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Korzyści</Label>
              <div className="col-span-3">
                <div className="flex flex-col space-y-2 mb-4">
                  {newService.benefits?.map((benefit, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <span className="flex-1">{benefit}</span>
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => handleRemoveBenefit(index)}
                      >
                        Usuń
                      </Button>
                    </div>
                  ))}
                </div>
                
                <div className="flex gap-2">
                  <Input
                    placeholder="Nowa korzyść"
                    value={newBenefit}
                    onChange={(e) => setNewBenefit(e.target.value)}
                    className="flex-1"
                  />
                  <Button onClick={handleAddBenefit}>Dodaj</Button>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Zakres usługi</Label>
              <div className="col-span-3">
                <div className="flex flex-col space-y-2 mb-4">
                  {newService.scope?.map((scopeItem, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <span className="flex-1">{scopeItem}</span>
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => handleRemoveScope(index)}
                      >
                        Usuń
                      </Button>
                    </div>
                  ))}
                </div>
                
                <div className="flex gap-2">
                  <Input
                    placeholder="Nowy element zakresu"
                    value={newScope}
                    onChange={(e) => setNewScope(e.target.value)}
                    className="flex-1"
                  />
                  <Button onClick={handleAddScope}>Dodaj</Button>
                </div>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsNewDialogOpen(false)}>Anuluj</Button>
            <Button onClick={handleAddService}>Dodaj usługę</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}