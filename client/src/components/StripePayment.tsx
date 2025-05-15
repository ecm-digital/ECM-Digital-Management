import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";
import { Service } from "@/types";
import { useTranslation } from "react-i18next";
import i18next from "i18next";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

// Ładowanie Stripe poza komponentem dla optymalnej wydajności
if (!import.meta.env.VITE_STRIPE_PUBLIC_KEY) {
  throw new Error('Brakujący klucz Stripe: VITE_STRIPE_PUBLIC_KEY');
}
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

// Komponent formularza płatności
const PaymentForm = ({ 
  totalPrice, 
  onPaymentSuccess, 
  onPaymentError 
}: { 
  totalPrice: number; 
  onPaymentSuccess: () => void; 
  onPaymentError: (error: string) => void;
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const { t } = useTranslation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/payment-success`,
      },
      redirect: 'if_required'
    });

    if (error) {
      onPaymentError(error.message || t('payment.generalError'));
      setIsProcessing(false);
    } else {
      onPaymentSuccess();
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 mt-4">
      <PaymentElement />
      <Button 
        type="submit" 
        className="w-full" 
        disabled={!stripe || isProcessing}
      >
        {isProcessing ? t('payment.processing') : t('payment.pay')}
      </Button>
      <p className="text-center text-xs text-gray-500">
        {t('payment.secureInfo')}
      </p>
    </form>
  );
};

interface StripePaymentProps {
  totalPrice: number;
  service: Service | null;
  onPaymentComplete: () => void;
}

export default function StripePayment({ 
  totalPrice, 
  service, 
  onPaymentComplete 
}: StripePaymentProps) {
  const [clientSecret, setClientSecret] = useState("");
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const { t } = useTranslation();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 }
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

  // Utworzenie intentu płatności przy ładowaniu komponentu
  useEffect(() => {
    const createPaymentIntent = async () => {
      try {
        const response = await fetch("/api/payments/create-intent", { 
          method: "POST",
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            amount: totalPrice,
            metadata: { serviceId: service?.id }
          }),
          credentials: "include"
        });
        
        const data = await response.json();
        
        if (data.clientSecret) {
          setClientSecret(data.clientSecret);
        } else {
          setError(t('payment.intentError'));
          toast({
            title: t('payment.intentError'),
            description: t('payment.intentErrorDescription'),
            variant: "destructive",
          });
        }
      } catch (error) {
        setError(t('payment.intentError'));
        toast({
          title: t('payment.intentError'),
          description: t('payment.intentErrorDescription'),
          variant: "destructive",
        });
      }
    };

    createPaymentIntent();
  }, [totalPrice, service, toast, t]);

  const handlePaymentSuccess = () => {
    toast({
      title: t('payment.success'),
      description: t('payment.successDescription'),
    });
    onPaymentComplete();
  };

  const handlePaymentError = (errorMessage: string) => {
    toast({
      title: t('payment.error'),
      description: errorMessage || t('payment.generalError'),
      variant: "destructive",
    });
  };

  if (!service) {
    return <div>{t('form.error.selectService')}</div>;
  }
  
  if (error) {
    return (
      <div className="p-6 bg-white rounded-xl shadow-sm">
        <h2 className="text-xl font-semibold text-red-600 mb-4">{t('payment.intentError')}</h2>
        <p className="text-dark-light mb-4">{t('payment.intentErrorDescription')}</p>
        <Button onClick={() => window.location.reload()}>
          {t('common.retry')}
        </Button>
      </div>
    );
  }

  if (!clientSecret) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" aria-label="Loading"/>
      </div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="flex justify-between items-start mb-8">
        <div>
          <h2 className="text-3xl font-bold text-dark mb-3">{t('payment.title')}</h2>
          <p className="text-dark-light">{t('payment.subtitle')}</p>
        </div>
        <Card className="shadow-md min-w-[200px]">
          <CardContent className="pt-4">
            <p className="text-sm text-dark-light mb-1">{t('summary.totalPrice')}:</p>
            <p className="text-2xl font-bold text-dark">
              {totalPrice.toLocaleString()} {i18next.language === 'de' ? '€' : 'PLN'}
            </p>
            <p className="text-xs text-dark-light">{service?.name}</p>
          </CardContent>
        </Card>
      </div>

      <motion.div variants={itemVariants} className="bg-white rounded-xl p-8 shadow-sm mb-8">
        <h3 className="text-xl font-semibold mb-6">{t('payment.paymentDetails')}</h3>
        <p className="text-dark-light mb-6">{t('payment.paymentDetailsDesc')}</p>
        
        <Elements stripe={stripePromise} options={{ clientSecret }}>
          <PaymentForm 
            totalPrice={totalPrice} 
            onPaymentSuccess={handlePaymentSuccess}
            onPaymentError={handlePaymentError}
          />
        </Elements>
      </motion.div>
    </motion.div>
  );
}