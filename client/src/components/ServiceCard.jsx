import React from 'react';
import { Link } from 'wouter';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslation } from 'react-i18next';
import { ArrowRight, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

// Tłumaczenia nazw usług
const serviceTranslations = {
  "pl": {
    // Wszystkie oryginalne nazwy po polsku są takie same
  },
  "de": {
    "Audyt UX": "UX-Audit",
    "Audyt UX z elementami AI": "UX-Audit mit KI",
    "Projektowanie lejków konwersji": "Conversion-Funnel-Design",
    "Miesięczna opieka AI/UX": "Monatliche KI/UX-Betreuung",
    "Strona internetowa": "Webseite",
    "Sklep internetowy": "Online-Shop",
    "Aplikacja webowa": "Web-Anwendung",
    "Kampania Social Media": "Social-Media-Kampagne",
    "Newsletter z insightami": "Insights-Newsletter",
    "AI Chatbot": "KI-Chatbot",
    "Integracja AI": "KI-Integration",
    "Strategia marketingowa": "Marketingstrategie",
    "Automatyzacja Procesów Biznesowych": "Automatisierung von Geschäftsprozessen",
    "Mentoring & Konsultacje": "Mentoring & Beratung"
  },
  "en": {
    "Audyt UX": "UX Audit",
    "Audyt UX z elementami AI": "UX Audit with AI",
    "Projektowanie lejków konwersji": "Conversion Funnel Design",
    "Miesięczna opieka AI/UX": "Monthly AI/UX Care",
    "Strona internetowa": "Website",
    "Sklep internetowy": "Online Store",
    "Aplikacja webowa": "Web Application",
    "Kampania Social Media": "Social Media Campaign",
    "Newsletter z insightami": "Insights Newsletter",
    "AI Chatbot": "AI Chatbot",
    "Integracja AI": "AI Integration",
    "Strategia marketingowa": "Marketing Strategy",
    "Automatyzacja Procesów Biznesowych": "Business Process Automation",
    "Mentoring & Konsultacje": "Mentoring & Consulting"
  }
};

// Tłumaczenia kategorii
const categoryTranslations = {
  "pl": {
    // Wszystkie oryginalne kategorie po polsku są takie same
  },
  "de": {
    "UX/UI": "UX/UI",
    "Web Development": "Web-Entwicklung",
    "Marketing": "Marketing",
    "SEO": "SEO",
    "AI": "KI",
    "Automatyzacja": "Automatisierung",
    "Consulting": "Beratung",
    "Development": "Entwicklung",
    "Inne": "Andere"
  },
  "en": {
    "UX/UI": "UX/UI",
    "Web Development": "Web Development",
    "Marketing": "Marketing",
    "SEO": "SEO",
    "AI": "AI",
    "Automatyzacja": "Automation",
    "Consulting": "Consulting",
    "Development": "Development",
    "Inne": "Other"
  }
};

export default function ServiceCard({ 
  service, 
  colorClass = "text-blue-600", 
  showCategory = true,
  showFeatures = false
}) {
  const { t, i18n } = useTranslation();
  const currentLanguage = localStorage.getItem('app_language') || i18n.language || 'pl';
  
  // Pobierz tłumaczenie nazwy usługi
  const getTranslatedServiceName = () => {
    if (currentLanguage === 'pl') return service.name;
    
    const translations = serviceTranslations[currentLanguage];
    return translations && translations[service.name] ? translations[service.name] : service.name;
  };
  
  // Pobierz tłumaczenie kategorii
  const getTranslatedCategory = () => {
    if (currentLanguage === 'pl') return service.category || 'Inne';
    
    const category = service.category || 'Inne';
    const translations = categoryTranslations[currentLanguage];
    return translations && translations[category] ? translations[category] : category;
  };
  
  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl">
            {getTranslatedServiceName()}
          </CardTitle>
          {showCategory && (
            <Badge variant="outline" className="bg-blue-50">
              {getTranslatedCategory()}
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