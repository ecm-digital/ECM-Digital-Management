import React from 'react';
import { useTranslation } from 'react-i18next';
import LeadMagnet from '../LeadMagnet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const HomeLeadMagnets: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="py-16 bg-gray-50">
      <div className="container mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-10 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-violet-500">
          {t('leadMagnets.sectionTitle', 'Darmowe materiały i zasoby')}
        </h2>
        
        <p className="text-xl text-center text-gray-600 mb-12 max-w-3xl mx-auto">
          {t('leadMagnets.sectionDescription', 'Skorzystaj z naszych darmowych materiałów, które pomogą Ci rozwinąć Twój biznes online. Zapisz się, aby otrzymać dostęp.')}
        </p>
        
        <Tabs defaultValue="newsletter" className="max-w-4xl mx-auto">
          <TabsList className="grid w-full grid-cols-2 mx-auto mb-8">
            <TabsTrigger value="newsletter">
              {t('leadMagnets.newsletterTab', 'Newsletter UX/AI')}
            </TabsTrigger>
            <TabsTrigger value="ebook">
              {t('leadMagnets.ebookTab', 'Darmowy e-book')}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="newsletter">
            <LeadMagnet 
              title={t('leadMagnets.newsletter.title', 'Dołącz do newslettera UX/AI Insights')}
              description={t('leadMagnets.newsletter.description', 'Co tydzień wysyłamy krótki newsletter z najciekawszymi trendami UX i AI, które pomagają firmom osiągać lepsze rezultaty. Dołącz do ponad 1500 specjalistów, którzy czytają nasz newsletter!')}
              emailPlaceholder={t('leadMagnets.newsletter.emailPlaceholder', 'Twój adres email...')}
              buttonText={t('leadMagnets.newsletter.buttonText', 'Zapisz się do newslettera')}
              consentText={t('leadMagnets.newsletter.consentText', 'Wyrażam zgodę na otrzymywanie newslettera UX/AI Insights oraz akceptuję politykę prywatności.')}
              successTitle={t('leadMagnets.newsletter.successTitle', 'Dziękujemy za zapisanie się!')}
              successMessage={t('leadMagnets.newsletter.successMessage', 'Sprawdź swoją skrzynkę email, aby potwierdzić zapis do newslettera. Następny newsletter wyślemy w najbliższy wtorek.')}
              variant="primary"
              leadType="newsletter"
            />
          </TabsContent>
          
          <TabsContent value="ebook">
            <LeadMagnet 
              title={t('leadMagnets.ebook.title', 'Pobierz darmowy e-book "UX + AI: Przewodnik 2025"')}
              description={t('leadMagnets.ebook.description', 'W naszym najnowszym e-booku znajdziesz przegląd 10 najskuteczniejszych strategii łączenia UX z narzędziami AI, które zwiększają konwersję i zadowolenie użytkowników. Materiał zawiera praktyczne wskazówki i przykłady wdrożeń.')}
              emailPlaceholder={t('leadMagnets.ebook.emailPlaceholder', 'Gdzie wysłać e-book?')}
              buttonText={t('leadMagnets.ebook.buttonText', 'Pobierz e-book za darmo')}
              consentText={t('leadMagnets.ebook.consentText', 'Wyrażam zgodę na otrzymanie e-booka oraz powiązanych materiałów marketingowych.')}
              successTitle={t('leadMagnets.ebook.successTitle', 'E-book wysłany!')}
              successMessage={t('leadMagnets.ebook.successMessage', 'Twój e-book jest gotowy do pobrania. Sprawdź również swoją skrzynkę email, wysłaliśmy tam kopię pliku.')}
              variant="secondary"
              leadType="ebook"
              ebookFileUrl="/ebooks/ux-ai-przewodnik-2025.pdf"
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default HomeLeadMagnets;