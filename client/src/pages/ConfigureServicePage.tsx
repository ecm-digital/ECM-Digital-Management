import React from 'react';
import { useRoute } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import Layout from '@/components/Layout';
import MainApp from '@/components/MainApp';
import { Service } from '@/types';
import { ArrowLeft, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';

export default function ConfigureServicePage() {
  const [match, params] = useRoute('/configure/:id');
  const serviceId = params?.id;

  // Pobieranie wszystkich usług
  const { data: services, isLoading } = useQuery<Service[]>({
    queryKey: ['/api/services'],
  });

  // Filtrowanie aktywnych usług
  const filteredServices = services?.filter(service => service.status === 'Aktywna') || [];
  
  // Jeśli jest serviceId, pokazujemy tylko tę usługę
  const servicesToShow = serviceId 
    ? filteredServices.filter(service => service.id === serviceId) 
    : filteredServices;

  return (
    <Layout>
      <div className="container mx-auto py-8">
        {serviceId && (
          <div className="mb-6">
            <Link href={`/service/${serviceId}`}>
              <Button variant="ghost" className="flex items-center gap-2">
                <ArrowLeft size={16} /> Powrót do szczegółów usługi
              </Button>
            </Link>
          </div>
        )}
        
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-4">Konfigurator usług</h1>
          <p className="text-gray-600 mb-6">
            {serviceId 
              ? "Dostosuj wybraną usługę do swoich potrzeb przy użyciu konfiguratora poniżej."
              : "Wybierz i skonfiguruj usługę, która najlepiej pasuje do Twoich potrzeb biznesowych."}
          </p>
          
          <MainApp services={servicesToShow} isLoading={isLoading} />
        </div>
      </div>
    </Layout>
  );
}