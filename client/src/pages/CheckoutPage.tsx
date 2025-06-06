import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import i18next from 'i18next';
import { useLocation } from 'wouter';
import { loadStripe } from '@stripe/stripe-js';
import {
  PaymentElement,
  Elements,
  useStripe,
  useElements
} from '@stripe/react-stripe-js';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
// Nie używamy apiRequest, używamy bezpośrednio fetch

// Sprawdzam czy klucz publiczny Stripe jest dostępny
if (!import.meta.env.VITE_STRIPE_PUBLIC_KEY) {
  throw new Error('Missing Stripe public key. Please set VITE_STRIPE_PUBLIC_KEY.');
}

// Inicjalizuję obiekt Stripe poza komponentem, aby uniknąć ponownej inicjalizacji przy każdym renderowaniu
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

// Interfejs dla orderData
interface OrderData {
  amount: number;
  currency: string;
  description: string;
  items: Array<{
    name: string;
    price: number;
  }>;
}

// Interfejs dla paymentIntent
interface PaymentIntentResult {
  id: string;
  status: string;
  client_secret?: string;
  amount: number;
}

// Interfejs dla odpowiedzi z API
interface PaymentIntentResponse {
  clientSecret: string;
  id: string;
}

// Komponent formularza płatności Stripe
const CheckoutForm = ({ 
  orderData, 
  onSuccess 
}: { 
  orderData: OrderData; 
  onSuccess: (paymentIntent: PaymentIntentResult) => void;
}) => {
  const { t } = useTranslation();
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: window.location.origin + '/payment-success',
        },
        redirect: 'if_required'
      });

      if (error) {
        toast({
          title: t('payment.error'),
          description: error.message,
          variant: 'destructive',
        });
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        toast({
          title: t('payment.success'),
          description: t('payment.successDescription'),
        });
        
        // Przekazanie sukcesu do komponentu nadrzędnego
        const result: PaymentIntentResult = {
          id: paymentIntent.id,
          status: paymentIntent.status,
          amount: paymentIntent.amount,
          client_secret: paymentIntent.client_secret || undefined
        };
        
        onSuccess(result);
        
        // Przekierowanie do strony sukcesu z ID transakcji
        setLocation(`/payment-success?payment_id=${paymentIntent.id}`);
      }
    } catch (err) {
      console.error('Payment error:', err);
      toast({
        title: t('payment.error'),
        description: t('payment.generalError'),
        variant: 'destructive',
      });
    }

    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />
      
      <Button 
        type="submit" 
        className="w-full" 
        size="lg"
        disabled={isLoading || !stripe || !elements}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {t('payment.processing')}
          </>
        ) : (
          t('payment.pay')
        )}
      </Button>
    </form>
  );
};

// Główny komponent strony płatności
const CheckoutPage = () => {
  const { t } = useTranslation();
  const [clientSecret, setClientSecret] = useState('');
  const [orderData, setOrderData] = useState<OrderData | null>(null);
  const [paymentStatus, setPaymentStatus] = useState('initial');
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  useEffect(() => {
    // Pobieranie informacji o zamówieniu z parametrów URL
    const params = new URLSearchParams(window.location.search);
    const orderId = params.get('order_id');
    const price = params.get('price');
    
    if (orderId && price) {
      // Przekształcenie danych zamówienia na potrzeby płatności
      const orderData: OrderData = {
        amount: parseFloat(price),
        currency: i18next.language === 'de' ? 'eur' : 'pln',
        description: `ECM Digital - Service ID: ${orderId}`,
        items: [
          { name: `Service ID: ${orderId}`, price: parseFloat(price) }
        ]
      };
      
      setOrderData(orderData);
    } else {
      // W przypadku braku parametrów, używamy domyślnych danych testowych
      const defaultOrderData: OrderData = {
        amount: 299.99,
        currency: 'pln',
        description: 'ECM Digital - Demo Service',
        items: [
          { name: 'Demo Service', price: 299.99 }
        ]
      };
      
      setOrderData(defaultOrderData);
    }
  }, []);

  // Utwórz PaymentIntent w Stripe po ustawieniu orderData
  useEffect(() => {
    if (!orderData) return;
    
    const createPaymentIntent = async () => {
      try {
        // użycie metody fetch bezpośrednio zamiast apiRequest
        const response = await fetch('/api/payments/create-intent', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            amount: orderData?.amount || 0,
            currency: orderData?.currency || 'pln',
            metadata: {
              order_description: orderData?.description || 'Unknown service'
            }
          })
        });
        
        const data: PaymentIntentResponse = await response.json();
        setClientSecret(data.clientSecret);
      } catch (error) {
        console.error('Error creating payment intent:', error);
        toast({
          title: t('payment.intentError'),
          description: t('payment.intentErrorDescription'),
          variant: 'destructive',
        });
      }
    };

    createPaymentIntent();
  }, [orderData, toast, t]);

  const handlePaymentSuccess = (paymentIntent: PaymentIntentResult) => {
    setPaymentStatus('success');
    // Tutaj możesz wykonać dodatkowe operacje po sukcesie
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-center">
            {t('payment.title')}
          </h1>
          
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
            {/* Lewy panel - podsumowanie zamówienia */}
            <div className="md:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>{t('payment.orderSummary')}</CardTitle>
                  <CardDescription>{t('payment.orderSummaryDesc')}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {orderData && (
                    <>
                      <div className="border-b pb-3">
                        <h3 className="font-medium mb-2">{t('payment.items')}</h3>
                        {orderData.items.map((item, index) => (
                          <div key={index} className="flex justify-between text-sm">
                            <span>{item.name}</span>
                            <span>{item.price.toFixed(2)} PLN</span>
                          </div>
                        ))}
                      </div>
                      <div className="flex justify-between font-semibold">
                        <span>{t('payment.total')}</span>
                        <span>{orderData.amount.toFixed(2)} PLN</span>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>
            
            {/* Prawy panel - formularz płatności */}
            <div className="md:col-span-3">
              <Card>
                <CardHeader>
                  <CardTitle>{t('payment.paymentDetails')}</CardTitle>
                  <CardDescription>{t('payment.paymentDetailsDesc')}</CardDescription>
                </CardHeader>
                <CardContent>
                  {!clientSecret ? (
                    <div className="flex justify-center p-8">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                  ) : (
                    <Elements stripe={stripePromise} options={{ clientSecret }}>
                      {orderData && (
                        <CheckoutForm 
                          orderData={orderData} 
                          onSuccess={handlePaymentSuccess} 
                        />
                      )}
                    </Elements>
                  )}
                </CardContent>
                <CardFooter className="flex justify-between text-sm text-muted-foreground">
                  <p>{t('payment.secureInfo')}</p>
                </CardFooter>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CheckoutPage;