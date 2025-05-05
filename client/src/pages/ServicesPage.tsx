import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import { Service } from '@/types';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, ArrowRight, Filter, Laptop, Users, BarChart, Bot, Rocket } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ServiceCard from '../components/ServiceCard.jsx';
import { useTranslation } from 'react-i18next';

export default function ServicesPage() {
  const { t, i18n } = useTranslation();
  
  const { data: services, isLoading, refetch } = useQuery<Service[]>({
    queryKey: ['/api/services', i18n.language],
    queryFn: () => fetch(`/api/services?lang=${i18n.language}`).then(res => res.json()),
  });
  
  // Ponowne pobranie danych gdy zmieni się język
  useEffect(() => {
    console.log("Język zmieniony w ServicesPage:", i18n.language);
    refetch();
  }, [i18n.language, refetch]);

  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [activeTab, setActiveTab] = useState('all');

  // Definicja głównych kategorii z dokumentu
  const mainCategories = [
    { id: 'ux-design', name: 'UX & Conversion Design', icon: <Users className="h-4 w-4" /> },
    { id: 'web-development', name: 'Projektowanie i rozwój stron', icon: <Laptop className="h-4 w-4" /> },
    { id: 'social-marketing', name: 'Social Media & Kampanie', icon: <BarChart className="h-4 w-4" /> },
    { id: 'ai-automation', name: 'Integracje AI i Automatyzacje', icon: <Bot className="h-4 w-4" /> },
    { id: 'startup', name: 'Oferta Startupowa', icon: <Rocket className="h-4 w-4" /> }
  ];

  // Mapowanie kategorii z bazy danych do głównych kategorii
  const categoryMapping = {
    'UX/UI': 'ux-design',
    'Web Development': 'web-development',
    'E-commerce': 'web-development',
    'Marketing': 'social-marketing',
    'SEO': 'web-development',
    'AI': 'ai-automation',
    'Automatyzacja': 'ai-automation',
    'Consulting': 'startup',
    'Development': 'startup'
  };

  // Funkcja pomocnicza do mapowania kategorii
  const mapServiceToMainCategory = (service: Service) => {
    const originalCategory = service.category || 'Inne';
    // Dodajemy sprawdzenie czy kategoria istnieje w mapowaniu
    return (originalCategory in categoryMapping) 
      ? categoryMapping[originalCategory as keyof typeof categoryMapping] 
      : 'other';
  };

  // Get all unique categories
  const categories = services ? 
    ['all', ...Array.from(new Set(services.map(s => s.category || 'Inne')))] : 
    ['all'];

  // Filter services based on search term, category and tab
  const filteredServices = services?.filter(service => {
    const matchesSearch = service.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          service.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || service.category === categoryFilter;
    const matchesTab = activeTab === 'all' || mapServiceToMainCategory(service) === activeTab;
    const isActive = service.status === 'Aktywna';
    
    return matchesSearch && matchesCategory && matchesTab && isActive;
  }) || [];

  // Grupowanie usług według głównych kategorii
  const groupedServices = mainCategories.map(category => {
    const categoryServices = services?.filter(service => 
      mapServiceToMainCategory(service) === category.id && service.status === 'Aktywna'
    ) || [];
    
    return {
      ...category,
      services: categoryServices
    };
  });

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">Oferta ECM Digital</h1>
          <p className="text-gray-600 mb-8">
            Specjalizujemy się w projektowaniu skutecznych doświadczeń użytkownika, 
            budowie stron internetowych oraz integracji rozwiązań AI dla Twojego biznesu.
          </p>

          {/* Main Category Tabs */}
          <Tabs 
            defaultValue="all" 
            value={activeTab}
            onValueChange={setActiveTab}
            className="mb-8"
          >
            <TabsList className="w-full justify-start overflow-x-auto whitespace-nowrap scrollbar-hide mb-4 tabs-list-wrapper">
              <TabsTrigger value="all" className="px-4">
                Wszystkie usługi
              </TabsTrigger>
              {mainCategories.map((category) => (
                <TabsTrigger key={category.id} value={category.id} className="px-4">
                  <span className="flex items-center">
                    {category.icon}
                    <span className="ml-2">{category.name}</span>
                  </span>
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>

          {/* Filters */}
          <div className="mb-8 flex flex-col md:flex-row gap-4">
            <div className="flex-grow">
              <Input
                placeholder="Szukaj usług..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="w-full md:w-64">
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger>
                  <div className="flex items-center">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Filtruj po kategorii" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category === 'all' ? 'Wszystkie kategorie' : category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Services */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[...Array(4)].map((_, index) => (
                <div key={index} className="animate-pulse bg-white rounded-lg shadow-sm p-6 border">
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-6"></div>
                  <div className="h-20 bg-gray-200 rounded mb-4"></div>
                  <div className="h-10 bg-gray-200 rounded mt-6"></div>
                </div>
              ))}
            </div>
          ) : activeTab === 'all' && categoryFilter === 'all' && !searchTerm ? (
            // Wyświetl usługi pogrupowane według głównych kategorii
            <div className="space-y-12">
              {groupedServices.map((category) => (
                category.services.length > 0 && (
                  <div key={category.id} className="mb-10">
                    <div className="flex items-center mb-6">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                        {category.icon}
                      </div>
                      <h2 className="text-2xl font-bold text-gray-900">{category.name}</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {category.services.map((service) => (
                        <ServiceCard 
                          key={service.id}
                          service={service}
                          colorClass="text-blue-600"
                          showCategory={true}
                          showFeatures={true}
                        />
                      ))}
                    </div>
                  </div>
                )
              ))}
            </div>
          ) : filteredServices.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-xl font-medium mb-2">Nie znaleziono usług</h3>
              <p className="text-gray-600 mb-6">
                Nie znaleziono usług pasujących do podanych kryteriów. Spróbuj zmienić wyszukiwanie lub filtry.
              </p>
              <Button variant="outline" onClick={() => {
                setSearchTerm('');
                setCategoryFilter('all');
                setActiveTab('all');
              }}>
                Resetuj filtry
              </Button>
            </div>
          ) : (
            // Wyświetl wyfiltrowane usługi
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredServices.map((service) => (
                <ServiceCard 
                  key={service.id}
                  service={service}
                  colorClass="text-blue-600"
                  showCategory={true}
                  showFeatures={true}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}