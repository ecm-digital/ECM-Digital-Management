import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import { Service } from '@/types';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, ArrowRight, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function ServicesPage() {
  const { data: services, isLoading } = useQuery<Service[]>({
    queryKey: ['/api/services'],
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Get all unique categories
  const categories = services ? 
    ['all', ...Array.from(new Set(services.map(s => s.category || 'Inne')))] : 
    ['all'];

  // Filter services based on search term and category
  const filteredServices = services?.filter(service => {
    const matchesSearch = service.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          service.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || service.category === categoryFilter;
    const isActive = service.status === 'Aktywna';
    
    return matchesSearch && matchesCategory && isActive;
  }) || [];

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">Nasze usługi</h1>
          <p className="text-gray-600 mb-8">
            Przeglądaj naszą pełną ofertę usług marketingowych i technologicznych. 
            Znajdź idealne rozwiązanie dla swojego biznesu.
          </p>

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

          {/* Services Grid */}
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
          ) : filteredServices.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-xl font-medium mb-2">Nie znaleziono usług</h3>
              <p className="text-gray-600 mb-6">
                Nie znaleziono usług pasujących do podanych kryteriów. Spróbuj zmienić wyszukiwanie lub filtry.
              </p>
              <Button variant="outline" onClick={() => {
                setSearchTerm('');
                setCategoryFilter('all');
              }}>
                Resetuj filtry
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredServices.map((service) => (
                <Card key={service.id} className="overflow-hidden hover:shadow-md transition-shadow">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-xl">{service.name}</CardTitle>
                      <Badge variant="outline" className="bg-blue-50">
                        {service.category || 'Inne'}
                      </Badge>
                    </div>
                    <CardDescription>
                      {service.shortDescription || service.description.substring(0, 100) + (service.description.length > 100 ? '...' : '')}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pb-4">
                    <div className="space-y-1">
                      {service.features?.slice(0, 3).map((feature, idx) => (
                        <p key={idx} className="flex items-start text-sm text-gray-600">
                          <Check className="h-4 w-4 text-green-500 mr-1 mt-0.5 flex-shrink-0" />
                          <span>{feature}</span>
                        </p>
                      ))}
                      {service.features && service.features.length > 3 && (
                        <p className="text-sm text-gray-600 italic">i więcej...</p>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter className="pt-0 flex justify-between items-center">
                    <div>
                      <span className="text-lg font-semibold text-blue-600">{service.basePrice} PLN</span>
                      <span className="text-xs text-gray-500 ml-2">Czas realizacji: {service.deliveryTime} dni</span>
                    </div>
                    <Link href={`/service/${service.id}`}>
                      <Button variant="outline">
                        Szczegóły <ArrowRight className="ml-1 h-4 w-4" />
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}