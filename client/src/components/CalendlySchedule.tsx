import React from 'react';
import { InlineWidget, useCalendlyEventListener } from 'react-calendly';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface CalendlyScheduleProps {
  url?: string;
  className?: string;
  height?: string;
  pageSettings?: {
    backgroundColor?: string;
    hideEventTypeDetails?: boolean;
    hideLandingPageDetails?: boolean;
    primaryColor?: string;
    textColor?: string;
  };
}

export function CalendlySchedule({
  url = 'https://calendly.com/ecm-digital/discovery-call',
  className = '',
  height = '650px',
  pageSettings = {
    backgroundColor: 'ffffff',
    hideEventTypeDetails: false,
    hideLandingPageDetails: false,
    primaryColor: '00a550', // Zielony kolor ECM
    textColor: '333333'
  }
}: CalendlyScheduleProps) {
  const { t } = useTranslation();
  const { toast } = useToast();

  // Nasłuchiwanie na zdarzenia Calendly
  useCalendlyEventListener({
    onEventScheduled: (e) => {
      toast({
        title: t('calendly.eventScheduled', 'Spotkanie zaplanowane!'),
        description: t('calendly.confirmationMessage', 'Szczegóły spotkania zostały wysłane na Twój adres email.'),
        variant: 'default',
      });
    },
  });

  return (
    <div className={`rounded-lg overflow-hidden shadow-lg ${className}`}>
      <InlineWidget
        url={url}
        styles={{ height, width: '100%' }}
        pageSettings={pageSettings}
      />
    </div>
  );
}

// Osobny komponent przycisk popup - rozwiązuje problem z typami
export function CalendlyPopupButton({
  url = 'https://calendly.com/ecm-digital/discovery-call',
  className = '',
  buttonText = 'Umów konsultację'
}: {
  url?: string;
  className?: string;
  buttonText?: string;
}) {
  const { t } = useTranslation();
  
  // Używamy własnego przycisku do otwarcia Calendly w nowym oknie
  const openCalendly = () => {
    window.open(url, '_blank');
  };
  
  return (
    <Button 
      onClick={openCalendly}
      className={`bg-green-600 hover:bg-green-700 text-white ${className}`}
    >
      {t('calendly.scheduleCall', buttonText)}
    </Button>
  );
}