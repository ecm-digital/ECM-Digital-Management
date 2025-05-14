import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'wouter';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const PaymentSuccessPage = () => {
  const { t } = useTranslation();
  const [, navigate] = useLocation();
  const [searchParams] = useState(() => new URLSearchParams(window.location.search));
  const [paymentId, setPaymentId] = useState<string | null>(null);

  useEffect(() => {
    // Pobierz payment_id z parametrów URL
    const paymentIdFromUrl = searchParams.get('payment_id');
    if (paymentIdFromUrl) {
      setPaymentId(paymentIdFromUrl);
    }
  }, [searchParams]);

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto">
          <motion.div 
            className="text-center mb-8"
            initial="hidden"
            animate="visible"
            variants={fadeIn}
          >
            <div className="inline-flex justify-center items-center w-20 h-20 bg-green-100 rounded-full mb-6">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold mb-3">
              {t('paymentSuccess.title')}
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              {t('paymentSuccess.subtitle')}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>{t('paymentSuccess.orderCompleted')}</CardTitle>
                <CardDescription>{t('paymentSuccess.orderDetails')}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border-b pb-3">
                  <p className="text-sm text-gray-500">{t('paymentSuccess.transactionId')}</p>
                  <p className="font-mono text-sm">{paymentId || t('paymentSuccess.noTransactionId')}</p>
                </div>
                
                <div className="border-b pb-3">
                  <p className="text-sm text-gray-500 mb-1">{t('paymentSuccess.whatHappensNext')}</p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start">
                      <span className="font-medium mr-2">1.</span>
                      <span>{t('paymentSuccess.step1')}</span>
                    </li>
                    <li className="flex items-start">
                      <span className="font-medium mr-2">2.</span>
                      <span>{t('paymentSuccess.step2')}</span>
                    </li>
                    <li className="flex items-start">
                      <span className="font-medium mr-2">3.</span>
                      <span>{t('paymentSuccess.step3')}</span>
                    </li>
                  </ul>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col sm:flex-row gap-3 sm:justify-between">
                <Button 
                  variant="outline" 
                  onClick={() => navigate('/client/dashboard')}
                >
                  {t('paymentSuccess.viewDashboard')}
                </Button>
                <Button 
                  className="gap-2 group" 
                  onClick={() => navigate('/services')}
                >
                  {t('paymentSuccess.browseMore')}
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default PaymentSuccessPage;