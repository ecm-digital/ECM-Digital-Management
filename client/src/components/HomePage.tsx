import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import { Service } from '@/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function HomePage() {
  const { data: services = [], isLoading, isError } = useQuery<Service[]>({ 
    queryKey: ['/api/services'], 
    staleTime: 5000 
  });

  if (isLoading) {
    return (
      <div className="container mx-auto p-8 text-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-64 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="container mx-auto p-8 text-center">
        <h2 className="text-red-500 font-bold text-xl mb-4">Błąd ładowania usług</h2>
        <p>Przepraszamy, nie udało się załadować listy usług. Spróbuj odświeżyć stronę.</p>
      </div>
    );
  }

  // Filtruj tylko aktywne usługi
  const activeServices = services.filter(service => service.status === 'Aktywna');

  return (
    <div className="container mx-auto p-4 py-10">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
          Usługi ECM Digital
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Oferujemy kompleksowe rozwiązania cyfrowe dla Twojego biznesu. Wybierz usługę dopasowaną do Twoich potrzeb.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {activeServices.map((service) => (
          <Card key={service.id} className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="text-xl">{service.name}</CardTitle>
              <div className="flex gap-2">
                <Badge variant="outline" className="bg-blue-50">
                  {service.category || 'Inne'}
                </Badge>
                <Badge variant="outline" className="bg-green-50">
                  {service.deliveryTime} dni
                </Badge>
              </div>
              <CardDescription>
                {service.shortDescription || service.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline mb-4">
                <span className="text-3xl font-bold text-blue-600">{service.basePrice}</span>
                <span className="ml-1 text-gray-600">PLN</span>
              </div>
              
              {service.features && service.features.length > 0 && (
                <ul className="space-y-2 mb-4">
                  {service.features.slice(0, 3).map((feature, idx) => (
                    <li key={idx} className="flex items-start">
                      <svg className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                  {service.features.length > 3 && (
                    <li className="text-gray-500 text-sm">
                      +{service.features.length - 3} więcej...
                    </li>
                  )}
                </ul>
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              <Link href={`/service/${service.id}`}>
                <Button variant="outline">Szczegóły</Button>
              </Link>
              <Link href={`/configure/${service.id}`}>
                <Button>Konfiguruj</Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>

      {activeServices.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">Brak dostępnych usług.</p>
        </div>
      )}
    </div>
  );
}