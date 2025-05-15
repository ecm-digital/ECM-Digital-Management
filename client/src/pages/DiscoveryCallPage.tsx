import React from 'react';
import { useTranslation } from 'react-i18next';
import { CalendlySchedule } from '@/components/CalendlySchedule';
import { motion } from 'framer-motion';

export default function DiscoveryCallPage() {
  const { t } = useTranslation();

  return (
    <div className="container mx-auto px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-5xl mx-auto"
      >
        <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">
          {t('discoveryCall.title', 'Umów bezpłatną konsultację')}
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col justify-center"
          >
            <h2 className="text-2xl font-semibold mb-4 text-gray-700">
              {t('discoveryCall.subtitle', 'Czym jest Discovery Call?')}
            </h2>
            
            <p className="text-gray-600 mb-4">
              {t('discoveryCall.description', 
                'Discovery Call to bezpłatna, 30-minutowa konsultacja, podczas której poznamy ' + 
                'Twoje potrzeby, cele biznesowe i wyzwania, z którymi się mierzysz. ' + 
                'To pierwszy krok do opracowania skutecznego rozwiązania dla Twojej firmy.'
              )}
            </p>
            
            <div className="space-y-4">
              <BenefitItem 
                text={t('discoveryCall.benefit1', 'Indywidualne podejście i zrozumienie Twoich unikalnych potrzeb')} 
              />
              <BenefitItem 
                text={t('discoveryCall.benefit2', 'Wstępne sugestie dotyczące strategii i rozwiązań')} 
              />
              <BenefitItem 
                text={t('discoveryCall.benefit3', 'Możliwość zadawania pytań ekspertom ECM Digital')} 
              />
              <BenefitItem 
                text={t('discoveryCall.benefit4', 'Brak jakichkolwiek zobowiązań - spotkanie jest całkowicie bezpłatne')} 
              />
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-white rounded-2xl shadow-xl overflow-hidden"
          >
            <div className="p-6 bg-green-600 text-white">
              <h3 className="text-xl font-semibold mb-2">
                {t('discoveryCall.scheduleTitle', 'Wybierz dogodny termin')}
              </h3>
              <p>
                {t('discoveryCall.scheduleDescription', 
                  'Zarezerwuj 30 minut, które mogą odmienić Twój biznes. ' +
                  'Wybierz dogodny termin z poniższego kalendarza.'
                )}
              </p>
            </div>
            <div className="p-2">
              <CalendlySchedule 
                url="https://calendly.com/ecm-digital/discovery-call" 
                height="600px"
              />
            </div>
          </motion.div>
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="bg-gray-50 rounded-2xl p-8 shadow-md"
        >
          <h3 className="text-2xl font-semibold mb-4 text-center text-gray-700">
            {t('discoveryCall.howItWorks', 'Jak przebiega Discovery Call?')}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-6">
            <StepCard
              number="1"
              title={t('discoveryCall.step1Title', 'Rezerwacja')}
              description={t('discoveryCall.step1Description', 'Wybierz dogodny termin i godzinę w naszym kalendarzu')}
            />
            <StepCard
              number="2"
              title={t('discoveryCall.step2Title', 'Rozmowa')}
              description={t('discoveryCall.step2Description', 'Porozmawiamy o Twoich potrzebach i wyzwaniach biznesowych')}
            />
            <StepCard
              number="3"
              title={t('discoveryCall.step3Title', 'Rekomendacje')}
              description={t('discoveryCall.step3Description', 'Otrzymasz wstępne sugestie i następne kroki do realizacji')}
            />
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

// Komponent dla elementu listy korzyści
const BenefitItem = ({ text }: { text: string }) => (
  <div className="flex items-start">
    <div className="flex-shrink-0">
      <svg className="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
      </svg>
    </div>
    <p className="ml-3 text-gray-600">{text}</p>
  </div>
);

// Komponent dla karty kroku
const StepCard = ({ number, title, description }: { number: string; title: string; description: string }) => (
  <div className="bg-white p-6 rounded-xl shadow-md text-center">
    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-600 text-white text-xl font-bold mb-4">
      {number}
    </div>
    <h4 className="text-xl font-semibold mb-2 text-gray-700">{title}</h4>
    <p className="text-gray-600">{description}</p>
  </div>
);