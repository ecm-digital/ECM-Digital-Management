import React from 'react';
import { Link } from 'wouter';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslation } from 'react-i18next';
import { ArrowRight, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getServiceTranslation, getCategoryTranslation, getCurrentLanguage } from './ServiceTranslator';

export default function ServiceCard({ 
  service, 
  colorClass = "text-blue-600", 
  showCategory = true,
  showFeatures = false
}) {
  const { t, i18n } = useTranslation();
  const currentLanguage = getCurrentLanguage();
  
  console.log("ServiceCard renderowanie, język:", currentLanguage, "nazwa usługi:", service.name, "ID:", service.id);
  
  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl">
            {getServiceTranslation(service.name, currentLanguage)}
          </CardTitle>
          {showCategory && (
            <Badge variant="outline" className="bg-blue-50">
              {getCategoryTranslation(service.category || 'Inne', currentLanguage)}
            </Badge>
          )}
        </div>
        <CardDescription>
          {service.shortDescription || service.description.substring(0, 100) + (service.description.length > 100 ? '...' : '')}
        </CardDescription>
      </CardHeader>
      
      {showFeatures && service.features && service.features.length > 0 && (
        <CardContent className="pb-4">
          <div className="space-y-1">
            {service.features.slice(0, 3).map((feature, idx) => (
              <p key={idx} className="flex items-start text-sm text-gray-600">
                <Check className="h-4 w-4 text-green-500 mr-1 mt-0.5 flex-shrink-0" />
                <span>{feature}</span>
              </p>
            ))}
            {service.features.length > 3 && (
              <p className="text-sm text-gray-600 italic">i więcej...</p>
            )}
          </div>
        </CardContent>
      )}
      
      <CardFooter className="pt-0 flex justify-between items-center">
        <div className={`text-lg font-semibold ${colorClass}`}>
          {service.basePrice} PLN
        </div>
        <Link href={`/service/${service.id}`}>
          <Button variant="outline" size="sm">
            {t('buttons.readMore')} <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}