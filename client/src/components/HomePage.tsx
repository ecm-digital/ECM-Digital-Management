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

      {/* Hero Section - Airbnb-inspired with green accents */}
      <section className="py-20 md:py-28 overflow-hidden relative">
        {/* Subtle background with green gradient shapes */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-1/4 -right-1/4 w-[600px] h-[600px] rounded-full bg-primary/5 blur-3xl"></div>
          <div className="absolute top-1/2 left-1/4 w-[400px] h-[400px] rounded-full bg-accent/10 blur-3xl"></div>
          <div className="absolute bottom-1/3 right-1/3 w-[300px] h-[300px] rounded-full bg-secondary/5 blur-3xl"></div>
        </div>
        
        <div className="container-tight relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            {/* Left column - Main content */}
            <div className="space-y-6">
              <div>
                {/* Airbnb-style subtitle badge */}
                <Badge className="bg-accent text-primary mb-5 py-1.5 px-4 rounded-md text-sm font-medium">
                  {t('home.subtitle')}
                </Badge>
                
                {/* Main heading with Airbnb-inspired styling */}
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight mb-4 text-balance leading-tight">
                  <span className="text-primary">{t('home.title')}</span> <br />
                  {t('home.description')}
                </h1>
                
                <p className="text-lg text-gray-600 leading-relaxed max-w-xl">
                  {t('home.description')}
                </p>
              </div>
              
              {/* CTA buttons in Airbnb style */}
              <div className="flex flex-wrap gap-4 pt-4">
                <Link href="/services">
                  <Button className="btn-primary rounded-lg py-3 px-6 text-base">
                    {t('services.viewAllServices')} <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <a href="#contact-form">
                  <Button variant="outline" className="btn-secondary rounded-lg py-3 px-6 text-base">
                    {t('home.ctaButton')}
                  </Button>
                </a>
              </div>
              
              {/* Feature highlights in Airbnb style */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center mt-0.5">
                    <Check className="h-5 w-5 text-primary" /> 
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">{t('home.effectiveUX')}</p>
                    <p className="text-sm text-gray-600">{t('home.dataBasedDesign')}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center mt-0.5">
                    <Check className="h-5 w-5 text-primary" /> 
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">{t('home.fastDelivery')}</p>
                    <p className="text-sm text-gray-600">{t('home.deadlinesAlwaysMet')}</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Right column - Featured services card in Airbnb style */}
            <div className="relative mt-10 lg:mt-0">
              {/* Subtle glow */}
              <div className="absolute -top-20 -right-20 w-96 h-96 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-full blur-3xl"></div>
              
              {/* Card in Airbnb style */}
              <div className="relative z-10 rounded-xl overflow-hidden bg-white border border-gray-100 shadow-lg">
                <div className="p-6 sm:p-8 relative">
                  <div className="grid gap-6">
                    <div>
                      <Badge className="bg-accent text-primary border-0 mb-3 rounded-md">{t('home.featuredServices')}</Badge>
                      <h3 className="text-xl font-semibold mb-2">{t('services.subtitle')}</h3>
                      <p className="text-gray-600 mb-4">{t('services.title')}</p>
                    </div>
                    
                    {/* Features with Airbnb-style icons */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 flex-shrink-0 rounded-lg bg-accent flex items-center justify-center">
                          <CheckCircle className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">{t('home.yearsOfExperience')}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 flex-shrink-0 rounded-lg bg-accent flex items-center justify-center">
                          <CheckCircle className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">{t('home.happyClients')}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 flex-shrink-0 rounded-lg bg-accent flex items-center justify-center">
                          <CheckCircle className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">{t('home.dataBasedApproach')}</p>
                        </div>
                      </div>
                    </div>
                    
                    {/* CTA button */}
                    <a href="#contact-form" className="inline-block pt-2">
                      <Button className="w-full btn-primary rounded-lg">
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

      {/* Features Section - Airbnb style */}
      <section className="py-20 md:py-24 bg-white">
        <div className="container-tight">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <Badge className="bg-accent text-primary mb-4 py-1 px-3 rounded-md text-sm">{t('home.featuredServices')}</Badge>
            <h2 className="text-2xl md:text-3xl font-semibold mb-4 tracking-tight">{t('services.subtitle')}</h2>
            <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto">
              {t('services.title')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {/* Feature Card 1 - Airbnb style */}
            <div className="feature-card relative group">
              <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center mb-5">
                <CheckCircle className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-medium mb-3">{t('home.longExperience')}</h3>
              <p className="text-gray-600 text-sm md:text-base">
                {t('home.longExperienceDescription')}
              </p>
            </div>

            {/* Feature Card 2 - Airbnb style */}
            <div className="feature-card relative group">
              <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center mb-5">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                  <circle cx="12" cy="12" r="10"></circle>
                  <path d="M12 16v-4"></path>
                  <path d="M12 8h.01"></path>
                </svg>
              </div>
              <h3 className="text-lg font-medium mb-3">{t('home.individualApproach')}</h3>
              <p className="text-gray-600 text-sm md:text-base">
                {t('home.individualApproachDescription')}
              </p>
            </div>

            {/* Feature Card 3 - Airbnb style */}
            <div className="feature-card relative group">
              <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center mb-5">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                  <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
                  <path d="M2 17l10 5 10-5"></path>
                  <path d="M2 12l10 5 10-5"></path>
                </svg>
              </div>
              <h3 className="text-lg font-medium mb-3">{t('home.latestTechnologies')}</h3>
              <p className="text-gray-600 text-sm md:text-base">
                {t('home.latestTechnologiesDescription')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section - Airbnb style */}
      <section id="services" className="py-20 md:py-24 bg-background">
        <div className="container-tight">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <Badge className="bg-accent text-primary mb-4 py-1 px-3 rounded-md text-sm">{t('home.featuredServices')}</Badge>
            <h2 className="text-2xl md:text-3xl font-semibold mb-4 tracking-tight">{t('services.ourOffer')}</h2>
            <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto">
              {t('services.offerDescription')}
            </p>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="animate-pulse bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                  <div className="h-5 bg-gray-200 rounded-md w-1/4 mb-3"></div>
                  <div className="h-6 bg-gray-200 rounded-md w-3/4 mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded-md w-5/6 mb-5"></div>
                  <div className="space-y-2">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="flex items-center">
                        <div className="h-4 w-4 bg-gray-200 rounded-full mr-2"></div>
                        <div className="h-4 bg-gray-200 rounded-md w-11/12"></div>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between items-center mt-6">
                    <div className="h-5 bg-gray-200 rounded-md w-1/4"></div>
                    <div className="h-8 bg-gray-200 rounded-md w-1/3"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-12">
              {/* Services by category - Airbnb style */}
              {groupedServices
                .filter(category => category.services.length > 0)
                .map((category) => (
                <div key={category.id} className="mb-8">
                  <div className="flex items-center mb-6">
                    <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center mr-3">
                      {React.cloneElement(category.icon, { className: 'text-primary' })}
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900">{category.name}</h2>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {category.services.map((service) => (
                      <ServiceCard 
                        key={service.id} 
                        service={service} 
                        colorClass="text-primary"
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link href="/services">
              <Button className="btn-primary rounded-lg py-2 px-6">
                {t('services.viewAllServices')} <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Case Studies Section - Airbnb style */}
      <section id="case-studies" className="py-20 md:py-24 bg-white">
        <div className="container-tight">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <Badge className="bg-accent text-primary mb-4 py-1 px-3 rounded-md text-sm">{t('home.caseStudies')}</Badge>
            <h2 className="text-2xl md:text-3xl font-semibold mb-4 tracking-tight">{t('home.ourProjects')}</h2>
            <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto">
              {t('home.caseStudiesDescription')}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {/* Case Study Card 1 - Airbnb style */}
            <div className="bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="h-56 bg-gray-100 relative">
                <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-accent/20 mix-blend-multiply"></div>
                <div className="absolute bottom-4 left-4">
                  <Badge className="bg-white text-primary rounded-md px-3 py-1">{t('home.caseStudyTypes.ecommerce')}</Badge>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">{t('home.caseStudiesItems.example1.title')}</h3>
                <p className="text-gray-500 mb-3 text-sm">{t('home.caseStudiesItems.example1.client')}</p>
                <p className="text-gray-600 mb-5 text-sm md:text-base">
                  {t('home.caseStudiesItems.example1.description')}
                </p>
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-sm font-medium text-gray-600">{t('home.result')}: </span>
                    <span className="text-primary font-medium">+156% {t('home.conversion')}</span>
                  </div>
                  <Link href="/case-studies/1">
                    <Button variant="ghost" className="text-primary hover:text-primary/80 p-0">
                      {t('home.readMore')} <ArrowRight className="ml-1 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
            
            {/* Case Study Card 2 - Airbnb style */}
            <div className="bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="h-56 bg-gray-100 relative">
                <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-accent/30 mix-blend-multiply"></div>
                <div className="absolute bottom-4 left-4">
                  <Badge className="bg-white text-primary rounded-md px-3 py-1">{t('home.caseStudyTypes.webapp')}</Badge>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">{t('home.caseStudiesItems.example2.title')}</h3>
                <p className="text-gray-500 mb-3 text-sm">{t('home.caseStudiesItems.example2.client')}</p>
                <p className="text-gray-600 mb-5 text-sm md:text-base">
                  {t('home.caseStudiesItems.example2.description')}
                </p>
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-sm font-medium text-gray-600">{t('home.result')}: </span>
                    <span className="text-primary font-medium">+78% {t('home.userEngagement')}</span>
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

      {/* Contact Section - Airbnb style */}
      <section id="contact-form" className="py-20 md:py-24 bg-background">
        <div className="container-tight">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
              {/* Left Column - Contact Info */}
              <div>
                <Badge className="bg-accent text-primary mb-4 py-1 px-3 rounded-md text-sm">{t('home.contactUs')}</Badge>
                <h2 className="text-2xl md:text-3xl font-semibold mb-4 tracking-tight">{t('home.getInTouch')}</h2>
                <p className="text-gray-600 mb-8 text-base md:text-lg">
                  {t('home.contactDescription')}
                </p>
                
                <div className="space-y-6">
                  {/* Phone Contact */}
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-medium text-lg mb-1">{t('contact.phone')}</h3>
                      <p className="text-gray-600">{t('footer.phoneValue')}</p>
                    </div>
                  </div>
                  
                  {/* Email Contact */}
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                        <polyline points="22,6 12,13 2,6"></polyline>
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-medium text-lg mb-1">{t('contact.email')}</h3>
                      <p className="text-gray-600">hello@ecm-digital.com</p>
                    </div>
                  </div>
                  
                  {/* Address Contact */}
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
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
              
              {/* Right Column - Contact Form - Airbnb style */}
              <div className="bg-white p-6 md:p-8 rounded-xl border border-gray-100 shadow-sm">
                <h3 className="text-xl font-semibold mb-6">{t('contact.sendMessage')}</h3>
                <form className="space-y-6">
                  <div className="grid grid-cols-1 gap-5">
                    {/* Name Field */}
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-gray-700 font-medium">{t('contact.name')}</Label>
                      <Input 
                        id="name" 
                        placeholder={t('contact.namePlaceholder')} 
                        className="border-gray-300 rounded-lg"
                      />
                    </div>
                    
                    {/* Email Field */}
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-gray-700 font-medium">{t('contact.email')}</Label>
                      <Input 
                        id="email" 
                        type="email" 
                        placeholder={t('contact.emailPlaceholder')} 
                        className="border-gray-300 rounded-lg"
                      />
                    </div>
                    
                    {/* Service Selection */}
                    <div className="space-y-2">
                      <Label htmlFor="service" className="text-gray-700 font-medium">{t('contact.service')}</Label>
                      <Select>
                        <SelectTrigger className="border-gray-300 rounded-lg">
                          <SelectValue placeholder={t('contact.servicePlaceholder')} />
                        </SelectTrigger>
                        <SelectContent>
                          {filteredServices.map((service) => (
                            <SelectItem key={service.id} value={service.id}>{service.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    {/* Message Field */}
                    <div className="space-y-2">
                      <Label htmlFor="message" className="text-gray-700 font-medium">{t('contact.message')}</Label>
                      <Textarea 
                        id="message" 
                        placeholder={t('contact.messagePlaceholder')} 
                        className="border-gray-300 rounded-lg min-h-[120px]"
                      />
                    </div>
                  </div>
                  
                  {/* Privacy Policy Checkbox */}
                  <div className="flex space-x-3 items-start">
                    <Checkbox id="terms" className="mt-1" />
                    <label
                      htmlFor="terms"
                      className="text-sm text-gray-600 font-normal"
                    >
                      {t('contact.acceptTerms')}
                    </label>
                  </div>
                  
                  {/* Submit Button - Airbnb style */}
                  <Button type="submit" className="w-full btn-primary rounded-lg py-3">
                    {t('contact.send')}
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - Airbnb style */}
      <section className="py-16 md:py-20 bg-accent/10">
        <div className="container-tight">
          <div className="bg-white p-6 md:p-10 rounded-xl border border-gray-100 shadow-sm">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              {/* Left column - Text and CTA button */}
              <div>
                <h2 className="text-2xl md:text-3xl font-semibold mb-4 tracking-tight">{t('cta.title')}</h2>
                <p className="text-gray-600 mb-8 text-base md:text-lg">
                  {t('cta.description')}
                </p>
                <Link href="/services">
                  <Button className="btn-primary rounded-lg py-3 px-6 text-base">
                    {t('cta.button')}
                  </Button>
                </Link>
              </div>
              
              {/* Right column - Benefits card */}
              <div className="relative mx-auto max-w-md">
                {/* Subtle background effects */}
                <div className="absolute -top-4 -right-4 w-28 h-28 bg-accent/30 rounded-full blur-xl"></div>
                <div className="absolute -bottom-4 -left-4 w-28 h-28 bg-primary/10 rounded-full blur-xl"></div>
                
                {/* Benefits card */}
                <div className="relative z-10 bg-white rounded-xl p-6 md:p-8 border border-gray-100 shadow-sm">
                  <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center mb-6">
                    <CheckCircle className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-4">{t('cta.benefitsTitle')}</h3>
                  <ul className="space-y-4">
                    {[1, 2, 3].map((item) => (
                      <li key={item} className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-accent rounded-lg flex items-center justify-center mt-0.5 flex-shrink-0">
                          <Check className="h-4 w-4 text-primary" />
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