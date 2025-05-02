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
            <h2 className="text-3xl font-bold mb-4">Oferta ECM Digital</h2>
            <p className="text-gray-600">
              Specjalizujemy się w projektowaniu skutecznych doświadczeń użytkownika, 
              budowie stron internetowych oraz integracji rozwiązań AI dla Twojego biznesu.
            </p>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(5)].map((_, index) => (
                <div key={index} className="animate-pulse bg-white rounded-lg shadow-sm p-6">
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-6"></div>
                  <div className="h-20 bg-gray-200 rounded mb-4"></div>
                  <div className="h-10 bg-gray-200 rounded mt-6"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-16">
              {/* UX & Conversion Design */}
              <div className="mb-10">
                <div className="flex items-center mb-6">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600">
                      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                      <circle cx="9" cy="7" r="4"></circle>
                      <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                      <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">UX & Conversion Design</h2>
                </div>
                <p className="text-gray-600 mb-6 pl-12">
                  Projektujemy nie tylko ładne, ale przede wszystkim skuteczne doświadczenia użytkownika, które zwiększają konwersję.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredServices
                    .filter(service => ['UX/UI'].includes(service.category || 'Inne'))
                    .slice(0, 3)
                    .map((service) => (
                      <Card key={service.id} className="overflow-hidden hover:shadow-md transition-shadow">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-xl">{service.name}</CardTitle>
                          <CardDescription>
                            {service.shortDescription || service.description.substring(0, 100) + (service.description.length > 100 ? '...' : '')}
                          </CardDescription>
                        </CardHeader>
                        <CardFooter className="pt-0 flex justify-between items-center">
                          <div className="text-lg font-semibold text-blue-600">
                            {service.basePrice} PLN
                          </div>
                          <Link href={`/service/${service.id}`}>
                            <Button variant="outline" size="sm">
                              Szczegóły <ArrowRight className="ml-1 h-4 w-4" />
                            </Button>
                          </Link>
                        </CardFooter>
                      </Card>
                    ))}
                </div>
              </div>

              {/* Projektowanie i rozwój stron internetowych */}
              <div className="mb-10">
                <div className="flex items-center mb-6">
                  <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-600">
                      <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                      <line x1="8" y1="21" x2="16" y2="21"></line>
                      <line x1="12" y1="17" x2="12" y2="21"></line>
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Projektowanie i rozwój stron internetowych</h2>
                </div>
                <p className="text-gray-600 mb-6 pl-12">
                  Tworzymy nowoczesne, responsywne strony i sklepy internetowe z myślą o wydajności i SEO.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredServices
                    .filter(service => ['Web Development', 'E-commerce', 'SEO'].includes(service.category || 'Inne'))
                    .slice(0, 3)
                    .map((service) => (
                      <Card key={service.id} className="overflow-hidden hover:shadow-md transition-shadow">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-xl">{service.name}</CardTitle>
                          <CardDescription>
                            {service.shortDescription || service.description.substring(0, 100) + (service.description.length > 100 ? '...' : '')}
                          </CardDescription>
                        </CardHeader>
                        <CardFooter className="pt-0 flex justify-between items-center">
                          <div className="text-lg font-semibold text-indigo-600">
                            {service.basePrice} PLN
                          </div>
                          <Link href={`/service/${service.id}`}>
                            <Button variant="outline" size="sm">
                              Szczegóły <ArrowRight className="ml-1 h-4 w-4" />
                            </Button>
                          </Link>
                        </CardFooter>
                      </Card>
                    ))}
                </div>
              </div>

              {/* Social Media & Kampanie Reklamowe */}
              <div className="mb-10">
                <div className="flex items-center mb-6">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-600">
                      <line x1="12" y1="20" x2="12" y2="10"></line>
                      <line x1="18" y1="20" x2="18" y2="4"></line>
                      <line x1="6" y1="20" x2="6" y2="16"></line>
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Social Media & Kampanie Reklamowe</h2>
                </div>
                <p className="text-gray-600 mb-6 pl-12">
                  Zwiększamy zasięg i sprzedaż dzięki dopracowanym kampaniom reklamowym i contentowi.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredServices
                    .filter(service => ['Marketing'].includes(service.category || 'Inne'))
                    .slice(0, 3)
                    .map((service) => (
                      <Card key={service.id} className="overflow-hidden hover:shadow-md transition-shadow">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-xl">{service.name}</CardTitle>
                          <CardDescription>
                            {service.shortDescription || service.description.substring(0, 100) + (service.description.length > 100 ? '...' : '')}
                          </CardDescription>
                        </CardHeader>
                        <CardFooter className="pt-0 flex justify-between items-center">
                          <div className="text-lg font-semibold text-purple-600">
                            {service.basePrice} PLN
                          </div>
                          <Link href={`/service/${service.id}`}>
                            <Button variant="outline" size="sm">
                              Szczegóły <ArrowRight className="ml-1 h-4 w-4" />
                            </Button>
                          </Link>
                        </CardFooter>
                      </Card>
                    ))}
                </div>
              </div>

              {/* Integracje AI i Automatyzacje */}
              <div className="mb-10">
                <div className="flex items-center mb-6">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                      <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Integracje AI i Automatyzacje</h2>
                </div>
                <p className="text-gray-600 mb-6 pl-12">
                  Usprawniamy procesy w firmach dzięki inteligentnym automatyzacjom i agentom AI.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredServices
                    .filter(service => ['AI', 'Automatyzacja'].includes(service.category || 'Inne'))
                    .slice(0, 3)
                    .map((service) => (
                      <Card key={service.id} className="overflow-hidden hover:shadow-md transition-shadow">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-xl">{service.name}</CardTitle>
                          <CardDescription>
                            {service.shortDescription || service.description.substring(0, 100) + (service.description.length > 100 ? '...' : '')}
                          </CardDescription>
                        </CardHeader>
                        <CardFooter className="pt-0 flex justify-between items-center">
                          <div className="text-lg font-semibold text-green-600">
                            {service.basePrice} PLN
                          </div>
                          <Link href={`/service/${service.id}`}>
                            <Button variant="outline" size="sm">
                              Szczegóły <ArrowRight className="ml-1 h-4 w-4" />
                            </Button>
                          </Link>
                        </CardFooter>
                      </Card>
                    ))}
                </div>
              </div>

              {/* Oferta Startupowa i Discovery */}
              <div className="mb-10">
                <div className="flex items-center mb-6">
                  <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-600">
                      <path d="M22 2L11 13"></path>
                      <path d="M22 2l-7 20-4-9-9-4 20-7z"></path>
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Oferta Startupowa i Discovery</h2>
                </div>
                <p className="text-gray-600 mb-6 pl-12">
                  Pomagamy startupom zbudować trafiony produkt szybciej i taniej.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredServices
                    .filter(service => ['Consulting', 'Development'].includes(service.category || 'Inne'))
                    .slice(0, 3)
                    .map((service) => (
                      <Card key={service.id} className="overflow-hidden hover:shadow-md transition-shadow">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-xl">{service.name}</CardTitle>
                          <CardDescription>
                            {service.shortDescription || service.description.substring(0, 100) + (service.description.length > 100 ? '...' : '')}
                          </CardDescription>
                        </CardHeader>
                        <CardFooter className="pt-0 flex justify-between items-center">
                          <div className="text-lg font-semibold text-amber-600">
                            {service.basePrice} PLN
                          </div>
                          <Link href={`/service/${service.id}`}>
                            <Button variant="outline" size="sm">
                              Szczegóły <ArrowRight className="ml-1 h-4 w-4" />
                            </Button>
                          </Link>
                        </CardFooter>
                      </Card>
                    ))}
                </div>
              </div>
            </div>
          )}

          <div className="mt-10 text-center">
            <Link href="/services">
              <Button variant="outline" size="lg">
                Zobacz wszystkie usługi
              </Button>
            </Link>
          </div>
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