import React from 'react';
import { Link } from 'wouter';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslation } from 'react-i18next';
import i18next from 'i18next';
import { ArrowRight, Check, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getServiceTranslation, getCategoryTranslation } from './ServiceTranslator';

export default function ServiceCard({ 
  service, 
  colorClass = "text-primary", 
  showCategory = true,
  showFeatures = false
}) {
  const { t } = useTranslation();
  const currentLanguage = i18next.language || 'pl';
  
  console.log("ServiceCard renderowanie, język:", currentLanguage, "nazwa usługi:", service.name, "ID:", service.id);
  
  return (
    <Card className="card-modern overflow-hidden group">
      <div className="overflow-hidden">
        <CardHeader className="pb-3">
          {/* Category badge in Airbnb style */}
          {showCategory && (
            <div className="mb-2">
              <Badge variant="outline" className="bg-accent text-primary border-0 rounded-md text-xs font-medium">
                {getCategoryTranslation(service.category || 'Inne', currentLanguage)}
              </Badge>
            </div>
          )}
          
          {/* Service title in Airbnb style */}
          <CardTitle className="text-lg font-medium tracking-tight">
            {getServiceTranslation(service.name, currentLanguage)}
          </CardTitle>
          
          {/* Short description - Airbnb like subtle description */}
          <CardDescription className="text-gray-600 mt-1 line-clamp-2">
            {service.shortDescription || service.description.substring(0, 100) + (service.description.length > 100 ? '...' : '')}
          </CardDescription>
        </CardHeader>
        
        {/* Rating bar like Airbnb */}
        <div className="px-6 mb-2 flex items-center text-sm">
          <div className="flex items-center text-primary">
            <Star className="h-4 w-4 fill-current" />
            <span className="ml-1 font-medium">4.9</span>
          </div>
          <span className="mx-1 text-gray-400">·</span>
          <span className="text-gray-600">{service.deliveryTime} {t('services.days')}</span>
        </div>
        
        {/* Benefits/Features section - Airbnb like simplicity */}
        <CardContent className="pb-4">
          <div className="space-y-2">
            {service.benefits && service.benefits.length > 0 ? (
              service.benefits.slice(0, 4).map((benefit, idx) => (
                <p key={idx} className="flex items-start text-sm text-gray-700">
                  <Check className="h-4 w-4 text-primary mr-2 mt-0.5 flex-shrink-0" />
                  <span>{benefit}</span>
                </p>
              ))
            ) : (
              service.features && service.features.length > 0 && showFeatures ? (
                service.features.slice(0, 4).map((feature, idx) => (
                  <p key={idx} className="flex items-start text-sm text-gray-700">
                    <Check className="h-4 w-4 text-primary mr-2 mt-0.5 flex-shrink-0" />
                    <span>{feature}</span>
                  </p>
                ))
              ) : (
                Array(4).fill(0).map((_, idx) => (
                  <p key={idx} className="flex items-start text-sm text-gray-700">
                    <Check className="h-4 w-4 text-primary mr-2 mt-0.5 flex-shrink-0" />
                    <span>{t(`benefits.${service.name.replace(/\s+/g, '')}.${idx+1}`, `${t('benefits.default.'+String(idx+1))}`)} </span>
                  </p>
                ))
              )
            )}
          </div>
        </CardContent>
      </div>
      
      {/* Footer with price and action button - Airbnb style */}
      <CardFooter className="border-t border-gray-100 pt-4 flex justify-between items-center">
        <div className="flex items-center">
          <span className={`text-lg font-medium ${colorClass}`}>
            {service.basePrice}
          </span>
          <span className="ml-1 text-gray-600">{currentLanguage === 'de' ? '€' : 'PLN'}</span>
        </div>
        <Link href={`/service/${service.id}`}>
          <Button className="btn-primary rounded-lg">
            {t('buttons.readMore')} <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}