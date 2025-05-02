import React, { useState, useEffect } from 'react';
import { Service } from '@/types';
import { queryClient, apiRequest } from '@/lib/queryClient';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from '@tanstack/react-query';
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
import { Edit, Trash2, Plus } from 'lucide-react';

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
    description: '',
    basePrice: 0,
    deliveryTime: 1,
    features: [] as string[],
    category: 'Inne',
    status: 'Aktywna'
  });
  const [newFeature, setNewFeature] = useState('');
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
      console.error('Błąd podczas aktualizacji usługi:', error);
      toast({
        title: "Błąd",
        description: `Nie udało się zaktualizować usługi: ${error instanceof Error ? error.message : 'Nieznany błąd'}`,
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
    if (!newService.name || !newService.description) {
      toast({
        title: "Błąd",
        description: "Nazwa i opis usługi są wymagane",
        variant: "destructive"
      });
      return;
    }
    
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
        description: '',
        basePrice: 0,
        deliveryTime: 1,
        features: [],
        category: 'Inne',
        status: 'Aktywna'
      });
      setNewFeature('');
      
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
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="services">Usługi</TabsTrigger>
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
                <Label htmlFor="description" className="text-right">Opis</Label>
                <Textarea
                  id="description"
                  value={editingService.description}
                  onChange={(e) => setEditingService({...editingService, description: e.target.value})}
                  className="col-span-3"
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
              <Label htmlFor="new-description" className="text-right">Opis *</Label>
              <Textarea
                id="new-description"
                value={newService.description}
                onChange={(e) => setNewService({...newService, description: e.target.value})}
                className="col-span-3"
                placeholder="Szczegółowy opis usługi"
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