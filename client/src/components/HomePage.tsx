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
              ECM Digital - UX, AI i strony internetowe
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
              <a href="#contact-form">
                <Button variant="outline" size="lg" className="font-medium bg-gradient-to-r from-purple-500 to-indigo-600 text-white hover:from-purple-600 hover:to-indigo-700 border-0">
                  Umów bezpłatny audyt UX z AI
                </Button>
              </a>
            </div>
            <div className="mt-6 flex flex-wrap gap-4 justify-center">
              <a href="#services">
                <Button variant="outline" size="md" className="font-medium">
                  Dowiedz się więcej
                </Button>
              </a>
              <a href="#case-studies">
                <Button variant="ghost" size="md" className="font-medium text-blue-600 hover:text-blue-700">
                  Zobacz nasze realizacje
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
                <div className="mt-8 text-center">
                  <a href="#contact-form">
                    <Button className="bg-amber-500 hover:bg-amber-600 text-white">
                      Zamów MVP swojego startupu
                    </Button>
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* Case Studies Section */}
          <section id="case-studies" className="py-16 bg-white">
            <div className="container mx-auto px-4">
              <div className="max-w-3xl mx-auto text-center mb-12">
                <h2 className="text-3xl font-bold mb-4">Nasze realizacje</h2>
                <p className="text-gray-600">
                  Zobacz, jak pomagamy naszym klientom osiągać realne rezultaty biznesowe
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {/* Case Study 1 */}
                <div className="bg-gray-50 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  <div className="h-48 bg-gradient-to-r from-blue-500 to-indigo-600 relative">
                    <div className="absolute inset-0 flex items-center justify-center text-white text-2xl font-bold">
                      AI
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2">Sklep AI dla branży kosmetycznej</h3>
                    
                    <div className="mb-4">
                      <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 mb-2 mr-2">Problem</Badge>
                      <p className="text-sm text-gray-600">Niska konwersja, brak obsługi klienta 24/7, nieefektywny proces doboru produktów</p>
                    </div>
                    
                    <div className="mb-4">
                      <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 mb-2 mr-2">Rozwiązanie</Badge>
                      <p className="text-sm text-gray-600">Lejek AI + sklep Webflow + kampania Instagram Ads + chatbot dobierający produkty</p>
                    </div>
                    
                    <div className="mb-4">
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 mb-2 mr-2">Efekt</Badge>
                      <p className="text-sm text-gray-600">+40% konwersji, automatyzacja obsługi, wzrost średniej wartości koszyka o 28%</p>
                    </div>
                    
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <Link href="/case-studies">
                        <Button variant="ghost" size="sm" className="w-full justify-center">
                          Dowiedz się więcej <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
                
                {/* Case Study 2 */}
                <div className="bg-gray-50 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  <div className="h-48 bg-gradient-to-r from-purple-500 to-pink-500 relative">
                    <div className="absolute inset-0 flex items-center justify-center text-white text-2xl font-bold">
                      UX
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2">Aplikacja mobilna dla firmy fitness</h3>
                    
                    <div className="mb-4">
                      <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 mb-2 mr-2">Problem</Badge>
                      <p className="text-sm text-gray-600">Przestarzały interfejs, skomplikowany system rezerwacji, niska retencja użytkowników</p>
                    </div>
                    
                    <div className="mb-4">
                      <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 mb-2 mr-2">Rozwiązanie</Badge>
                      <p className="text-sm text-gray-600">Redesign UX + prostszy flow rezerwacji + gamifikacja + integracja z Apple Health</p>
                    </div>
                    
                    <div className="mb-4">
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 mb-2 mr-2">Efekt</Badge>
                      <p className="text-sm text-gray-600">+65% retencji użytkowników, wzrost rezerwacji o 42%, ocena 4.8/5 w App Store</p>
                    </div>
                    
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <a href="#contact-form">
                        <Button variant="ghost" size="sm" className="w-full justify-center">
                          Pobierz darmowy UX Scorecard <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </a>
                    </div>
                  </div>
                </div>
                
                {/* Case Study 3 */}
                <div className="bg-gray-50 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  <div className="h-48 bg-gradient-to-r from-amber-500 to-orange-500 relative">
                    <div className="absolute inset-0 flex items-center justify-center text-white text-2xl font-bold">
                      MVP
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2">MVP dla startupu SaaS</h3>
                    
                    <div className="mb-4">
                      <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 mb-2 mr-2">Problem</Badge>
                      <p className="text-sm text-gray-600">Potrzeba szybkiego wejścia na rynek, ograniczony budżet, brak technicznego zespołu</p>
                    </div>
                    
                    <div className="mb-4">
                      <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 mb-2 mr-2">Rozwiązanie</Badge>
                      <p className="text-sm text-gray-600">Lean MVP + minimalistyczny UX + rozwój produktu oparty na feedbacku + skalowalny backend</p>
                    </div>
                    
                    <div className="mb-4">
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 mb-2 mr-2">Efekt</Badge>
                      <p className="text-sm text-gray-600">MVP w 6 tygodni, pozyskanie pierwszych 50 klientów, zabezpieczenie kolejnej rundy finansowania</p>
                    </div>
                    
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <a href="#contact-form">
                        <Button variant="ghost" size="sm" className="w-full justify-center">
                          Zamów MVP swojego startupu <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

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