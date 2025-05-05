import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link, useRoute, useLocation } from 'wouter';
import { Service } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Clock, Calendar, CheckCircle, Check } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import i18next from 'i18next';
import { serviceTranslations, categoryTranslations } from '@/components/ServiceCard';

// Definiujemy typ dla tablicy tłumaczeń
type I18nArray = string[];

export default function ServiceDetailsPage() {
  const { t } = useTranslation();
  const [match, params] = useRoute('/service/:id');
  const [_, setLocation] = useLocation();
  const serviceId = params?.id;
  const currentLanguage = i18next.language || 'pl';
  
  // Funkcja tłumacząca nazwę usługi
  const getServiceName = (serviceName: string) => {
    if (currentLanguage === 'pl') return serviceName;
    
    const translation = serviceTranslations[serviceName as keyof typeof serviceTranslations];
    return translation ? translation[currentLanguage as keyof typeof translation] || serviceName : serviceName;
  };
  
  // Funkcja tłumacząca kategorię
  const getCategoryName = (category: string) => {
    if (currentLanguage === 'pl') return category;
    
    const translation = categoryTranslations[category as keyof typeof categoryTranslations];
    return translation ? translation[currentLanguage as keyof typeof translation] || category : category;
  };

  const { data: service, isLoading, isError } = useQuery<Service>({ 
    queryKey: [`/api/services/${serviceId}`],
    staleTime: 5000
  });

  const handleBack = () => {
    setLocation('/');
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="h-64 bg-gray-200 rounded mb-6"></div>
          <div className="h-8 bg-gray-200 rounded w-1/2 mb-4"></div>
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
        </div>
      </div>
    );
  }

  if (isError || !service) {
    return (
      <div className="container mx-auto p-8 text-center">
        <h2 className="text-red-500 font-bold text-xl mb-4">{t('services.notFound')}</h2>
        <p className="mb-6">{t('services.notFoundDescription')}</p>
        <Button onClick={handleBack}>{t('buttons.back')}</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 py-10">
      <div className="mb-6">
        <Button variant="ghost" onClick={handleBack} className="flex items-center gap-2">
          <ArrowLeft size={16} /> {t('services.backToList')}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="mb-6">
            <h1 className="text-3xl md:text-4xl font-bold mb-3">
              {getServiceName(service.name)}
            </h1>
            
            <div className="flex flex-wrap gap-2 mb-4">
              <Badge variant="outline" className="bg-blue-50">
                {getCategoryName(service.category || 'Inne')}
              </Badge>
              <Badge variant="outline" className="bg-green-50 flex items-center gap-1">
                <Clock size={14} /> {service.deliveryTime} {t('services.days')}
              </Badge>
            </div>

            {service.shortDescription && (
              <p className="text-lg text-gray-600 mb-4">
                {i18next.language === 'de' && service.id === '1' ? t('services.servicesList.uxAudit.shortDescription') : 
                 i18next.language === 'de' && service.id === '2' ? t('services.servicesList.uxAuditAi.shortDescription') :
                 i18next.language === 'de' && service.id === '24' ? t('services.servicesList.monthlyAiUxCare.shortDescription') :
                 i18next.language === 'de' && service.id === '25' ? t('services.servicesList.insightsNewsletter.shortDescription') :
                 service.shortDescription}
              </p>
            )}

            <div className="text-gray-700 mb-6">
              <p className="mb-4">
                {i18next.language === 'de' && service.id === '1' ? t('services.servicesList.uxAudit.description') : 
                 i18next.language === 'de' && service.id === '2' ? t('services.servicesList.uxAuditAi.description') :
                 i18next.language === 'de' && service.id === '24' ? t('services.servicesList.monthlyAiUxCare.description') :
                 i18next.language === 'de' && service.id === '25' ? t('services.servicesList.insightsNewsletter.description') :
                 service.description}
              </p>
              {service.longDescription && (
                <div className="mt-4">
                  <p>{service.longDescription}</p>
                </div>
              )}
            </div>

            <Separator className="my-6" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {service.benefits && service.benefits.length > 0 && (
                <div>
                  <h3 className="text-xl font-semibold mb-4">{t('services.benefits')}</h3>
                  <ul className="space-y-3">
                    {(() => {
                      // Uzywamy IIFE (Immediately Invoked Function Expression) aby móc użyc zmiennych lokalnych
                      const getBenefits = () => {
                        if (i18next.language === 'de') {
                          if (service.id === '1') {
                            return (t('services.servicesList.uxAudit.benefits', { returnObjects: true }) as string[]);
                          } else if (service.id === '2') {
                            return (t('services.servicesList.uxAuditAi.benefits', { returnObjects: true }) as string[]);
                          } else if (service.id === '24') {
                            return (t('services.servicesList.monthlyAiUxCare.benefits', { returnObjects: true }) as string[]);
                          } else if (service.id === '25') {
                            return (t('services.servicesList.insightsNewsletter.benefits', { returnObjects: true }) as string[]);
                          }
                        }
                        return service.benefits || [];
                      };
                      
                      const benefits = getBenefits();
                      return Array.isArray(benefits) ? benefits.map((benefit, idx) => (
                        <li key={idx} className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                          <span>{benefit}</span>
                        </li>
                      )) : null;
                    })()}
                  </ul>
                </div>
              )}

              {service.features && service.features.length > 0 && (
                <div>
                  <h3 className="text-xl font-semibold mb-4">{t('services.features')}</h3>
                  <ul className="space-y-3">
                    {(() => {
                      // Uzywamy IIFE dla funkcji cech/elementów
                      const getFeatures = () => {
                        if (i18next.language === 'de') {
                          if (service.id === '1') {
                            return (t('services.servicesList.uxAudit.features', { returnObjects: true }) as string[]);
                          } else if (service.id === '2') {
                            return (t('services.servicesList.uxAuditAi.features', { returnObjects: true }) as string[]);
                          } else if (service.id === '24') {
                            return (t('services.servicesList.monthlyAiUxCare.features', { returnObjects: true }) as string[]);
                          } else if (service.id === '25') {
                            return (t('services.servicesList.insightsNewsletter.features', { returnObjects: true }) as string[]);
                          }
                        }
                        return service.features || [];
                      };
                      
                      const features = getFeatures();
                      return Array.isArray(features) ? features.map((feature, idx) => (
                        <li key={idx} className="flex items-start">
                          <Check className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      )) : null;
                    })()}
                  </ul>
                </div>
              )}
            </div>

            {service.scope && service.scope.length > 0 && (
              <div className="mt-6">
                <h3 className="text-xl font-semibold mb-4">{t('services.scope')}</h3>
                <ul className="space-y-3">
                  {(() => {
                      // Uzywamy IIFE dla funkcji zakresu
                      const getScope = () => {
                        if (i18next.language === 'de') {
                          if (service.id === '1') {
                            return (t('services.servicesList.uxAudit.scope', { returnObjects: true }) as string[]);
                          } else if (service.id === '2') {
                            return (t('services.servicesList.uxAuditAi.scope', { returnObjects: true }) as string[]);
                          } else if (service.id === '24') {
                            return (t('services.servicesList.monthlyAiUxCare.scope', { returnObjects: true }) as string[]);
                          } else if (service.id === '25') {
                            return (t('services.servicesList.insightsNewsletter.scope', { returnObjects: true }) as string[]);
                          }
                        }
                        return service.scope || [];
                      };
                      
                      const scope = getScope();
                      return Array.isArray(scope) ? scope.map((item, idx) => (
                        <li key={idx} className="flex items-start">
                          <span className="h-5 w-5 rounded-full bg-purple-100 text-purple-500 flex items-center justify-center mr-2 flex-shrink-0">
                            {idx + 1}
                          </span>
                          <span>{item}</span>
                        </li>
                      )) : null;
                    })()}
                </ul>
              </div>
            )}
          </div>
        </div>

        <div>
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle>{t('services.summary')}</CardTitle>
              <CardDescription>{t('services.priceDetails')}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline mb-6">
                <span className="text-4xl font-bold text-blue-600">{service.basePrice}</span>
                <span className="ml-1 text-gray-600">PLN</span>
              </div>
              
              <div className="flex items-center gap-2 mb-4">
                <Calendar className="h-5 w-5 text-gray-500" />
                <span>{t('services.delivery')}: {service.deliveryTime} {t('services.days')}</span>
              </div>
              
              <p className="text-gray-500 text-sm mb-6">
                {t('services.basePrice')}
              </p>
            </CardContent>
            <CardFooter>
              <Link href={`/configure/${service.id}`} className="w-full">
                <Button className="w-full">{t('services.configure')}</Button>
              </Link>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}