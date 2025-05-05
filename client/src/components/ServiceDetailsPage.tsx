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

export default function ServiceDetailsPage() {
  const { t } = useTranslation();
  const [match, params] = useRoute('/service/:id');
  const [_, setLocation] = useLocation();
  const serviceId = params?.id;

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
            <h1 className="text-3xl md:text-4xl font-bold mb-3">{service.name}</h1>
            
            <div className="flex flex-wrap gap-2 mb-4">
              <Badge variant="outline" className="bg-blue-50">
                {service.category || 'Inne'}
              </Badge>
              <Badge variant="outline" className="bg-green-50 flex items-center gap-1">
                <Clock size={14} /> {service.deliveryTime} {t('services.days')}
              </Badge>
            </div>

            {service.shortDescription && (
              <p className="text-lg text-gray-600 mb-4">
                {service.shortDescription}
              </p>
            )}

            <div className="text-gray-700 mb-6">
              <p className="mb-4">{service.description}</p>
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
                    {service.benefits.map((benefit, idx) => (
                      <li key={idx} className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {service.features && service.features.length > 0 && (
                <div>
                  <h3 className="text-xl font-semibold mb-4">{t('services.features')}</h3>
                  <ul className="space-y-3">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start">
                        <Check className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {service.scope && service.scope.length > 0 && (
              <div className="mt-6">
                <h3 className="text-xl font-semibold mb-4">{t('services.scope')}</h3>
                <ul className="space-y-3">
                  {service.scope.map((item, idx) => (
                    <li key={idx} className="flex items-start">
                      <span className="h-5 w-5 rounded-full bg-purple-100 text-purple-500 flex items-center justify-center mr-2 flex-shrink-0">
                        {idx + 1}
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
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