import React from 'react';
import { Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Service } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Check, CheckCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function HomePage() {
  const { data: services, isLoading } = useQuery<Service[]>({
    queryKey: ['/api/services'],
  });

  const filteredServices = services?.filter(service => service.status === 'Aktywna') || [];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
              Profesjonalne rozwiązania marketingowe dla Twojego biznesu
            </h1>
            <p className="text-xl text-gray-700 mb-8">
              Specjalizujemy się w dostarczaniu kompleksowych usług marketingowych i technologicznych, które pomogą Twojej firmie osiągnąć sukces w cyfrowym świecie.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/services">
                <Button size="lg" className="font-medium">
                  Przeglądaj usługi <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <a href="#services">
                <Button variant="outline" size="lg" className="font-medium">
                  Dowiedz się więcej
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Dlaczego warto z nami współpracować?</h2>
            <p className="text-gray-600">
              Łączymy kreatywność z technologią, aby dostarczać rozwiązania, które przynoszą realne rezultaty.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-50 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Doświadczenie</h3>
              <p className="text-gray-600">
                Ponad 10 lat doświadczenia w branży marketingowej i technologicznej.
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Indywidualne podejście</h3>
              <p className="text-gray-600">
                Każdy projekt traktujemy indywidualnie, dostosowując nasze usługi do Twoich potrzeb.
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Najnowsze technologie</h3>
              <p className="text-gray-600">
                Wykorzystujemy najnowsze technologie i narzędzia, aby zapewnić najwyższą jakość usług.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Nasze usługi</h2>
            <p className="text-gray-600">
              Oferujemy szeroki zakres usług marketingowych i technologicznych, które pomogą Twojej firmie rozwinąć się w cyfrowym świecie.
            </p>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(3)].map((_, index) => (
                <div key={index} className="animate-pulse bg-white rounded-lg shadow-sm p-6">
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-6"></div>
                  <div className="h-20 bg-gray-200 rounded mb-4"></div>
                  <div className="h-10 bg-gray-200 rounded mt-6"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredServices.slice(0, 6).map((service) => (
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
                    <div className="text-lg font-semibold text-blue-600">
                      {service.basePrice} PLN
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

          {filteredServices.length > 6 && (
            <div className="mt-10 text-center">
              <Link href="/services">
                <Button variant="outline" size="lg">
                  Zobacz wszystkie usługi
                </Button>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Gotowy, aby rozpocząć współpracę?</h2>
            <p className="text-xl opacity-90 mb-8">
              Skontaktuj się z nami już dziś, aby omówić, jak możemy pomóc Twojemu biznesowi.
            </p>
            <Link href="/services">
              <Button variant="secondary" size="lg" className="font-medium">
                Sprawdź nasze usługi
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}