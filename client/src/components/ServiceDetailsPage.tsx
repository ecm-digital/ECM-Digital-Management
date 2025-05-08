import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link, useRoute, useLocation } from 'wouter';
import { motion } from 'framer-motion';
import { Service } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Clock, Calendar, CheckCircle, Check, ChevronLeft, ArrowRight, BarChart } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import i18next from 'i18next';
import { getServiceTranslation, getCategoryTranslation } from './ServiceTranslator';

// Definiujemy typ dla tablicy tłumaczeń
type I18nArray = string[];

export default function ServiceDetailsPage() {
  const { t } = useTranslation();
  const [match, params] = useRoute('/service/:id');
  const [_, setLocation] = useLocation();
  const serviceId = params?.id;
  const currentLanguage = i18next.language || 'pl';
  
  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: (custom: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: custom * 0.2,
        duration: 0.8,
        ease: "easeOut"
      }
    })
  };

  const { data: service, isLoading, isError } = useQuery<Service>({ 
    queryKey: [`/api/services/${serviceId}`],
    staleTime: 5000
  });

  const handleBack = () => {
    setLocation('/services');
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="h-64 bg-gray-200 rounded mb-6"></div>
          <div className="h-8 bg-gray-200 rounded w-1/2 mb-4"></div>
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
        </div>
      </div>
    );
  }

  if (isError || !service) {
    return (
      <div className="container mx-auto p-8 text-center">
        <h2 className="text-red-500 font-bold text-xl mb-4">{t('services.notFound')}</h2>
        <p className="mb-6">{t('services.notFoundDescription')}</p>
        <Button onClick={handleBack}>{t('buttons.back')}</Button>
      </div>
    );
  }

  // Pobieranie danych usługi z uwzględnieniem tłumaczeń
  const getServiceData = (field: keyof Service, defaultReturn: any[] = []) => {
    if (i18next.language === 'de') {
      if (service.id === '1' && field in t('services.servicesList.uxAudit', { returnObjects: true })) {
        return (t(`services.servicesList.uxAudit.${field}`, { returnObjects: true }) as any[]);
      } else if (service.id === '2' && field in t('services.servicesList.uxAuditAi', { returnObjects: true })) {
        return (t(`services.servicesList.uxAuditAi.${field}`, { returnObjects: true }) as any[]);
      } else if (service.id === '24' && field in t('services.servicesList.monthlyAiUxCare', { returnObjects: true })) {
        return (t(`services.servicesList.monthlyAiUxCare.${field}`, { returnObjects: true }) as any[]);
      } else if (service.id === '25' && field in t('services.servicesList.insightsNewsletter', { returnObjects: true })) {
        return (t(`services.servicesList.insightsNewsletter.${field}`, { returnObjects: true }) as any[]);
      }
    }
    return service[field] as any[] || defaultReturn;
  };

  // Pobieranie tłumaczonych tekstów dla usługi
  const getServiceText = (field: string, defaultText: string = '') => {
    if (i18next.language === 'de') {
      if (service.id === '1' && field in t('services.servicesList.uxAudit', { returnObjects: true })) {
        return t(`services.servicesList.uxAudit.${field}`);
      } else if (service.id === '2' && field in t('services.servicesList.uxAuditAi', { returnObjects: true })) {
        return t(`services.servicesList.uxAuditAi.${field}`);
      } else if (service.id === '24' && field in t('services.servicesList.monthlyAiUxCare', { returnObjects: true })) {
        return t(`services.servicesList.monthlyAiUxCare.${field}`);
      } else if (service.id === '25' && field in t('services.servicesList.insightsNewsletter', { returnObjects: true })) {
        return t(`services.servicesList.insightsNewsletter.${field}`);
      }
    }
    
    if (field === 'description') return service.description || defaultText;
    if (field === 'shortDescription') return service.shortDescription || defaultText;
    if (field === 'longDescription') return service.longDescription || defaultText;
    
    return defaultText;
  };

  // Przykładowe problemy, które rozwiązuje usługa (można dodać do modelu danych w przyszłości)
  const problemsToSolve = [
    t('services.problems.time', 'Brak czasu na regularne doskonalenie doświadczenia użytkownika'),
    t('services.problems.expertise', 'Niedostateczna wiedza wewnątrz zespołu w zakresie UX/UI'),
    t('services.problems.conversion', 'Niski współczynnik konwersji i zaangażowania użytkowników'),
    t('services.problems.competition', 'Rosnąca konkurencja w branży')
  ];

  // Proces realizacji usługi
  const processSteps = [
    {
      title: t('services.process.analysis', 'Analiza i diagnoza'),
      description: t('services.process.analysisDesc', 'Dokładna analiza obecnego stanu, identyfikacja problemów i możliwości.')
    },
    {
      title: t('services.process.strategy', 'Strategia i planowanie'),
      description: t('services.process.strategyDesc', 'Opracowanie strategii działania i priorytetyzacja zadań.')
    },
    {
      title: t('services.process.implementation', 'Implementacja'),
      description: t('services.process.implementationDesc', 'Wdrożenie rozwiązań zgodnie z ustaloną strategią i harmonogramem.')
    },
    {
      title: t('services.process.optimization', 'Optymalizacja'),
      description: t('services.process.optimizationDesc', 'Ciągłe doskonalenie w oparciu o dane i testy użyteczności.')
    }
  ];

  // Rezultaty z implementacji usługi
  const results = [
    {
      metric: t('services.results.conversion', 'Wzrost konwersji'),
      value: '+45%',
      description: t('services.results.conversionDesc', 'Średni wzrost konwersji u naszych klientów')
    },
    {
      metric: t('services.results.engagement', 'Zaangażowanie'),
      value: '+82%',
      description: t('services.results.engagementDesc', 'Wzrost czasu spędzonego na stronie')
    },
    {
      metric: t('services.results.satisfaction', 'Satysfakcja'),
      value: '9.4/10',
      description: t('services.results.satisfactionDesc', 'Średnia ocena zadowolenia klientów')
    }
  ];

  return (
    <div className="bg-background min-h-screen">
      {/* Hero section */}
      <section className="pt-24 pb-16 bg-gradient-to-b from-white to-gray-50">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="flex items-center mb-6">
            <Button variant="ghost" onClick={handleBack} className="flex items-center text-gray-600 hover:text-primary">
              <ChevronLeft className="h-4 w-4 mr-1" />
              {t('services.backToList')}
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <motion.div 
              className="max-w-2xl"
              initial="hidden"
              animate="visible"
              variants={fadeIn}
            >
              <Badge className="bg-primary/10 text-primary mb-6 py-1.5 px-4 rounded-full text-sm font-medium">
                {getCategoryTranslation(service.category || 'Inne', currentLanguage)}
              </Badge>
              <h1 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight leading-tight">
                {getServiceTranslation(service.name, currentLanguage)}
              </h1>
              <p className="text-xl text-gray-600 mb-6">
                {getServiceText('shortDescription', service.shortDescription || '')}
              </p>
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500 mb-1">{t('services.category')}</p>
                  <p className="font-medium">{getCategoryTranslation(service.category || 'Inne', currentLanguage)}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500 mb-1">{t('services.deliveryTime')}</p>
                  <p className="font-medium">{service.deliveryTime} {t('services.days')}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500 mb-1">{t('services.price')}</p>
                  <p className="font-medium">{service.basePrice} {currentLanguage === 'de' ? '€' : 'PLN'}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500 mb-1">{t('services.satisfaction')}</p>
                  <p className="font-medium text-green-600">98% {t('services.satisfactionRate')}</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-4">
                <Link href={`/configure/${service.id}`}>
                  <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-6 px-8 text-base rounded-lg hover:opacity-90 transition-all">
                    {t('services.orderNow')} <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <a href="#process">
                  <Button variant="outline" className="py-6 px-8 text-base rounded-lg border-2">
                    {t('services.learnMore')}
                  </Button>
                </a>
              </div>
            </motion.div>
            <motion.div 
              className="relative aspect-video mt-6 lg:mt-0"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
            >
              <div className="absolute -inset-4 bg-gradient-to-tr from-primary/20 to-secondary/20 rounded-3xl transform rotate-2"></div>
              <div className="absolute inset-0 bg-white rounded-2xl shadow-xl overflow-hidden">
                {/* Tutaj można dodać obrazek dla usługi */}
                <div className="w-full h-full bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
                  <div className="text-6xl text-blue-500 font-bold opacity-30">ECM Digital</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Description section */}
      <section className="py-24 bg-white">
        <div className="container max-w-4xl mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
            custom={0}
            className="max-w-3xl mx-auto"
          >
            <Badge className="bg-blue-100 text-blue-700 mb-4 py-1 px-3 rounded-full">
              {t('services.overview')}
            </Badge>
            <h2 className="text-3xl font-bold mb-6 tracking-tight">
              {t('services.aboutService')}
            </h2>
            <div className="prose prose-lg max-w-none text-gray-700">
              <p>
                {getServiceText('description', service.description || '')}
              </p>
              {getServiceText('longDescription', service.longDescription || '') && (
                <p className="mt-4">
                  {getServiceText('longDescription', service.longDescription || '')}
                </p>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Problem section */}
      <section className="py-24 bg-gray-50">
        <div className="container max-w-4xl mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
            custom={0}
            className="max-w-3xl mx-auto"
          >
            <Badge className="bg-red-100 text-red-700 mb-4 py-1 px-3 rounded-full">
              {t('services.challenges')}
            </Badge>
            <h2 className="text-3xl font-bold mb-6 tracking-tight">
              {t('services.problemsSolved')}
            </h2>
            <div className="prose prose-lg max-w-none text-gray-700 mb-10">
              <p>
                {t('services.problemsDesc')}
              </p>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {problemsToSolve.map((problem, idx) => (
              <motion.div
                key={idx}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={fadeInUp}
                custom={idx + 1}
                className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
              >
                <div className="flex items-start gap-3">
                  <div className="bg-red-100 text-red-600 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-lg font-bold">{idx + 1}</span>
                  </div>
                  <p className="text-gray-700">{problem}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features and benefits */}
      <section className="py-24 bg-white">
        <div className="container max-w-4xl mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
            custom={0}
            className="max-w-3xl mx-auto mb-12"
          >
            <Badge className="bg-green-100 text-green-700 mb-4 py-1 px-3 rounded-full">
              {t('services.value')}
            </Badge>
            <h2 className="text-3xl font-bold mb-6 tracking-tight">
              {t('services.whyChooseService')}
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Benefits */}
            {service.benefits && service.benefits.length > 0 && (
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={fadeInUp}
                custom={1}
              >
                <h3 className="text-xl font-bold mb-6 flex items-center">
                  <span className="bg-green-100 text-green-700 w-8 h-8 rounded-full flex items-center justify-center mr-3">
                    <CheckCircle size={18} />
                  </span>
                  {t('services.benefits')}
                </h3>
                <ul className="space-y-4">
                  {getServiceData('benefits', []).map((benefit, idx) => (
                    <li key={idx} className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}

            {/* Features */}
            {service.features && service.features.length > 0 && (
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={fadeInUp}
                custom={2}
              >
                <h3 className="text-xl font-bold mb-6 flex items-center">
                  <span className="bg-blue-100 text-blue-700 w-8 h-8 rounded-full flex items-center justify-center mr-3">
                    <Check size={18} />
                  </span>
                  {t('services.features')}
                </h3>
                <ul className="space-y-4">
                  {getServiceData('features', []).map((feature, idx) => (
                    <li key={idx} className="flex items-start">
                      <Check className="h-5 w-5 text-blue-500 mr-3 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}
          </div>
        </div>
      </section>

      {/* Process section */}
      <section id="process" className="py-24 bg-gray-50">
        <div className="container max-w-4xl mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
            custom={0}
            className="max-w-3xl mx-auto mb-12"
          >
            <Badge className="bg-blue-100 text-blue-700 mb-4 py-1 px-3 rounded-full">
              {t('services.process')}
            </Badge>
            <h2 className="text-3xl font-bold mb-6 tracking-tight">
              {t('services.howItWorks')}
            </h2>
            <p className="text-gray-700">
              {t('services.processDesc')}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {processSteps.map((step, idx) => (
              <motion.div
                key={idx}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={fadeInUp}
                custom={idx + 1}
                className="bg-white p-8 rounded-xl shadow-sm"
              >
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <span className="text-blue-600 font-bold text-lg">{idx + 1}</span>
                </div>
                <h3 className="text-xl font-bold mb-3">
                  {step.title}
                </h3>
                <p className="text-gray-700">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Scope */}
          {service.scope && service.scope.length > 0 && (
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeInUp}
              custom={0}
              className="bg-white p-8 rounded-xl shadow-sm mt-12"
            >
              <h3 className="text-xl font-bold mb-6">{t('services.scope')}</h3>
              <ul className="space-y-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                {getServiceData('scope', []).map((item, idx) => (
                  <li key={idx} className="flex items-start">
                    <span className="h-6 w-6 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center mr-3 flex-shrink-0">
                      {idx + 1}
                    </span>
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
        </div>
      </section>

      {/* Results section */}
      <section className="py-24 bg-white">
        <div className="container max-w-4xl mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
            custom={0}
            className="max-w-3xl mx-auto mb-12"
          >
            <Badge className="bg-green-100 text-green-700 mb-4 py-1 px-3 rounded-full">
              {t('services.results')}
            </Badge>
            <h2 className="text-3xl font-bold mb-6 tracking-tight">
              {t('services.expectedOutcomes')}
            </h2>
            <p className="text-gray-700">
              {t('services.resultsDesc')}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {results.map((result, idx) => (
              <motion.div
                key={idx}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={fadeInUp}
                custom={idx + 1}
                className="bg-white border border-gray-100 p-8 rounded-xl shadow-sm text-center"
              >
                <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-6">
                  <BarChart className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold mb-2 text-green-600">
                  {result.value}
                </h3>
                <p className="text-xl font-bold mb-3">
                  {result.metric}
                </p>
                <p className="text-gray-600">
                  {result.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div className="container max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">{t('services.readyToStart')}</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            {t('services.ctaDescription')}
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href={`/configure/${service.id}`}>
              <Button className="bg-white text-blue-600 hover:bg-gray-100 py-6 px-8 text-base rounded-lg">
                {t('services.orderNow')} <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <a href="#contact-form">
              <Button variant="outline" className="border-white text-white hover:bg-white/10 py-6 px-8 text-base rounded-lg">
                {t('services.contactUs')}
              </Button>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}