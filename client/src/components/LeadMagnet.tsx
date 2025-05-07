import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';

// Style wariantów
const variantStyles = {
  primary: {
    container: 'bg-gradient-to-r from-blue-600 to-violet-500 text-white',
    heading: 'text-white',
    description: 'text-blue-50',
    input: 'bg-white text-gray-800 border-transparent focus:border-blue-300 focus:ring-blue-300',
    button: 'bg-violet-900 hover:bg-violet-800 text-white',
    checkbox: 'border-blue-300 text-blue-700'
  },
  secondary: {
    container: 'bg-white border border-gray-200 shadow-lg',
    heading: 'text-gray-900',
    description: 'text-gray-600',
    input: 'bg-gray-50 border-gray-300 focus:border-blue-500 focus:ring-blue-500',
    button: 'bg-blue-600 hover:bg-blue-700 text-white',
    checkbox: 'border-gray-300 text-blue-600'
  },
  minimal: {
    container: 'bg-gray-50',
    heading: 'text-gray-900',
    description: 'text-gray-600',
    input: 'bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500',
    button: 'bg-blue-600 hover:bg-blue-700 text-white',
    checkbox: 'border-gray-300 text-blue-600'
  }
};

export interface LeadMagnetProps {
  title: string;
  description: string;
  emailPlaceholder?: string;
  buttonText?: string;
  consentText?: string;
  successTitle?: string;
  successMessage?: string;
  redirectUrl?: string;
  variant?: 'primary' | 'secondary' | 'minimal';
  leadType?: 'ebook' | 'newsletter' | 'consultation' | 'webinar';
  ebookFileUrl?: string;
}

const LeadMagnet: React.FC<LeadMagnetProps> = ({
  title,
  description,
  emailPlaceholder,
  buttonText,
  consentText,
  successTitle,
  successMessage,
  redirectUrl,
  variant = 'primary',
  leadType = 'newsletter',
  ebookFileUrl
}) => {
  const { t } = useTranslation();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const styles = variantStyles[variant];

  // Szablon walidacji formularza z Zod
  const formSchema = z.object({
    email: z.string().email(t('validation.invalidEmail', 'Nieprawidłowy adres email')),
    consent: z.boolean().refine(val => val === true, {
      message: t('validation.consentRequired', 'Zgoda jest wymagana')
    })
  });

  // Inicjalizacja formularza
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      consent: false
    },
  });

  // Pobieranie ebooka
  const downloadEbook = () => {
    if (ebookFileUrl) {
      const link = document.createElement('a');
      link.href = ebookFileUrl;
      link.download = ebookFileUrl.split('/').pop() || 'ebook.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  // Obsługa formularza po submit
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    try {
      // Zapisz dane do Twojej bazy
      await apiRequest('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: values.email,
          leadType: leadType,
          source: window.location.pathname,
        }),
      });

      setIsSubmitted(true);
      
      // Jeśli lead magnet to ebook, pobierz go automatycznie
      if (leadType === 'ebook' && ebookFileUrl) {
        setTimeout(() => {
          downloadEbook();
        }, 1000);
      }
      
      // Jeśli podano URL przekierowania, przekieruj po krótkim opóźnieniu
      if (redirectUrl) {
        setTimeout(() => {
          window.location.href = redirectUrl;
        }, 3000);
      }
      
    } catch (error) {
      console.error('Błąd podczas zapisywania leada:', error);
      toast({
        title: t('leadMagnet.error', 'Wystąpił błąd'),
        description: t('leadMagnet.errorMessage', 'Nie udało się zapisać Twojego adresu email. Spróbuj ponownie później.'),
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`rounded-xl overflow-hidden shadow-xl ${styles.container} my-8`}>
      <div className="p-6 md:p-8">
        {!isSubmitted ? (
          <div className="space-y-4">
            <h3 className={`text-2xl font-bold ${styles.heading}`}>{title}</h3>
            <p className={`${styles.description}`}>{description}</p>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={styles.heading}>{t('leadMagnet.emailLabel', 'Adres email')}</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder={emailPlaceholder || t('leadMagnet.emailPlaceholder', 'Twój adres email...')} 
                          className={styles.input} 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="consent"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox 
                          checked={field.value} 
                          onCheckedChange={field.onChange} 
                          className={styles.checkbox}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel className={styles.description}>
                          {consentText || t('leadMagnet.consentText', 'Wyrażam zgodę na otrzymywanie informacji marketingowych zgodnie z polityką prywatności.')}
                        </FormLabel>
                        <FormMessage />
                      </div>
                    </FormItem>
                  )}
                />
                
                <Button 
                  type="submit" 
                  className={`w-full ${styles.button}`}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      {t('leadMagnet.loading', 'Przetwarzanie...')}
                    </span>
                  ) : buttonText || t('leadMagnet.submit', 'Zapisz się')}
                </Button>
              </form>
            </Form>
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center space-y-4"
          >
            <div className="mx-auto h-16 w-16 flex items-center justify-center rounded-full bg-green-100">
              <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className={`text-2xl font-bold ${styles.heading}`}>
              {successTitle || t('leadMagnet.successTitle', 'Dziękujemy za zapis!')}
            </h3>
            <p className={styles.description}>
              {successMessage || t('leadMagnet.successMessage', 'Sprawdź swoją skrzynkę email, aby otrzymać więcej informacji.')}
            </p>
            
            {leadType === 'ebook' && ebookFileUrl && (
              <Button 
                onClick={downloadEbook}
                className={`mt-4 ${styles.button}`}
              >
                {t('leadMagnet.downloadEbook', 'Pobierz e-book')}
              </Button>
            )}
            
            {redirectUrl && (
              <p className={`text-sm ${styles.description} mt-4`}>
                {t('leadMagnet.redirecting', 'Za chwilę nastąpi przekierowanie...')}
              </p>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default LeadMagnet;