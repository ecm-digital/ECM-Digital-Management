import React from 'react';
import { Link } from 'wouter';
import { useTranslation } from 'react-i18next';
import i18next from 'i18next';
import { Service } from '@/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

// Przechowujemy tłumaczenia nazw usług i kategorii
const serviceTranslations = {
  // UX/UI kategoria
  "Audyt UX": {
    de: "UX-Audit",
    en: "UX Audit"
  },
  "Audyt UX z elementami AI": {
    de: "UX-Audit mit KI",
    en: "UX Audit with AI"
  },
  "Projektowanie lejków konwersji": {
    de: "Conversion-Funnel-Design",
    en: "Conversion Funnel Design"
  },
  "Miesięczna opieka AI/UX": {
    de: "Monatliche KI/UX-Betreuung",
    en: "Monthly AI/UX Care"
  },
  // Web Development kategoria
  "Strona internetowa": {
    de: "Webseite",
    en: "Website"
  },
  "Sklep internetowy": {
    de: "Online-Shop",
    en: "Online Store"
  },
  "Aplikacja webowa": {
    de: "Web-Anwendung",
    en: "Web Application"
  },
  // Marketing kategoria
  "Kampania Social Media": {
    de: "Social-Media-Kampagne",
    en: "Social Media Campaign"
  },
  "Newsletter z insightami": {
    de: "Insights-Newsletter",
    en: "Insights Newsletter"
  },
  // AI kategoria
  "AI Chatbot": {
    de: "KI-Chatbot",
    en: "AI Chatbot"
  },
  "Integracja AI": {
    de: "KI-Integration",
    en: "AI Integration"
  },
  // Inne
  "Strategia marketingowa": {
    de: "Marketingstrategie",
    en: "Marketing Strategy"
  },
  "Automatyzacja Procesów Biznesowych": {
    de: "Automatisierung von Geschäftsprozessen",
    en: "Business Process Automation"
  },
  "Mentoring & Konsultacje": {
    de: "Mentoring & Beratung",
    en: "Mentoring & Consulting"
  }
};

// Tłumaczenia kategorii
const categoryTranslations = {
  "UX/UI": {
    de: "UX/UI",
    en: "UX/UI"
  },
  "Web Development": {
    de: "Web-Entwicklung",
    en: "Web Development"
  },
  "Marketing": {
    de: "Marketing",
    en: "Marketing"
  },
  "SEO": {
    de: "SEO",
    en: "SEO"
  },
  "AI": {
    de: "KI",
    en: "AI"
  },
  "Automatyzacja": {
    de: "Automatisierung",
    en: "Automation"
  },
  "Consulting": {
    de: "Beratung",
    en: "Consulting"
  },
  "Development": {
    de: "Entwicklung",
    en: "Development"
  },
  "Inne": {
    de: "Andere",
    en: "Other"
  }
};

interface ServiceCardProps {
  service: Service;
  colorClass?: string;
  showCategory?: boolean;
  showFeatures?: boolean;
}

export default function ServiceCard({ 
  service, 
  colorClass = "text-blue-600", 
  showCategory = true,
  showFeatures = false
}: ServiceCardProps) {
  const { t } = useTranslation();
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

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl">{getServiceName(service.name)}</CardTitle>
          {showCategory && (
            <Badge variant="outline" className="bg-blue-50">
              {getCategoryName(service.category || 'Inne')}
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