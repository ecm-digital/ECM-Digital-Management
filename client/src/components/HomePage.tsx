import React from 'react';
import { Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Service } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Check, CheckCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function HomePage() {
  const { data: services, isLoading } = useQuery<Service[]>({
    queryKey: ['/api/services'],
  });

  const filteredServices = services?.filter(service => service.status === 'Aktywna') || [];

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header z logo i przyciskami nawigacji */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm py-4">
        <div className="container-tight flex justify-between items-center">
          <div className="flex items-center">
            <h2 className="text-xl font-bold heading-gradient mr-8">ECM Digital</h2>
          </div>
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#services" className="text-gray-600 hover:text-primary font-medium transition-colors">Usługi</a>
            <a href="#case-studies" className="text-gray-600 hover:text-primary font-medium transition-colors">Case Studies</a>
            <a href="#contact-form" className="text-gray-600 hover:text-primary font-medium transition-colors">Kontakt</a>
            <a href="#contact-form">
              <Button className="btn-modern btn-gradient">
                Umów konsultację
              </Button>
            </a>
          </nav>
          <div className="block md:hidden">
            <Button variant="ghost" size="icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-menu"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-36 overflow-hidden relative">
        {/* Tło z gradientem i kształtami */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-1/4 -right-1/4 w-[600px] h-[600px] rounded-full bg-primary/5 blur-3xl"></div>
          <div className="absolute top-1/2 left-1/4 w-[400px] h-[400px] rounded-full bg-secondary/5 blur-3xl"></div>
          <div className="absolute bottom-1/3 right-1/3 w-[300px] h-[300px] rounded-full bg-purple-400/5 blur-3xl"></div>
        </div>
        
        <div className="container-tight relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div>
                <Badge className="bg-primary/10 text-primary hover:bg-primary/20 transition-colors mb-5 py-1.5 px-4 rounded-full text-sm font-medium">
                  Agencja UX & Marketing
                </Badge>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6 text-balance">
                  <span className="inline heading-gradient">Tworzymy cyfrowe</span> <br />
                  doświadczenia, które konwertują
                </h1>
                <p className="text-xl text-gray-700 leading-relaxed max-w-xl">
                  Specjalizujemy się w projektowaniu skutecznych doświadczeń użytkownika, budowie stron internetowych oraz integracji rozwiązań AI dla Twojego biznesu.
                </p>
              </div>
              
              <div className="flex flex-wrap gap-5 pt-4">
                <Link href="/services">
                  <Button className="btn-modern btn-gradient text-white py-6 px-8 text-base">
                    Poznaj nasze usługi <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <a href="#contact-form">
                  <Button variant="outline" className="btn-modern border-2 py-6 px-8 text-base">
                    Zamów bezpłatny audyt UX
                  </Button>
                </a>
              </div>
              
              <div className="grid grid-cols-2 gap-4 pt-6">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center mt-0.5">
                    <Check className="h-4 w-4 text-green-600" /> 
                  </div>
                  <div>
                    <p className="font-medium">Skuteczne UX</p>
                    <p className="text-sm text-gray-500">Projektujemy w oparciu o dane</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center mt-0.5">
                    <Check className="h-4 w-4 text-blue-600" /> 
                  </div>
                  <div>
                    <p className="font-medium">Szybka realizacja</p>
                    <p className="text-sm text-gray-500">Terminy zawsze dotrzymane</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="absolute -top-20 -right-20 w-96 h-96 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full blur-3xl"></div>
              
              <div className="relative z-10 rounded-2xl overflow-hidden glassmorphism p-1">
                <div className="card-modern glassmorphism p-8 sm:p-10 relative border-0 shadow-none">
                  <div className="grid gap-8">
                    <div>
                      <Badge className="bg-blue-100 text-blue-700 mb-3">Pozwól nam pomóc Twojemu biznesowi</Badge>
                      <h3 className="text-2xl font-bold mb-4">Tworzymy rozwiązania, które przekraczają oczekiwania klientów</h3>
                      <p className="text-gray-600 mb-2">Nasze podejście łączy strategiczne myślenie, kreatywne projektowanie i technologiczną innowację.</p>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 flex-shrink-0 rounded-full bg-primary/10 flex items-center justify-center">
                          <CheckCircle className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">Ponad 10 lat doświadczenia</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 flex-shrink-0 rounded-full bg-secondary/10 flex items-center justify-center">
                          <CheckCircle className="h-5 w-5 text-secondary" />
                        </div>
                        <div>
                          <p className="font-medium">+120 zadowolonych klientów</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 flex-shrink-0 rounded-full bg-purple-100 flex items-center justify-center">
                          <CheckCircle className="h-5 w-5 text-purple-600" />
                        </div>
                        <div>
                          <p className="font-medium">Podejście oparte na danych</p>
                        </div>
                      </div>
                    </div>
                    
                    <a href="#contact-form" className="inline-block">
                      <Button className="w-full btn-gradient btn-modern">
                        Skontaktuj się z nami
                      </Button>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white">
        <div className="container-tight">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <Badge className="bg-primary/10 text-primary mb-4 py-1 px-3 rounded-full">Nasze zalety</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 tracking-tight">Dlaczego warto z nami współpracować?</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Łączymy kreatywność z technologią, aby dostarczać rozwiązania, które przynoszą realne rezultaty i pomagają Twojemu biznesowi osiągnąć sukces.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card-modern p-8 relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
              <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-6 relative z-10">
                <CheckCircle className="h-7 w-7 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3 relative z-10">Wieloletnie doświadczenie</h3>
              <p className="text-gray-600 relative z-10">
                Ponad 10 lat doświadczenia w branży marketingowej i technologicznej. Zrealizowaliśmy setki projektów dla firm z różnych branż.
              </p>
            </div>

            <div className="card-modern p-8 relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
              <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center mb-6 relative z-10">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-600">
                  <circle cx="12" cy="12" r="10"></circle>
                  <path d="M12 16v-4"></path>
                  <path d="M12 8h.01"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 relative z-10">Indywidualne podejście</h3>
              <p className="text-gray-600 relative z-10">
                Każdy projekt traktujemy indywidualnie, dostosowując nasze usługi do specyficznych potrzeb i celów Twojego biznesu.
              </p>
            </div>

            <div className="card-modern p-8 relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
              <div className="w-14 h-14 bg-secondary/10 rounded-xl flex items-center justify-center mb-6 relative z-10">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-secondary">
                  <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
                  <path d="M2 17l10 5 10-5"></path>
                  <path d="M2 12l10 5 10-5"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 relative z-10">Najnowsze technologie</h3>
              <p className="text-gray-600 relative z-10">
                Wykorzystujemy najnowsze technologie i narzędzia, w tym zaawansowane rozwiązania AI, aby zapewnić najwyższą jakość usług.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-24 bg-background">
        <div className="container-tight">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <Badge className="bg-secondary/10 text-secondary mb-4 py-1 px-3 rounded-full">Nasze usługi</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 tracking-tight">Oferta ECM Digital</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
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
                          Skontaktuj się z nami <ArrowRight className="ml-2 h-4 w-4" />
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
      <section className="py-28 bg-gradient-to-br from-primary to-secondary text-white overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] rounded-full bg-white blur-3xl"></div>
          <div className="absolute bottom-1/3 right-1/4 w-[400px] h-[400px] rounded-full bg-white blur-3xl"></div>
        </div>
        <div className="container-tight relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">Gotowy, aby rozpocząć współpracę?</h2>
            <p className="text-xl opacity-90 mb-10 max-w-2xl mx-auto">
              Skontaktuj się z nami już dziś, aby omówić, jak możemy pomóc Twojemu biznesowi osiągnąć sukces w cyfrowym świecie.
            </p>
            <div className="flex flex-wrap gap-6 justify-center">
              <Link href="/services">
                <Button size="lg" className="btn-modern bg-white text-primary hover:bg-gray-100 shadow-lg">
                  Sprawdź nasze usługi
                </Button>
              </Link>
              <a href="#contact-form">
                <Button variant="outline" size="lg" className="btn-modern border-2 border-white text-white hover:bg-white/10">
                  Napisz do nas
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>
      
      {/* Contact Form Section */}
      <section id="contact-form" className="py-28 bg-background">
        <div className="container-tight">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <Badge className="bg-primary/10 text-primary mb-4 py-1 px-3 rounded-full">Skontaktuj się</Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 tracking-tight">Zamów darmowy audyt UX</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Wypełnij formularz poniżej, a nasz zespół skontaktuje się z Tobą w ciągu 24 godzin, aby pomóc Ci zrealizować Twój projekt
              </p>
            </div>
            
            <div className="card-modern p-8 md:p-10">
              <form className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Imię i nazwisko</Label>
                    <Input id="name" placeholder="Jan Kowalski" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="jan@firma.pl" required />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="service-type">Rodzaj usługi</Label>
                  <Select defaultValue="ux-audit">
                    <SelectTrigger>
                      <SelectValue placeholder="Wybierz usługę" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ux-audit">Audyt UX z AI</SelectItem>
                      <SelectItem value="web-development">Strona internetowa</SelectItem>
                      <SelectItem value="mvp">MVP dla startupu</SelectItem>
                      <SelectItem value="marketing">Kampanie reklamowe</SelectItem>
                      <SelectItem value="other">Inna usługa</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="website">Strona WWW (opcjonalnie)</Label>
                  <Input id="website" placeholder="https://twojafirma.pl" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="message">Wiadomość</Label>
                  <Textarea id="message" placeholder="Opisz swój projekt lub zadaj pytanie..." className="min-h-[120px]" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="file" className="block mb-1">Załącznik (opcjonalnie)</Label>
                  <Input id="file" type="file" className="cursor-pointer" />
                  <p className="text-xs text-gray-500 mt-1">Dodaj brief lub materiały do projektu (max 5MB)</p>
                </div>
                
                <div className="flex items-start">
                  <Checkbox id="privacy-policy" className="mt-1" />
                  <Label htmlFor="privacy-policy" className="ml-2 text-sm">
                    Akceptuję <a href="#" className="text-blue-600 hover:underline">politykę prywatności</a> oraz wyrażam zgodę na przetwarzanie moich danych osobowych w celu odpowiedzi na zapytanie.
                  </Label>
                </div>
                
                <Button className="w-full btn-modern btn-gradient text-lg py-6">
                  Zamów darmowy audyt UX
                </Button>
              </form>
            </div>
            
            <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="card-modern p-6 text-center hover:shadow-xl transition-all duration-300">
                <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-3">Email</h3>
                <p className="text-gray-600">hello@ecm-digital.com</p>
                <a href="mailto:hello@ecm-digital.com" className="inline-block mt-4 text-primary hover:underline">Wyślij email</a>
              </div>
              
              <div className="card-modern p-6 text-center hover:shadow-xl transition-all duration-300">
                <div className="w-14 h-14 bg-secondary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-3">Telefon</h3>
                <p className="text-gray-600">+48 535 330 323</p>
                <a href="tel:+48535330323" className="inline-block mt-4 text-secondary hover:underline">Zadzwoń teraz</a>
              </div>
              
              <div className="card-modern p-6 text-center hover:shadow-xl transition-all duration-300">
                <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-3">Adres</h3>
                <p className="text-gray-600">Warszawa, Polska</p>
                <a href="https://maps.google.com/?q=Warszawa" target="_blank" rel="noopener noreferrer" className="inline-block mt-4 text-green-600 hover:underline">Zobacz na mapie</a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}