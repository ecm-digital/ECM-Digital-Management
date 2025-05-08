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
import { useTranslation } from 'react-i18next';
import i18next from 'i18next';
import ServiceCard from '../components/ServiceCard.jsx';
import HomeLeadMagnets from '@/components/home/HomeLeadMagnets';

export default function HomePage() {
  const { t, i18n } = useTranslation();
  const { data: services, isLoading } = useQuery<Service[]>({
    queryKey: ['/api/services', i18n.language],
    queryFn: async () => {
      console.log("HomePage: Pobieranie usług dla języka:", i18n.language);
      const response = await fetch(`/api/services?lang=${i18n.language}`);
      const data = await response.json();
      console.log("HomePage: Pobrano usługi:", data.length, "dla języka:", i18n.language);
      return data;
    },
  });

  const filteredServices = services?.filter(service => service.status === 'Aktywna') || [];

  // Definicja głównych kategorii
  const mainCategories = [
    { id: 'ux-design', name: t('services.categories.uxDesign'), icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg> },
    { id: 'web-development', name: t('services.categories.webDevelopment'), icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-600"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg> },
    { id: 'social-marketing', name: t('services.categories.socialMedia'), icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-600"><line x1="12" y1="20" x2="12" y2="10"></line><line x1="18" y1="20" x2="18" y2="4"></line><line x1="6" y1="20" x2="6" y2="16"></line></svg> },
    { id: 'ai-automation', name: t('services.categories.aiIntegration'), icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600"><rect x="3" y="11" width="18" height="10" rx="2" ry="2"></rect><circle cx="12" cy="5" r="2"></circle><path d="M12 7v4"></path><line x1="8" y1="16" x2="8" y2="16"></line><line x1="16" y1="16" x2="16" y2="16"></line></svg> },
    { id: 'startup', name: t('services.categories.startupOffer'), icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-orange-600"><path d="M22 2L11 13"></path><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg> }
  ];

  // Słownik mapowania kategorii z bazy danych na główne kategorie 
  const categoryMapping: Record<string, string> = {
    // Polski
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
  
  // Dodatkowe mapowania dla języka niemieckiego
  if (i18n.language === 'de') {
    Object.assign(categoryMapping, {
      'Web-Entwicklung': 'web-development',
      'KI': 'ai-automation',
      'Automatisierung': 'ai-automation',
      'Beratung': 'startup',
      'Entwicklung': 'startup'
    });
  }

  // Funkcja pomocnicza do mapowania kategorii
  const mapServiceToMainCategory = (service: Service) => {
    const originalCategory = service.category || 'Inne';
    return (originalCategory in categoryMapping) 
      ? categoryMapping[originalCategory as keyof typeof categoryMapping] 
      : 'other';
  };

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
    <div className="flex flex-col min-h-screen bg-background">

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
                  {t('home.subtitle')}
                </Badge>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6 text-balance">
                  <span className="inline heading-gradient">{t('home.title')}</span> <br />
                  {t('home.description')}
                </h1>
                <p className="text-xl text-gray-700 leading-relaxed max-w-xl">
                  {t('home.description')}
                </p>
              </div>
              
              <div className="flex flex-wrap gap-5 pt-4">
                <Link href="/services">
                  <Button className="btn-modern btn-gradient text-white py-6 px-8 text-base">
                    {t('services.viewAllServices')} <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <a href="#contact-form">
                  <Button variant="outline" className="btn-modern border-2 py-6 px-8 text-base">
                    {t('home.ctaButton')}
                  </Button>
                </a>
              </div>
              
              <div className="grid grid-cols-2 gap-4 pt-6">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center mt-0.5">
                    <Check className="h-4 w-4 text-green-600" /> 
                  </div>
                  <div>
                    <p className="font-medium">{t('home.effectiveUX')}</p>
                    <p className="text-sm text-gray-500">{t('home.dataBasedDesign')}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center mt-0.5">
                    <Check className="h-4 w-4 text-blue-600" /> 
                  </div>
                  <div>
                    <p className="font-medium">{t('home.fastDelivery')}</p>
                    <p className="text-sm text-gray-500">{t('home.deadlinesAlwaysMet')}</p>
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
                      <Badge className="bg-blue-100 text-blue-700 mb-3">{t('home.featuredServices')}</Badge>
                      <h3 className="text-2xl font-bold mb-4">{t('services.subtitle')}</h3>
                      <p className="text-gray-600 mb-2">{t('services.title')}</p>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 flex-shrink-0 rounded-full bg-primary/10 flex items-center justify-center">
                          <CheckCircle className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{t('home.yearsOfExperience')}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 flex-shrink-0 rounded-full bg-secondary/10 flex items-center justify-center">
                          <CheckCircle className="h-5 w-5 text-secondary" />
                        </div>
                        <div>
                          <p className="font-medium">{t('home.happyClients')}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 flex-shrink-0 rounded-full bg-purple-100 flex items-center justify-center">
                          <CheckCircle className="h-5 w-5 text-purple-600" />
                        </div>
                        <div>
                          <p className="font-medium">{t('home.dataBasedApproach')}</p>
                        </div>
                      </div>
                    </div>
                    
                    <a href="#contact-form" className="inline-block">
                      <Button className="w-full btn-gradient btn-modern">
                        {t('home.contactUs')}
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
            <Badge className="bg-primary/10 text-primary mb-4 py-1 px-3 rounded-full">{t('home.featuredServices')}</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 tracking-tight">{t('services.subtitle')}</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {t('services.title')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card-modern p-8 relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
              <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-6 relative z-10">
                <CheckCircle className="h-7 w-7 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3 relative z-10">{t('home.longExperience')}</h3>
              <p className="text-gray-600 relative z-10">
                {t('home.longExperienceDescription')}
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
              <h3 className="text-xl font-semibold mb-3 relative z-10">{t('home.individualApproach')}</h3>
              <p className="text-gray-600 relative z-10">
                {t('home.individualApproachDescription')}
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
              <h3 className="text-xl font-semibold mb-3 relative z-10">{t('home.latestTechnologies')}</h3>
              <p className="text-gray-600 relative z-10">
                {t('home.latestTechnologiesDescription')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-24 bg-background">
        <div className="container-tight">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <Badge className="bg-secondary/10 text-secondary mb-4 py-1 px-3 rounded-full">{t('home.featuredServices')}</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 tracking-tight">{t('services.ourOffer')}</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {t('services.offerDescription')}
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
              {/* Wyświetl usługi według głównych kategorii - tak samo jak na stronie Oferta */}
              {groupedServices
                .filter(category => category.services.length > 0)
                .map((category) => (
                <div key={category.id} className="mb-10">
                  <div className="flex items-center mb-6">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                      {category.icon}
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">{category.name}</h2>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {category.services.map((service) => (
                      <ServiceCard key={service.id} service={service} colorClass={
                        category.id === 'ux-design' ? 'text-blue-600' : 
                        category.id === 'web-development' ? 'text-indigo-600' :
                        category.id === 'social-marketing' ? 'text-purple-600' :
                        category.id === 'ai-automation' ? 'text-green-600' : 
                        'text-orange-600'
                      } />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link href="/services">
              <Button className="rounded-full bg-primary/10 text-primary hover:bg-primary/20 py-2 px-8">
                {t('services.viewAllServices')} <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Case Studies Section */}
      <section id="case-studies" className="py-24 bg-white">
        <div className="container-tight">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <Badge className="bg-indigo-100 text-indigo-700 mb-4 py-1 px-3 rounded-full">{t('home.caseStudies')}</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 tracking-tight">{t('home.ourProjects')}</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {t('home.caseStudiesDescription')}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="card-modern p-0 overflow-hidden">
              <div className="h-60 bg-gray-100 relative">
                <div className="absolute inset-0 bg-gradient-to-tr from-primary/30 to-secondary/30 mix-blend-multiply"></div>
                <div className="absolute bottom-4 left-4">
                  <Badge className="bg-white/80 text-primary">{t('home.caseStudyTypes.ecommerce')}</Badge>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">{t('home.caseStudiesItems.example1.title')}</h3>
                <p className="text-gray-500 mb-4 text-sm">{t('home.caseStudiesItems.example1.client')}</p>
                <p className="text-gray-700 mb-6">
                  {t('home.caseStudiesItems.example1.description')}
                </p>
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-sm font-medium text-gray-600">{t('home.result')}: </span>
                    <span className="text-green-600 font-medium">+156% {t('home.conversion')}</span>
                  </div>
                  <Link href="/case-studies/1">
                    <Button variant="ghost" className="text-primary hover:text-primary/80 p-0">
                      {t('home.readMore')} <ArrowRight className="ml-1 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
            
            <div className="card-modern p-0 overflow-hidden">
              <div className="h-60 bg-gray-100 relative">
                <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/30 to-indigo-500/30 mix-blend-multiply"></div>
                <div className="absolute bottom-4 left-4">
                  <Badge className="bg-white/80 text-purple-600">{t('home.caseStudyTypes.webapp')}</Badge>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">{t('home.caseStudiesItems.example2.title')}</h3>
                <p className="text-gray-500 mb-4 text-sm">{t('home.caseStudiesItems.example2.client')}</p>
                <p className="text-gray-700 mb-6">
                  {t('home.caseStudiesItems.example2.description')}
                </p>
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-sm font-medium text-gray-600">{t('home.result')}: </span>
                    <span className="text-green-600 font-medium">+78% {t('home.userEngagement')}</span>
                  </div>
                  <Link href="/case-studies/2">
                    <Button variant="ghost" className="text-primary hover:text-primary/80 p-0">
                      {t('home.readMore')} <ArrowRight className="ml-1 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
          

        </div>
      </section>

      {/* Lead Magnets Section */}
      <HomeLeadMagnets />

      {/* Contact Section */}
      <section id="contact-form" className="py-24 bg-background">
        <div className="container-tight">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div>
                <Badge className="bg-secondary/10 text-secondary mb-4 py-1 px-3 rounded-full">{t('home.contactUs')}</Badge>
                <h2 className="text-3xl md:text-4xl font-bold mb-6 tracking-tight">{t('home.getInTouch')}</h2>
                <p className="text-gray-600 mb-8">
                  {t('home.contactDescription')}
                </p>
                
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-medium text-lg mb-1">{t('contact.phone')}</h3>
                      <p className="text-gray-600">{t('footer.phoneValue')}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-600">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                        <polyline points="22,6 12,13 2,6"></polyline>
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-medium text-lg mb-1">{t('contact.email')}</h3>
                      <p className="text-gray-600">hello@ecm-digital.com</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                        <circle cx="12" cy="10" r="3"></circle>
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-medium text-lg mb-1">{t('contact.address')}</h3>
                      <p className="text-gray-600">{t('footer.addressValue')}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="card-modern p-8">
                <h3 className="text-xl font-bold mb-6">{t('contact.sendMessage')}</h3>
                <form className="space-y-6">
                  <div className="grid grid-cols-1 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">{t('contact.name')}</Label>
                      <Input id="name" placeholder={t('contact.namePlaceholder')} />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">{t('contact.email')}</Label>
                      <Input id="email" type="email" placeholder={t('contact.emailPlaceholder')} />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="service">{t('contact.service')}</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder={t('contact.servicePlaceholder')} />
                        </SelectTrigger>
                        <SelectContent>
                          {filteredServices.map((service) => (
                            <SelectItem key={service.id} value={service.id}>{service.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="message">{t('contact.message')}</Label>
                      <Textarea id="message" placeholder={t('contact.messagePlaceholder')} className="min-h-[120px]" />
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox id="terms" />
                      <label
                        htmlFor="terms"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {t('contact.acceptTerms')}
                      </label>
                    </div>
                  </div>
                  
                  <Button className="w-full btn-gradient btn-modern">{t('contact.send')}</Button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-secondary/5">
        <div className="container-tight">
          <div className="card-modern p-8 md:p-12 bg-white">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold mb-6">{t('cta.title')}</h2>
                <p className="text-gray-600 mb-8">
                  {t('cta.description')}
                </p>
                <Link href="/services">
                  <Button className="btn-gradient btn-modern">{t('cta.button')}</Button>
                </Link>
              </div>
              <div className="relative mx-auto max-w-md">
                <div className="absolute -top-6 -right-6 w-32 h-32 bg-secondary/10 rounded-full blur-xl"></div>
                <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-primary/10 rounded-full blur-xl"></div>
                <div className="relative z-10 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-2xl p-8 border border-white/20">
                  <CheckCircle className="h-12 w-12 text-green-500 mb-6" />
                  <h3 className="text-xl font-bold mb-4">{t('cta.benefitsTitle')}</h3>
                  <ul className="space-y-3">
                    {[1, 2, 3].map((item) => (
                      <li key={item} className="flex items-start gap-3">
                        <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0">
                          <Check className="h-3 w-3 text-green-600" />
                        </div>
                        <span className="text-gray-700">{t(`cta.benefits.${item}`)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}