import { motion } from "framer-motion";
import { ServiceOrder } from "@/types";
import { Button } from "@/components/ui/button";
import { 
  ClipboardCheck, 
  User, 
  Info,
  CheckCircle2
} from "lucide-react";
import { Link, useLocation } from "wouter";
import i18next from "i18next";
import { useTranslation } from "react-i18next";

interface SummaryProps {
  serviceOrder: ServiceOrder;
  paymentPending?: boolean;
  onProceedToPayment?: () => void;
}

export default function Summary({ serviceOrder, paymentPending = false, onProceedToPayment }: SummaryProps) {
  const { t } = useTranslation();
  const { service, configuration, contactInfo, totalPrice, uploadedFile } = serviceOrder;
  const [, setLocation] = useLocation();

  if (!service) {
    return <div>Nie wybrano usługi</div>;
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        when: "beforeChildren",
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: 'spring', stiffness: 300, damping: 24 }
    }
  };

  const getValueFromId = (optionId: string) => {
    const value = configuration[optionId];
    
    if (service.steps) {
      for (const step of service.steps) {
        if (step.options) {
          for (const option of step.options) {
            if (option.id === optionId) {
              if (option.type === 'select' && option.choices) {
                const choice = option.choices.find(c => c.value === value);
                return choice ? choice.label : value;
              } else if (option.type === 'checkbox') {
                return value ? 'Tak' : 'Nie';
              }
            }
          }
        }
      }
    }
    
    return value;
  };

  const getAdditionalOptions = () => {
    if (!service.steps) return 'Brak';
    
    const checkboxOptions = [];
    
    for (const step of service.steps) {
      if (step.options) {
        for (const option of step.options) {
          if (option.type === 'checkbox' && configuration[option.id]) {
            checkboxOptions.push(option.label);
          }
        }
      }
    }
    
    return checkboxOptions.length > 0 ? checkboxOptions.join(', ') : 'Brak';
  };

  // Get industry and company size labels
  const getIndustryLabel = (value: string) => {
    const industryMap: Record<string, string> = {
      ecommerce: 'E-commerce',
      services: 'Usługi',
      manufacturing: 'Produkcja',
      healthcare: 'Ochrona zdrowia',
      education: 'Edukacja',
      technology: 'Technologia',
      other: 'Inna'
    };
    return industryMap[value] || value;
  };

  const getCompanySizeLabel = (value: string) => {
    const sizeMap: Record<string, string> = {
      solo: 'Jednoosobowa',
      micro: 'Mikro (do 10 pracowników)',
      small: 'Mała (10-50 pracowników)',
      medium: 'Średnia (50-250 pracowników)',
      large: 'Duża (powyżej 250 pracowników)'
    };
    return sizeMap[value] || value;
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="text-center mb-12">
        <motion.div 
          className="inline-flex items-center justify-center w-16 h-16 bg-accent rounded-full mb-4"
          variants={itemVariants}
        >
          <CheckCircle2 className="h-8 w-8 text-white" />
        </motion.div>
        <motion.h2 
          className="text-3xl font-bold text-dark mb-3"
          variants={itemVariants}
        >
          Dziękujemy za zamówienie!
        </motion.h2>
        <motion.p 
          className="text-dark-light max-w-2xl mx-auto"
          variants={itemVariants}
        >
          Twoje zamówienie zostało przyjęte do realizacji. Poniżej znajduje się podsumowanie wybranej usługi oraz danych kontaktowych.
        </motion.p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
        <motion.div 
          className="lg:col-span-2"
          variants={itemVariants}
        >
          <div className="bg-white rounded-xl p-6 shadow-sm mb-8">
            <h3 className="text-xl font-semibold mb-4 flex items-center">
              <ClipboardCheck className="h-5 w-5 text-primary mr-2" />
              Szczegóły zamówienia
            </h3>
            
            <div className="border-b border-gray-200 pb-4 mb-4">
              <div className="flex justify-between mb-2">
                <span className="text-dark-light">Usługa:</span>
                <span className="font-medium text-dark">{service.name}</span>
              </div>
              
              {service.steps?.map((step) => 
                step.options?.map((option) => (
                  <div key={option.id} className="flex justify-between mb-2">
                    <span className="text-dark-light">{option.label}:</span>
                    <span className="font-medium text-dark">
                      {getValueFromId(option.id)}
                    </span>
                  </div>
                ))
              )}
              
              {configuration.websiteUrl && (
                <div className="flex justify-between mb-2">
                  <span className="text-dark-light">Link do strony:</span>
                  <span className="font-medium text-dark">{configuration.websiteUrl}</span>
                </div>
              )}
              
              <div className="flex justify-between mb-2">
                <span className="text-dark-light">Czas realizacji:</span>
                <span className="font-medium text-dark">{serviceOrder.deliveryTime || service.deliveryTime} dni roboczych</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-dark-light">Dodatkowe opcje:</span>
                <span className="font-medium text-dark">{getAdditionalOptions()}</span>
              </div>
              
              {uploadedFile && (
                <div className="flex justify-between mt-2">
                  <span className="text-dark-light">Załącznik:</span>
                  <span className="font-medium text-dark">{uploadedFile.name}</span>
                </div>
              )}
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-dark font-medium">Wartość zamówienia:</span>
              <span className="text-xl font-bold text-dark">
                {totalPrice.toLocaleString()} {i18next.language === 'de' ? '€' : 'PLN'}
              </span>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="text-xl font-semibold mb-4 flex items-center">
              <User className="h-5 w-5 text-primary mr-2" />
              Dane kontaktowe
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-6">
              <div>
                <span className="text-dark-light text-sm block">Firma:</span>
                <span className="font-medium text-dark">{contactInfo.company}</span>
              </div>
              
              <div>
                <span className="text-dark-light text-sm block">Branża:</span>
                <span className="font-medium text-dark">{getIndustryLabel(contactInfo.industry)}</span>
              </div>
              
              <div>
                <span className="text-dark-light text-sm block">Imię i nazwisko:</span>
                <span className="font-medium text-dark">{contactInfo.name}</span>
              </div>
              
              <div>
                <span className="text-dark-light text-sm block">Stanowisko:</span>
                <span className="font-medium text-dark">{contactInfo.position || '-'}</span>
              </div>
              
              <div>
                <span className="text-dark-light text-sm block">Email:</span>
                <span className="font-medium text-dark">{contactInfo.email}</span>
              </div>
              
              <div>
                <span className="text-dark-light text-sm block">Telefon:</span>
                <span className="font-medium text-dark">{contactInfo.phone || '-'}</span>
              </div>
              
              {contactInfo.additionalInfo && (
                <div className="col-span-2">
                  <span className="text-dark-light text-sm block">Dodatkowe informacje:</span>
                  <span className="font-medium text-dark">{contactInfo.additionalInfo}</span>
                </div>
              )}
            </div>
          </div>
        </motion.div>
        
        <motion.div variants={itemVariants}>
          <div className="bg-white rounded-xl p-6 shadow-sm mb-8">
            <h3 className="text-xl font-semibold mb-4 flex items-center">
              <Info className="h-5 w-5 text-primary mr-2" />
              Co dalej?
            </h3>
            
            <ul className="space-y-4">
              <li className="flex">
                <div className="bg-accent/10 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-accent font-medium text-sm">1</span>
                </div>
                <p className="ml-3 text-dark-light">Na podany adres email otrzymasz potwierdzenie zamówienia.</p>
              </li>
              
              <li className="flex">
                <div className="bg-accent/10 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-accent font-medium text-sm">2</span>
                </div>
                <p className="ml-3 text-dark-light">W ciągu 24 godzin skontaktuje się z Tobą nasz specjalista, aby omówić szczegóły zamówienia.</p>
              </li>
              
              <li className="flex">
                <div className="bg-accent/10 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-accent font-medium text-sm">3</span>
                </div>
                <p className="ml-3 text-dark-light">Możesz teraz przejść do płatności online lub poczekać na kontakt z naszej strony.</p>
              </li>
              
              <li className="flex">
                <div className="bg-accent/10 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-accent font-medium text-sm">4</span>
                </div>
                <p className="ml-3 text-dark-light">Po otrzymaniu płatności przystąpimy do realizacji zamówienia.</p>
              </li>
            </ul>
          </div>
          
          <div className="flex flex-col space-y-3">
            <Button 
              onClick={() => setLocation(`/checkout?order_id=${service.id}&price=${totalPrice}`)}
              className="w-full text-center bg-primary hover:bg-primary/90 text-white font-medium rounded-lg py-3 transition-colors"
              disabled={paymentPending}
            >
              {paymentPending ? t('payment.processing') : t('payment.payNow')}
            </Button>
            
            <Link href="/">
              <Button variant="outline" className="w-full text-center border-gray-300 text-gray-700 hover:bg-gray-50 font-medium rounded-lg py-3 transition-colors">
                {t('common.backToHome')}
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
