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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Edit, Trash2, Plus, Sparkles, Loader2, Info } from 'lucide-react';

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
  
  // Stan dla AI Pricing Assistant
  const [selectedServiceForPricing, setSelectedServiceForPricing] = useState<Service | null>(null);
  const [isGeneratingPricingRecommendation, setIsGeneratingPricingRecommendation] = useState(false);
  const [pricingRecommendation, setPricingRecommendation] = useState<any>(null);
  
  // Stan dla AI Service Estimator
  const [selectedServiceForEstimation, setSelectedServiceForEstimation] = useState<Service | null>(null);
  const [clientRequirements, setClientRequirements] = useState<string[]>([]);
  const [newRequirement, setNewRequirement] = useState('');
  const [targetBudget, setTargetBudget] = useState<number | undefined>(undefined);
  const [targetDeadline, setTargetDeadline] = useState<number | undefined>(undefined);
  const [complexity, setComplexity] = useState<'low' | 'medium' | 'high'>('medium');
  const [isGeneratingEstimation, setIsGeneratingEstimation] = useState(false);
  const [serviceEstimation, setServiceEstimation] = useState<any>(null);

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
      // Używamy bezpośredniego endpointu do tworzenia usługi
      const serviceToAdd = {
        ...generatedService
      };
      
      await apiRequest('/api/services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(serviceToAdd)
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
  
  // Generowanie rekomendacji cenowej
  const handleGeneratePricingRecommendation = async () => {
    if (!selectedServiceForPricing) {
      toast({
        title: "Błąd",
        description: "Wybierz usługę do analizy cenowej",
        variant: "destructive"
      });
      return;
    }
    
    setIsGeneratingPricingRecommendation(true);
    setPricingRecommendation(null);
    
    try {
      const response = await apiRequest('/api/ai/pricing-recommendation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serviceName: selectedServiceForPricing.name,
          description: selectedServiceForPricing.longDescription || selectedServiceForPricing.description,
          features: selectedServiceForPricing.features || [],
          scope: selectedServiceForPricing.scope || [],
          currentPrice: selectedServiceForPricing.basePrice
        })
      });
      
      setPricingRecommendation(response.recommendation);
      
      toast({
        title: "Rekomendacja cenowa",
        description: "Rekomendacja cenowa została wygenerowana pomyślnie",
        variant: "default"
      });
    } catch (error) {
      console.error('Błąd podczas generowania rekomendacji cenowej:', error);
      toast({
        title: "Błąd",
        description: `Nie udało się wygenerować rekomendacji: ${error instanceof Error ? error.message : 'Nieznany błąd'}`,
        variant: "destructive"
      });
    } finally {
      setIsGeneratingPricingRecommendation(false);
    }
  };
  
  // Dodawanie wymagania klienta do listy
  const handleAddClientRequirement = () => {
    if (!newRequirement.trim()) return;
    
    setClientRequirements(prev => [...prev, newRequirement]);
    setNewRequirement('');
  };
  
  // Usuwanie wymagania klienta z listy
  const handleRemoveClientRequirement = (index: number) => {
    setClientRequirements(prev => prev.filter((_, i) => i !== index));
  };
  
  // Generowanie estymacji usługi (zakres, czas, koszt)
  const handleGenerateServiceEstimation = async () => {
    if (!selectedServiceForEstimation) {
      toast({
        title: "Błąd",
        description: "Wybierz usługę do estymacji",
        variant: "destructive"
      });
      return;
    }
    
    setIsGeneratingEstimation(true);
    setServiceEstimation(null);
    
    try {
      const response = await apiRequest('/api/ai/service-estimation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serviceName: selectedServiceForEstimation.name,
          serviceDescription: selectedServiceForEstimation.longDescription || selectedServiceForEstimation.description,
          clientRequirements: clientRequirements.length > 0 ? clientRequirements : undefined,
          targetBudget,
          targetDeadline,
          complexity
        })
      });
      
      setServiceEstimation(response.estimation);
      
      toast({
        title: "Estymacja wygenerowana",
        description: `Szacowany koszt: ${response.estimation.totalCost} PLN, czas: ${response.estimation.timeEstimate.recommended} dni`,
        variant: "default"
      });
    } catch (error) {
      console.error('Błąd podczas generowania estymacji usługi:', error);
      toast({
        title: "Błąd",
        description: `Nie udało się wygenerować estymacji: ${error instanceof Error ? error.message : 'Nieznany błąd'}`,
        variant: "destructive"
      });
    } finally {
      setIsGeneratingEstimation(false);
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
    <div className="flex h-screen overflow-hidden relative">
      {/* Przycisk przełączania menu na małych ekranach */}
      <button 
        className="absolute top-4 right-4 md:hidden z-50 bg-white p-2 rounded-md shadow-md"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        {isSidebarOpen ? (
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        )}
      </button>
      
      {/* Boczne menu */}
      <div 
        className={`${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 fixed md:static z-40 bg-slate-50 border-r border-slate-200 h-full w-64 flex flex-col transition-transform duration-300 ease-in-out`}
      >
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 text-transparent bg-clip-text">
            ECM Digital Admin
          </h1>
          <button 
            className="md:hidden text-gray-500 hover:text-gray-700"
            onClick={() => setIsSidebarOpen(false)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        
        <nav className="flex-1 overflow-y-auto p-4">
          <ul className="space-y-2">
            <li>
              <button
                onClick={() => setActiveTab('services')}
                className={`w-full flex items-center px-4 py-2 rounded-lg text-left ${
                  activeTab === 'services' 
                    ? 'bg-purple-100 text-purple-900 font-medium' 
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                Usługi
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveTab('preview')}
                className={`w-full flex items-center px-4 py-2 rounded-lg text-left ${
                  activeTab === 'preview' 
                    ? 'bg-purple-100 text-purple-900 font-medium' 
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                Podgląd usług
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveTab('clients')}
                className={`w-full flex items-center px-4 py-2 rounded-lg text-left ${
                  activeTab === 'clients' 
                    ? 'bg-purple-100 text-purple-900 font-medium' 
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                Klienci
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveTab('ai')}
                className={`w-full flex items-center px-4 py-2 rounded-lg text-left ${
                  activeTab === 'ai' 
                    ? 'bg-purple-100 text-purple-900 font-medium' 
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Generowanie AI
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveTab('orders')}
                className={`w-full flex items-center px-4 py-2 rounded-lg text-left ${
                  activeTab === 'orders' 
                    ? 'bg-purple-100 text-purple-900 font-medium' 
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                Zamówienia
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveTab('stats')}
                className={`w-full flex items-center px-4 py-2 rounded-lg text-left ${
                  activeTab === 'stats' 
                    ? 'bg-purple-100 text-purple-900 font-medium' 
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                Statystyki
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveTab('pricing')}
                className={`w-full flex items-center px-4 py-2 rounded-lg text-left ${
                  activeTab === 'pricing' 
                    ? 'bg-purple-100 text-purple-900 font-medium' 
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                AI Pricing
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveTab('estimator')}
                className={`w-full flex items-center px-4 py-2 rounded-lg text-left ${
                  activeTab === 'estimator' 
                    ? 'bg-purple-100 text-purple-900 font-medium' 
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                AI Estimator
              </button>
            </li>
          </ul>
        </nav>
        
        <div className="p-4 border-t border-slate-200">
          <a href="/" className="flex items-center text-slate-600 hover:text-slate-900">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Powrót do strony głównej
          </a>
        </div>
      </div>
      
      {/* Zawartość główna */}
      <div className={`flex-1 overflow-y-auto transition-all duration-300 ease-in-out ${isSidebarOpen ? 'md:ml-0' : 'ml-0'}`}>
        <div className="p-4 md:p-6">
          {/* Przycisk hamburger menu w nagłówku głównej treści, widoczny tylko na małych ekranach */}
          {!isSidebarOpen && (
            <button 
              className="mb-4 md:hidden inline-flex items-center p-2 rounded-md bg-white shadow-sm border border-gray-200"
              onClick={() => setIsSidebarOpen(true)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </svg>
              <span className="ml-2">Menu</span>
            </button>
          )}
          <h2 className="text-2xl font-bold mb-6">
            {activeTab === 'services' && 'Zarządzanie Usługami'}
            {activeTab === 'preview' && 'Podgląd Usług'}
            {activeTab === 'clients' && 'Zarządzanie Klientami'}
            {activeTab === 'ai' && 'Generowanie Usług z AI'}
            {activeTab === 'orders' && 'Zarządzanie Zamówieniami'}
            {activeTab === 'stats' && 'Statystyki i Raporty'}
            {activeTab === 'pricing' && 'AI Pricing Assistant'}
            {activeTab === 'estimator' && 'AI Service Estimator'}
          </h2>
          
          {activeTab === 'services' && (
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
                            <div className="flex items-center gap-1">
                              <div className="text-sm text-muted-foreground truncate max-w-[250px]">
                                {service.description && service.description.length > 50 
                                  ? `${service.description.substring(0, 50)}...` 
                                  : service.description}
                              </div>
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-4 w-4 p-0">
                                      <Info className="h-3 w-3" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent className="max-w-[400px] p-4 text-wrap break-words">
                                    <p className="font-semibold mb-1">Pełny opis:</p>
                                    <p>{service.description}</p>
                                    {service.longDescription && (
                                      <>
                                        <p className="font-semibold mt-2 mb-1">Szczegółowy opis:</p>
                                        <p>{service.longDescription}</p>
                                      </>
                                    )}
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </div>
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
          )}
          
          {activeTab === 'ai' && (
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
                              {generatedScope.map((scope, idx) => (
                                <li key={idx} className="flex items-start">
                                  <svg className="h-4 w-4 text-blue-500 mr-2 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4" />
                                  </svg>
                                  <span>{scope}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="border p-4 rounded-lg">
                    <h3 className="text-lg font-medium mb-4">Ulepszanie opisu usługi</h3>
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
                          placeholder="Wprowadź obecny opis usługi..." 
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
                            </svg> Ulepszanie...
                          </>
                        ) : (
                          <>
                            <svg className="mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M12 20h9" />
                              <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                            </svg> Ulepsz opis
                          </>
                        )}
                      </Button>
                      
                      {enhancedDescription && (
                        <div className="mt-2">
                          <h4 className="font-medium mb-2 text-sm">Ulepszony opis:</h4>
                          <div className="p-3 bg-gray-50 rounded-md text-sm">
                            {enhancedDescription}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
          
          {activeTab === 'preview' && (
            <Card>
              <CardHeader>
                <CardTitle>Podgląd Usług</CardTitle>
                <CardDescription>
                  Zobacz jak usługi wyglądają na stronie klienta.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {services?.filter(s => s.status === 'Aktywna').map((service: Service) => (
                    <div key={service.id} className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                      <div className="p-4">
                        <div className="font-bold text-lg mb-1">{service.name}</div>
                        <div className="text-sm text-muted-foreground mb-3">
                          {service.shortDescription || service.description?.substring(0, 80)}
                        </div>
                        <div className="flex justify-between items-center mb-3">
                          <div className="text-sm px-2 py-1 bg-gray-100 rounded-full">{service.category || 'Inne'}</div>
                          <div className="font-bold">{service.basePrice} PLN</div>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Czas realizacji: {service.deliveryTime} dni
                        </div>
                      </div>
                      <div className="bg-gray-50 px-4 py-3 border-t">
                        <Button variant="outline" size="sm" className="w-full">
                          Szczegóły
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
          
          {activeTab === 'clients' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  <span>Zarządzanie Klientami</span>
                  <Button onClick={() => { /* Funkcja dodawania klienta */ }}>
                    <Plus className="mr-2 h-4 w-4" /> Dodaj Klienta
                  </Button>
                </CardTitle>
                <CardDescription>
                  Przeglądaj, dodawaj, edytuj i zarządzaj klientami ECM Digital.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isClientsLoading ? (
                  <div className="py-8 text-center">
                    <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-slate-100">
                      <Loader2 className="h-5 w-5 text-slate-500 animate-spin" />
                    </div>
                    <p className="mt-2 text-sm text-slate-500">Ładowanie listy klientów...</p>
                  </div>
                ) : clients.length === 0 ? (
                  <div className="py-16 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium text-slate-900">Brak klientów</h3>
                    <p className="mt-2 text-sm text-slate-500 max-w-md mx-auto">
                      Nie znaleziono żadnych klientów w systemie. Dodaj pierwszego klienta klikając przycisk "Dodaj Klienta".
                    </p>
                    <Button className="mt-4" onClick={() => { /* Funkcja dodawania klienta */ }}>
                      <Plus className="mr-2 h-4 w-4" /> Dodaj pierwszego klienta
                    </Button>
                  </div>
                ) : (
                  <Table>
                    <TableCaption>Lista klientów</TableCaption>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[50px]">ID</TableHead>
                        <TableHead>Klient</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Telefon</TableHead>
                        <TableHead>Firma</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Akcje</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {clients.map((client: any) => (
                        <TableRow key={client.id}>
                          <TableCell className="font-medium">{client.id}</TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <div className="h-9 w-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-800 font-medium mr-3 overflow-hidden">
                                {client.profileImageUrl ? (
                                  <img src={client.profileImageUrl} alt={client.username} className="h-full w-full object-cover" />
                                ) : (
                                  client.firstName && client.lastName ? 
                                    `${client.firstName[0]}${client.lastName[0]}` : 
                                    client.username ? client.username[0].toUpperCase() : '?'
                                )}
                              </div>
                              <div>
                                <div className="font-medium">
                                  {client.firstName && client.lastName 
                                    ? `${client.firstName} ${client.lastName}` 
                                    : client.username || 'Nowy klient'}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  Dołączył: {new Date(client.createdAt).toLocaleDateString('pl-PL')}
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{client.email || '—'}</TableCell>
                          <TableCell>{client.phone || '—'}</TableCell>
                          <TableCell>{client.company || '—'}</TableCell>
                          <TableCell>
                            <div className={`px-2 py-1 rounded-full text-xs inline-block ${
                              client.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                            }`}>
                              {client.isActive ? 'Aktywny' : 'Nieaktywny'}
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button variant="outline" size="icon" onClick={() => { /* Funkcja edycji klienta */ }}>
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="outline" size="icon" 
                                onClick={() => { window.location.href = `/client/${client.id}`; }} 
                                title="Przejdź do profilu klienta">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          )}
          
          {activeTab === 'orders' && (
            <Card>
              <CardHeader>
                <CardTitle>Zarządzanie Zamówieniami</CardTitle>
                <CardDescription>
                  Przeglądaj i zarządzaj zamówieniami klientów.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Alert>
                  <AlertTitle>Funkcja w budowie</AlertTitle>
                  <AlertDescription>
                    Zarządzanie zamówieniami będzie dostępne wkrótce.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          )}
          
          {activeTab === 'stats' && (
            <Card>
              <CardHeader>
                <CardTitle>Statystyki i Raporty</CardTitle>
                <CardDescription>
                  Analizuj statystyki i generuj raporty dotyczące działalności.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Alert>
                  <AlertTitle>Funkcja w budowie</AlertTitle>
                  <AlertDescription>
                    Statystyki i raporty będą dostępne wkrótce.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          )}
          
          {activeTab === 'pricing' && (
            <Card>
              <CardHeader>
                <CardTitle>AI Pricing Assistant</CardTitle>
                <CardDescription>
                  Otrzymaj rekomendacje cenowe dla usług oparte na analizie rynku i konkurencji przy użyciu sztucznej inteligencji.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6">
                  <div className="border rounded-lg p-4">
                    <h3 className="text-lg font-medium mb-4">Wybierz usługę do analizy cenowej</h3>
                    
                    <div className="grid gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="service-select">Usługa</Label>
                        <Select 
                          onValueChange={(value) => {
                            const service = services?.find(s => s.id === value);
                            setSelectedServiceForPricing(service || null);
                          }}
                          value={selectedServiceForPricing?.id || ""}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Wybierz usługę" />
                          </SelectTrigger>
                          <SelectContent>
                            {services?.map((service: Service) => (
                              <SelectItem key={service.id} value={service.id}>
                                {service.name} ({service.basePrice} PLN)
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      {selectedServiceForPricing && (
                        <div className="bg-slate-50 p-3 rounded-md">
                          <h4 className="font-medium mb-2">Wybrana usługa:</h4>
                          <div className="text-sm">
                            <p><strong>Nazwa:</strong> {selectedServiceForPricing.name}</p>
                            <p><strong>Kategoria:</strong> {selectedServiceForPricing.category || 'Brak kategorii'}</p>
                            <p><strong>Obecna cena:</strong> {selectedServiceForPricing.basePrice} PLN</p>
                            <p><strong>Czas realizacji:</strong> {selectedServiceForPricing.deliveryTime} dni</p>
                          </div>
                        </div>
                      )}
                      
                      <Button 
                        className="w-full" 
                        onClick={handleGeneratePricingRecommendation} 
                        disabled={isGeneratingPricingRecommendation || !selectedServiceForPricing}
                      >
                        {isGeneratingPricingRecommendation ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-3 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg> Analizowanie...
                          </>
                        ) : (
                          <>
                            <svg className="mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <circle cx="12" cy="12" r="10" />
                              <line x1="12" y1="8" x2="12" y2="12" />
                              <line x1="12" y1="16" x2="12" y2="16" />
                            </svg> Generuj rekomendację cenową
                          </>
                        )}
                      </Button>
                    </div>
                    
                    {pricingRecommendation && (
                      <div className="mt-6 border rounded-lg bg-white overflow-hidden">
                        <div className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white p-4">
                          <h3 className="text-xl font-bold">Rekomendacja cenowa</h3>
                          <p className="text-white/80 text-sm">Oparta na analizie rynku i konkurencji</p>
                        </div>
                        
                        <div className="p-4">
                          <div className="mb-4 flex justify-between items-center">
                            <div>
                              <div className="text-sm text-gray-500">Rekomendowana cena</div>
                              <div className="text-3xl font-bold text-blue-600">{pricingRecommendation.recommendedPrice} PLN</div>
                            </div>
                            <div className="bg-blue-50 text-blue-700 p-3 rounded-lg">
                              <div className="text-sm">Przedział cenowy</div>
                              <div className="font-semibold">{pricingRecommendation.priceRange.min} - {pricingRecommendation.priceRange.max} PLN</div>
                            </div>
                          </div>
                          
                          <div className="mb-4">
                            <h4 className="font-medium text-gray-700 mb-2">Uzasadnienie</h4>
                            <p className="text-sm text-gray-600">{pricingRecommendation.rationale}</p>
                          </div>
                          
                          <div className="mb-4">
                            <h4 className="font-medium text-gray-700 mb-2">Insighty rynkowe</h4>
                            <ul className="list-disc list-inside text-sm text-gray-600">
                              {pricingRecommendation.marketInsights.map((insight, idx) => (
                                <li key={idx} className="ml-2 mb-1">{insight}</li>
                              ))}
                            </ul>
                          </div>
                          
                          <div>
                            <h4 className="font-medium text-gray-700 mb-2">Pozycjonowanie konkurencyjne</h4>
                            <p className="text-sm text-gray-600">{pricingRecommendation.competitivePositioning}</p>
                          </div>
                          
                          <div className="mt-6 pt-4 border-t border-gray-200 flex justify-between">
                            <div>
                              <div className="text-sm text-gray-500">Obecna cena</div>
                              <div className="font-medium">{selectedServiceForPricing?.basePrice} PLN</div>
                            </div>
                            <div>
                              <div className="text-sm text-gray-500">Sugerowana zmiana</div>
                              <div className={`font-medium ${pricingRecommendation.recommendedPrice > selectedServiceForPricing?.basePrice ? 'text-green-600' : 'text-red-600'}`}>
                                {pricingRecommendation.recommendedPrice > selectedServiceForPricing?.basePrice ? '+' : ''}
                                {pricingRecommendation.recommendedPrice - selectedServiceForPricing?.basePrice} PLN 
                                ({Math.round((pricingRecommendation.recommendedPrice / selectedServiceForPricing?.basePrice - 1) * 100)}%)
                              </div>
                            </div>
                            <Button 
                              variant="outline" 
                              onClick={() => {
                                if (selectedServiceForPricing && editingService === null) {
                                  const serviceToEdit = { ...selectedServiceForPricing, basePrice: pricingRecommendation.recommendedPrice };
                                  setEditingService(serviceToEdit);
                                  setIsEditDialogOpen(true);
                                }
                              }}
                            >
                              Zastosuj rekomendację
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
          
          {activeTab === 'estimator' && (
            <Card>
              <CardHeader>
                <CardTitle>AI Service Estimator</CardTitle>
                <CardDescription>
                  Generuj szczegółowe estymacje zakresu, czasu i kosztów dla usług z pomocą sztucznej inteligencji.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6">
                  <div className="border rounded-lg p-4">
                    <h3 className="text-lg font-medium mb-4">Generowanie estymacji usługi</h3>
                    
                    <div className="grid gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="estimation-service-select">Usługa</Label>
                        <Select 
                          onValueChange={(value) => {
                            const service = services?.find(s => s.id === value);
                            setSelectedServiceForEstimation(service || null);
                            // Resetujemy pozostałe pola po zmianie usługi
                            setClientRequirements([]);
                            setNewRequirement('');
                            setTargetBudget(undefined);
                            setTargetDeadline(undefined);
                            setComplexity('medium');
                          }}
                          value={selectedServiceForEstimation?.id || ""}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Wybierz usługę" />
                          </SelectTrigger>
                          <SelectContent>
                            {services?.map((service: Service) => (
                              <SelectItem key={service.id} value={service.id}>
                                {service.name} ({service.basePrice} PLN)
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      {selectedServiceForEstimation && (
                        <>
                          <div className="bg-slate-50 p-3 rounded-md">
                            <h4 className="font-medium mb-2">Wybrana usługa:</h4>
                            <div className="text-sm">
                              <p><strong>Nazwa:</strong> {selectedServiceForEstimation.name}</p>
                              <p><strong>Kategoria:</strong> {selectedServiceForEstimation.category || 'Brak kategorii'}</p>
                              <p><strong>Standardowa cena:</strong> {selectedServiceForEstimation.basePrice} PLN</p>
                              <p><strong>Standardowy czas realizacji:</strong> {selectedServiceForEstimation.deliveryTime} dni</p>
                            </div>
                          </div>
                          
                          <div className="border-t pt-3">
                            <h4 className="font-medium mb-3">Dodatkowe wymagania klienta:</h4>
                            
                            <div className="flex items-center space-x-2 mb-2">
                              <Input 
                                placeholder="Np. Strona ma być responsywna" 
                                value={newRequirement}
                                onChange={(e) => setNewRequirement(e.target.value)}
                                className="flex-1"
                              />
                              <Button 
                                variant="outline" 
                                onClick={handleAddClientRequirement}
                                disabled={!newRequirement.trim()}
                              >
                                Dodaj
                              </Button>
                            </div>
                            
                            {clientRequirements.length > 0 ? (
                              <div className="mb-4">
                                <div className="text-sm font-medium mb-2">Dodane wymagania:</div>
                                <ul className="text-sm space-y-1">
                                  {clientRequirements.map((req, idx) => (
                                    <li key={idx} className="flex items-center justify-between bg-slate-100 p-2 rounded">
                                      <span>{req}</span>
                                      <Button 
                                        variant="ghost" 
                                        size="icon" 
                                        className="h-6 w-6"
                                        onClick={() => handleRemoveClientRequirement(idx)}
                                      >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                          <line x1="18" y1="6" x2="6" y2="18"></line>
                                          <line x1="6" y1="6" x2="18" y2="18"></line>
                                        </svg>
                                      </Button>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            ) : (
                              <div className="text-sm text-muted-foreground mb-4">Brak dodatkowych wymagań. Estymacja zostanie wygenerowana na podstawie standardowego zakresu usługi.</div>
                            )}
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="target-budget">Docelowy budżet (PLN, opcjonalnie)</Label>
                              <Input 
                                id="target-budget" 
                                type="number"
                                placeholder="Np. 5000" 
                                value={targetBudget || ''}
                                onChange={(e) => setTargetBudget(e.target.value ? Number(e.target.value) : undefined)}
                              />
                            </div>
                            <div>
                              <Label htmlFor="target-deadline">Docelowy czas realizacji (dni, opcjonalnie)</Label>
                              <Input 
                                id="target-deadline" 
                                type="number"
                                placeholder="Np. 14" 
                                value={targetDeadline || ''}
                                onChange={(e) => setTargetDeadline(e.target.value ? Number(e.target.value) : undefined)}
                              />
                            </div>
                          </div>
                          
                          <div>
                            <Label htmlFor="complexity">Poziom złożoności projektu</Label>
                            <Select 
                              value={complexity}
                              onValueChange={(value) => setComplexity(value as 'low' | 'medium' | 'high')}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Wybierz poziom złożoności" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="low">Niski - standardowy projekt</SelectItem>
                                <SelectItem value="medium">Średni - typowy projekt z kilkoma niestandardowymi elementami</SelectItem>
                                <SelectItem value="high">Wysoki - złożony projekt z wieloma niestandardowymi elementami</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <Button 
                            className="w-full mt-2" 
                            onClick={handleGenerateServiceEstimation} 
                            disabled={isGeneratingEstimation}
                          >
                            {isGeneratingEstimation ? (
                              <>
                                <svg className="animate-spin -ml-1 mr-3 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg> Generowanie estymacji...
                              </>
                            ) : (
                              <>
                                <svg className="mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <path d="M12 20V10" />
                                  <path d="M18 20V4" />
                                  <path d="M6 20v-4" />
                                </svg>
                                Generuj estymację
                              </>
                            )}
                          </Button>
                        </>
                      )}
                    </div>
                    
                    {serviceEstimation && (
                      <div className="mt-6 border rounded-lg bg-white overflow-hidden">
                        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-4">
                          <h3 className="text-xl font-bold">Estymacja projektu</h3>
                          <p className="text-white/80 text-sm">Szczegółowa analiza zakresu, czasu i kosztów</p>
                        </div>
                        
                        <div className="p-4">
                          <div className="mb-6 grid grid-cols-3 gap-4">
                            <div className="bg-indigo-50 p-3 rounded-lg text-center">
                              <div className="text-sm text-gray-500">Szacowany koszt</div>
                              <div className="text-xl font-bold text-indigo-600">{serviceEstimation.totalCost} PLN</div>
                            </div>
                            <div className="bg-indigo-50 p-3 rounded-lg text-center">
                              <div className="text-sm text-gray-500">Rekomendowany czas</div>
                              <div className="text-xl font-bold text-indigo-600">{serviceEstimation.timeEstimate.recommended} dni</div>
                            </div>
                            <div className="bg-indigo-50 p-3 rounded-lg text-center">
                              <div className="text-sm text-gray-500">Przedział czasowy</div>
                              <div className="text-xl font-bold text-indigo-600">{serviceEstimation.timeEstimate.min}-{serviceEstimation.timeEstimate.max} dni</div>
                            </div>
                          </div>
                          
                          <div className="mb-5">
                            <h4 className="font-medium text-gray-700 mb-2">Szczegółowy zakres prac</h4>
                            <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                              {serviceEstimation.scope.map((item, idx) => (
                                <li key={idx} className="ml-2">{item}</li>
                              ))}
                            </ul>
                          </div>
                          
                          <div className="mb-5">
                            <h4 className="font-medium text-gray-700 mb-2">Szczegółowy kosztorys</h4>
                            <div className="bg-slate-50 p-3 rounded-md">
                              <table className="w-full text-sm">
                                <thead>
                                  <tr className="border-b border-slate-200">
                                    <th className="text-left pb-2 font-medium">Element</th>
                                    <th className="text-right pb-2 font-medium">Godziny</th>
                                    <th className="text-right pb-2 font-medium">Koszt (PLN)</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {serviceEstimation.costBreakdown.map((item, idx) => (
                                    <tr key={idx} className="border-b border-slate-100">
                                      <td className="py-2">{item.item}</td>
                                      <td className="py-2 text-right">{item.hours}</td>
                                      <td className="py-2 text-right">{item.cost}</td>
                                    </tr>
                                  ))}
                                  <tr className="font-medium bg-slate-100">
                                    <td className="py-2">Całkowity koszt</td>
                                    <td className="py-2 text-right">{serviceEstimation.costBreakdown.reduce((sum, item) => sum + item.hours, 0)}</td>
                                    <td className="py-2 text-right">{serviceEstimation.totalCost}</td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </div>
                          
                          <div className="mb-5">
                            <h4 className="font-medium text-gray-700 mb-2">Ryzyka i założenia</h4>
                            <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                              {serviceEstimation.risksAndAssumptions.map((item, idx) => (
                                <li key={idx} className="ml-2">{item}</li>
                              ))}
                            </ul>
                          </div>
                          
                          <div className="bg-indigo-50 p-4 rounded-lg">
                            <h4 className="font-medium text-indigo-700 mb-2">Proponowane kolejne kroki</h4>
                            <ol className="list-decimal list-inside text-sm text-indigo-900 space-y-1">
                              {serviceEstimation.nextSteps.map((step, idx) => (
                                <li key={idx} className="ml-2">{step}</li>
                              ))}
                            </ol>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
      
      {/* Dialog edycji usługi */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edytuj usługę</DialogTitle>
            <DialogDescription>
              Wprowadź nowe dane dla usługi.
            </DialogDescription>
          </DialogHeader>
          
          {editingService && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-name">Nazwa usługi</Label>
                  <Input
                    id="edit-name"
                    value={editingService.name}
                    onChange={(e) => setEditingService({ ...editingService, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-category">Kategoria</Label>
                  <Input
                    id="edit-category"
                    value={editingService.category || ''}
                    onChange={(e) => setEditingService({ ...editingService, category: e.target.value })}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-short-description">Krótki opis</Label>
                <Textarea
                  id="edit-short-description"
                  value={editingService.shortDescription || ''}
                  onChange={(e) => setEditingService({ ...editingService, shortDescription: e.target.value })}
                  rows={2}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-description">Opis</Label>
                <Textarea
                  id="edit-description"
                  value={editingService.description || ''}
                  onChange={(e) => setEditingService({ ...editingService, description: e.target.value })}
                  rows={3}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-long-description">Szczegółowy opis</Label>
                <Textarea
                  id="edit-long-description"
                  value={editingService.longDescription || ''}
                  onChange={(e) => setEditingService({ ...editingService, longDescription: e.target.value })}
                  rows={5}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-base-price">Cena bazowa (PLN)</Label>
                  <Input
                    id="edit-base-price"
                    type="number"
                    value={editingService.basePrice || 0}
                    onChange={(e) => setEditingService({ ...editingService, basePrice: Number(e.target.value) })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-delivery-time">Czas realizacji (dni)</Label>
                  <Input
                    id="edit-delivery-time"
                    type="number"
                    value={editingService.deliveryTime || 1}
                    onChange={(e) => setEditingService({ ...editingService, deliveryTime: Number(e.target.value) })}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-status">Status</Label>
                <Select
                  value={editingService.status || 'Aktywna'}
                  onValueChange={(value) => setEditingService({ ...editingService, status: value })}
                >
                  <SelectTrigger id="edit-status">
                    <SelectValue placeholder="Wybierz status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Aktywna">Aktywna</SelectItem>
                    <SelectItem value="Nieaktywna">Nieaktywna</SelectItem>
                    <SelectItem value="Archiwalna">Archiwalna</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label>Funkcje</Label>
                  <div className="flex space-x-2">
                    <Input
                      className="w-64"
                      placeholder="Nowa funkcja..."
                      value={newFeature}
                      onChange={(e) => setNewFeature(e.target.value)}
                    />
                    <Button size="sm" onClick={handleAddFeatureToEditing} type="button">
                      Dodaj
                    </Button>
                  </div>
                </div>
                <div className="border rounded-md p-3">
                  {editingService.features && editingService.features.length > 0 ? (
                    <ul className="space-y-1">
                      {editingService.features.map((feature, idx) => (
                        <li key={idx} className="flex justify-between items-center">
                          <span>{feature}</span>
                          <Button variant="ghost" size="icon" onClick={() => handleRemoveFeatureFromEditing(idx)} className="h-6 w-6">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="text-center text-muted-foreground py-2">Brak funkcji</div>
                  )}
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label>Korzyści</Label>
                  <div className="flex space-x-2">
                    <Input
                      className="w-64"
                      placeholder="Nowa korzyść..."
                      value={newBenefit}
                      onChange={(e) => setNewBenefit(e.target.value)}
                    />
                    <Button size="sm" onClick={handleAddBenefitToEditing} type="button">
                      Dodaj
                    </Button>
                  </div>
                </div>
                <div className="border rounded-md p-3">
                  {editingService.benefits && editingService.benefits.length > 0 ? (
                    <ul className="space-y-1">
                      {editingService.benefits.map((benefit, idx) => (
                        <li key={idx} className="flex justify-between items-center">
                          <span>{benefit}</span>
                          <Button variant="ghost" size="icon" onClick={() => handleRemoveBenefitFromEditing(idx)} className="h-6 w-6">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="text-center text-muted-foreground py-2">Brak korzyści</div>
                  )}
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label>Zakres</Label>
                  <div className="flex space-x-2">
                    <Input
                      className="w-64"
                      placeholder="Nowy punkt zakresu..."
                      value={newScope}
                      onChange={(e) => setNewScope(e.target.value)}
                    />
                    <Button size="sm" onClick={handleAddScopeToEditing} type="button">
                      Dodaj
                    </Button>
                  </div>
                </div>
                <div className="border rounded-md p-3">
                  {editingService.scope && editingService.scope.length > 0 ? (
                    <ul className="space-y-1">
                      {editingService.scope.map((scope, idx) => (
                        <li key={idx} className="flex justify-between items-center">
                          <span>{scope}</span>
                          <Button variant="ghost" size="icon" onClick={() => handleRemoveScopeFromEditing(idx)} className="h-6 w-6">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="text-center text-muted-foreground py-2">Brak punktów zakresu</div>
                  )}
                </div>
              </div>
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
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="new-name">Nazwa usługi</Label>
                <Input
                  id="new-name"
                  value={newService.name}
                  onChange={(e) => setNewService({ ...newService, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-category">Kategoria</Label>
                <Input
                  id="new-category"
                  value={newService.category || ''}
                  onChange={(e) => setNewService({ ...newService, category: e.target.value })}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="new-short-description">Krótki opis</Label>
              <Textarea
                id="new-short-description"
                value={newService.shortDescription || ''}
                onChange={(e) => setNewService({ ...newService, shortDescription: e.target.value })}
                rows={2}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="new-description">Opis</Label>
              <Textarea
                id="new-description"
                value={newService.description || ''}
                onChange={(e) => setNewService({ ...newService, description: e.target.value })}
                rows={3}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="new-long-description">Szczegółowy opis</Label>
              <Textarea
                id="new-long-description"
                value={newService.longDescription || ''}
                onChange={(e) => setNewService({ ...newService, longDescription: e.target.value })}
                rows={5}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="new-base-price">Cena bazowa (PLN)</Label>
                <Input
                  id="new-base-price"
                  type="number"
                  value={newService.basePrice || 0}
                  onChange={(e) => setNewService({ ...newService, basePrice: Number(e.target.value) })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-delivery-time">Czas realizacji (dni)</Label>
                <Input
                  id="new-delivery-time"
                  type="number"
                  value={newService.deliveryTime || 1}
                  onChange={(e) => setNewService({ ...newService, deliveryTime: Number(e.target.value) })}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="new-status">Status</Label>
              <Select
                value={newService.status || 'Aktywna'}
                onValueChange={(value) => setNewService({ ...newService, status: value })}
              >
                <SelectTrigger id="new-status">
                  <SelectValue placeholder="Wybierz status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Aktywna">Aktywna</SelectItem>
                  <SelectItem value="Nieaktywna">Nieaktywna</SelectItem>
                  <SelectItem value="Archiwalna">Archiwalna</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label>Funkcje</Label>
                <div className="flex space-x-2">
                  <Input
                    className="w-64"
                    placeholder="Nowa funkcja..."
                    value={newFeature}
                    onChange={(e) => setNewFeature(e.target.value)}
                  />
                  <Button size="sm" onClick={handleAddFeature} type="button">
                    Dodaj
                  </Button>
                </div>
              </div>
              <div className="border rounded-md p-3">
                {newService.features && newService.features.length > 0 ? (
                  <ul className="space-y-1">
                    {newService.features.map((feature, idx) => (
                      <li key={idx} className="flex justify-between items-center">
                        <span>{feature}</span>
                        <Button variant="ghost" size="icon" onClick={() => handleRemoveFeature(idx)} className="h-6 w-6">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="text-center text-muted-foreground py-2">Brak funkcji</div>
                )}
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label>Korzyści</Label>
                <div className="flex space-x-2">
                  <Input
                    className="w-64"
                    placeholder="Nowa korzyść..."
                    value={newBenefit}
                    onChange={(e) => setNewBenefit(e.target.value)}
                  />
                  <Button size="sm" onClick={handleAddBenefit} type="button">
                    Dodaj
                  </Button>
                </div>
              </div>
              <div className="border rounded-md p-3">
                {newService.benefits && newService.benefits.length > 0 ? (
                  <ul className="space-y-1">
                    {newService.benefits.map((benefit, idx) => (
                      <li key={idx} className="flex justify-between items-center">
                        <span>{benefit}</span>
                        <Button variant="ghost" size="icon" onClick={() => handleRemoveBenefit(idx)} className="h-6 w-6">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="text-center text-muted-foreground py-2">Brak korzyści</div>
                )}
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label>Zakres</Label>
                <div className="flex space-x-2">
                  <Input
                    className="w-64"
                    placeholder="Nowy punkt zakresu..."
                    value={newScope}
                    onChange={(e) => setNewScope(e.target.value)}
                  />
                  <Button size="sm" onClick={handleAddScope} type="button">
                    Dodaj
                  </Button>
                </div>
              </div>
              <div className="border rounded-md p-3">
                {newService.scope && newService.scope.length > 0 ? (
                  <ul className="space-y-1">
                    {newService.scope.map((scope, idx) => (
                      <li key={idx} className="flex justify-between items-center">
                        <span>{scope}</span>
                        <Button variant="ghost" size="icon" onClick={() => handleRemoveScope(idx)} className="h-6 w-6">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="text-center text-muted-foreground py-2">Brak punktów zakresu</div>
                )}
              </div>
            </div>
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