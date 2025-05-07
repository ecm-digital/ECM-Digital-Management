import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'wouter';
import { useTranslation } from 'react-i18next';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Layout from '@/components/Layout';
import { ChevronLeft, ArrowRight, Check } from 'lucide-react';

const CaseStudyOne: React.FC = () => {
  const { t, i18n } = useTranslation();
  const currentLanguage = i18n.language;

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

  return (
    <Layout>
      {/* Hero section */}
      <section className="pt-24 bg-gradient-to-b from-white to-gray-50">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="flex items-center mb-6">
            <Link href="/">
              <Button variant="ghost" className="flex items-center text-gray-600 hover:text-primary">
                <ChevronLeft className="h-4 w-4 mr-1" />
                {currentLanguage === 'de' ? 'Zurück zur Startseite' : 'Powrót do strony głównej'}
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <motion.div 
              className="max-w-2xl"
              initial="hidden"
              animate="visible"
              variants={fadeIn}
            >
              <Badge className="bg-primary/10 text-primary mb-6 py-1.5 px-4 rounded-full text-sm font-medium">
                {currentLanguage === 'de' ? 'Fallstudie: E-Commerce' : 'Case Study: E-commerce'}
              </Badge>
              <h1 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight leading-tight">
                {currentLanguage === 'de' 
                  ? 'E-Commerce-Optimierung für ein Modeunternehmen'
                  : 'Optymalizacja e-commerce dla sklepu modowego'}
              </h1>
              <p className="text-xl text-gray-600 mb-6">
                {currentLanguage === 'de' 
                  ? 'Neugestaltung des Bestellprozesses und der Produktseiten zur Steigerung der Konversion und Verbesserung des Kundenerlebnisses.'
                  : 'Przeprojektowanie procesu zamówienia i stron produktowych w celu zwiększenia konwersji i poprawy doświadczenia klienta.'}
              </p>
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500 mb-1">{currentLanguage === 'de' ? 'Kunde' : 'Klient'}</p>
                  <p className="font-medium">Fashion Brand Polska</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500 mb-1">{currentLanguage === 'de' ? 'Zeitraum' : 'Okres'}</p>
                  <p className="font-medium">2023 - 2024</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500 mb-1">{currentLanguage === 'de' ? 'Dienste' : 'Usługi'}</p>
                  <p className="font-medium">{currentLanguage === 'de' ? 'UX/UI-Design, E-Commerce' : 'UX/UI Design, E-commerce'}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500 mb-1">{currentLanguage === 'de' ? 'Ergebnisse' : 'Rezultaty'}</p>
                  <p className="font-medium text-green-600">+156% {currentLanguage === 'de' ? 'Konversion' : 'konwersja'}</p>
                </div>
              </div>
            </motion.div>
            <motion.div 
              className="relative aspect-[4/3] mt-6 lg:mt-0"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
            >
              <div className="absolute -inset-4 bg-gradient-to-tr from-primary/20 to-secondary/20 rounded-3xl transform rotate-3"></div>
              <div className="absolute inset-0 bg-white rounded-2xl shadow-xl overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1511018556340-d16986a1c194?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fGVjb21tZXJjZXxlbnwwfHwwfHx8MA%3D%3D" 
                  alt="Fashion Brand e-commerce website"
                  className="w-full h-full object-cover"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Problem section */}
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
            <Badge className="bg-red-100 text-red-700 mb-4 py-1 px-3 rounded-full">
              {currentLanguage === 'de' ? 'Problem' : 'Problem'}
            </Badge>
            <h2 className="text-3xl font-bold mb-6 tracking-tight">
              {currentLanguage === 'de' ? 'Die Herausforderung' : 'Wyzwanie'}
            </h2>
            <div className="prose prose-lg max-w-none text-gray-700">
              <p>
                {currentLanguage === 'de' 
                  ? 'Fashion Brand Polska, ein aufstrebender Modehändler, stand vor einem kritischen Problem: trotz steigenden Traffics auf ihrer E-Commerce-Plattform lag die Konversionsrate bei nur 1,2%, deutlich unter dem Branchendurchschnitt.'
                  : 'Fashion Brand Polska, rozwijający się sklep modowy, stanął przed krytycznym problemem: pomimo rosnącego ruchu na swojej platformie e-commerce, współczynnik konwersji wynosił zaledwie 1,2%, znacznie poniżej średniej branżowej.'}
              </p>
              <p>
                {currentLanguage === 'de' 
                  ? 'Die Hauptprobleme umfassten:'
                  : 'Główne problemy obejmowały:'}
              </p>
              <ul>
                <li>
                  {currentLanguage === 'de' 
                    ? 'Ein komplizierter, 5-stufiger Checkout-Prozess, der zu einer Abbruchrate von 76% führte'
                    : 'Skomplikowany, 5-etapowy proces zamówienia, prowadzący do wskaźnika porzuceń na poziomie 76%'}
                </li>
                <li>
                  {currentLanguage === 'de' 
                    ? 'Langsame Ladezeiten der Produktseiten (durchschnittlich 5,2 Sekunden)'
                    : 'Wolne czasy ładowania stron produktowych (średnio 5,2 sekundy)'}
                </li>
                <li>
                  {currentLanguage === 'de' 
                    ? 'Unzureichende Produktpräsentation und begrenzte Filtermöglichkeiten'
                    : 'Niewystarczająca prezentacja produktów i ograniczone możliwości filtrowania'}
                </li>
                <li>
                  {currentLanguage === 'de' 
                    ? 'Fehlende mobile Optimierung, obwohl 65% der Besucher mobile Geräte nutzten'
                    : 'Brak optymalizacji mobilnej, pomimo że 65% odwiedzających korzystało z urządzeń mobilnych'}
                </li>
              </ul>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Process section */}
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
            <Badge className="bg-blue-100 text-blue-700 mb-4 py-1 px-3 rounded-full">
              {currentLanguage === 'de' ? 'Prozess' : 'Proces'}
            </Badge>
            <h2 className="text-3xl font-bold mb-6 tracking-tight">
              {currentLanguage === 'de' ? 'Unser Ansatz' : 'Nasze podejście'}
            </h2>
            <div className="prose prose-lg max-w-none text-gray-700 mb-10">
              <p>
                {currentLanguage === 'de' 
                  ? 'Wir haben einen umfassenden UX-Research- und Redesign-Prozess implementiert:'
                  : 'Wdrożyliśmy kompleksowy proces badania UX i przeprojektowania:'}
              </p>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeInUp}
              custom={1}
              className="bg-white p-8 rounded-xl shadow-sm"
            >
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-blue-600 font-bold text-lg">1</span>
              </div>
              <h3 className="text-xl font-bold mb-3">
                {currentLanguage === 'de' ? 'Umfassende UX-Analyse' : 'Kompleksowa analiza UX'}
              </h3>
              <p className="text-gray-700">
                {currentLanguage === 'de' 
                  ? 'Durchführung von Heatmap-Analysen, Benutzerinterviews und Usability-Tests, um Schmerzpunkte und Engpässe zu identifizieren.'
                  : 'Przeprowadziliśmy analizy heat map, wywiady z użytkownikami i testy użyteczności, aby zidentyfikować punkty bólu i wąskie gardła.'}
              </p>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeInUp}
              custom={2}
              className="bg-white p-8 rounded-xl shadow-sm"
            >
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-blue-600 font-bold text-lg">2</span>
              </div>
              <h3 className="text-xl font-bold mb-3">
                {currentLanguage === 'de' ? 'Prototyping & Testing' : 'Prototypowanie i testowanie'}
              </h3>
              <p className="text-gray-700">
                {currentLanguage === 'de' 
                  ? 'Erstellung interaktiver Prototypen für den Checkout-Prozess und die Produktseiten, gefolgt von A/B-Tests mit echten Benutzern.'
                  : 'Stworzyliśmy interaktywne prototypy dla procesu zamówienia i stron produktowych, a następnie przeprowadziliśmy testy A/B z prawdziwymi użytkownikami.'}
              </p>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeInUp}
              custom={3}
              className="bg-white p-8 rounded-xl shadow-sm"
            >
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-blue-600 font-bold text-lg">3</span>
              </div>
              <h3 className="text-xl font-bold mb-3">
                {currentLanguage === 'de' ? 'Redesign & Entwicklung' : 'Redesign i rozwój'}
              </h3>
              <p className="text-gray-700">
                {currentLanguage === 'de' 
                  ? 'Vollständiges Redesign der Benutzeroberfläche mit Fokus auf Mobile-First-Design, Optimierung der Seitenladezeiten und Implementierung eines rationalisierten 2-stufigen Checkouts.'
                  : 'Przeprowadziliśmy pełny redesign interfejsu z naciskiem na projektowanie mobile-first, optymalizację czasów ładowania stron i wdrożenie uproszczonego, 2-etapowego procesu zamówienia.'}
              </p>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeInUp}
              custom={4}
              className="bg-white p-8 rounded-xl shadow-sm"
            >
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-blue-600 font-bold text-lg">4</span>
              </div>
              <h3 className="text-xl font-bold mb-3">
                {currentLanguage === 'de' ? 'Optimierung & Messung' : 'Optymalizacja i pomiary'}
              </h3>
              <p className="text-gray-700">
                {currentLanguage === 'de' 
                  ? 'Implementierung umfassender Analytics-Tools für kontinuierliche Überwachung, gefolgt von iterativen Verbesserungen basierend auf Echtzeitdaten.'
                  : 'Wdrożyliśmy kompleksowe narzędzia analityczne do ciągłego monitorowania, a następnie wprowadzaliśmy iteracyjne ulepszenia w oparciu o dane w czasie rzeczywistym.'}
              </p>
            </motion.div>
          </div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
            custom={5}
            className="relative mx-auto max-w-2xl aspect-video rounded-xl overflow-hidden shadow-xl"
          >
            <img 
              src="https://images.unsplash.com/photo-1531973576160-7125cd663d86?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80" 
              alt="UX design process visualization"
              className="w-full h-full object-cover"
            />
          </motion.div>
        </div>
      </section>

      {/* Solution section */}
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
            <Badge className="bg-green-100 text-green-700 mb-4 py-1 px-3 rounded-full">
              {currentLanguage === 'de' ? 'Lösung' : 'Rozwiązanie'}
            </Badge>
            <h2 className="text-3xl font-bold mb-6 tracking-tight">
              {currentLanguage === 'de' ? 'Implementierte Verbesserungen' : 'Wdrożone ulepszenia'}
            </h2>
            <div className="prose prose-lg max-w-none text-gray-700 mb-10">
              <p>
                {currentLanguage === 'de' 
                  ? 'Basierend auf unserer Recherche und den Tests haben wir folgende Änderungen implementiert:'
                  : 'Na podstawie naszych badań i testów wdrożyliśmy następujące zmiany:'}
              </p>
            </div>
          </motion.div>

          <div className="space-y-6 mb-12">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeInUp}
              custom={1}
              className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm"
            >
              <h3 className="text-xl font-bold mb-3">
                {currentLanguage === 'de' ? 'Straffung des Checkout-Prozesses' : 'Usprawnienie procesu zamówienia'}
              </h3>
              <p className="text-gray-700 mb-4">
                {currentLanguage === 'de' 
                  ? 'Reduktion von 5 auf 2 Schritte mit einer einzigen Seite für die Eingabe von Versand- und Zahlungsinformationen, plus einer Übersichtsseite.'
                  : 'Zmniejszenie z 5 do 2 kroków z jedną stroną do wprowadzania informacji o wysyłce i płatności oraz stroną podsumowania.'}
              </p>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0 mr-3">
                    <Check className="h-3 w-3 text-green-600" />
                  </div>
                  <span className="text-gray-700">
                    {currentLanguage === 'de' 
                      ? 'Implementierung eines Fortschrittbalkens für bessere Benutzertransparenz'
                      : 'Wdrożenie paska postępu dla lepszej przejrzystości dla użytkownika'}
                  </span>
                </li>
                <li className="flex items-start">
                  <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0 mr-3">
                    <Check className="h-3 w-3 text-green-600" />
                  </div>
                  <span className="text-gray-700">
                    {currentLanguage === 'de' 
                      ? 'Hinzufügung von Express-Checkout-Optionen (Apple Pay, Google Pay)'
                      : 'Dodanie opcji ekspresowej realizacji zamówienia (Apple Pay, Google Pay)'}
                  </span>
                </li>
                <li className="flex items-start">
                  <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0 mr-3">
                    <Check className="h-3 w-3 text-green-600" />
                  </div>
                  <span className="text-gray-700">
                    {currentLanguage === 'de' 
                      ? 'Implementierung automatischer Adressvalidierung zur Reduzierung von Eingabefehlern'
                      : 'Wdrożenie automatycznej walidacji adresu w celu zmniejszenia błędów wprowadzania danych'}
                  </span>
                </li>
              </ul>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeInUp}
              custom={2}
              className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm"
            >
              <h3 className="text-xl font-bold mb-3">
                {currentLanguage === 'de' ? 'Verbesserte Produktseiten' : 'Ulepszone strony produktowe'}
              </h3>
              <p className="text-gray-700 mb-4">
                {currentLanguage === 'de' 
                  ? 'Vollständige Neugestaltung der Produktseiten für bessere Benutzerinteraktion und Konversion.'
                  : 'Całkowite przeprojektowanie stron produktowych dla lepszej interakcji użytkownika i konwersji.'}
              </p>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0 mr-3">
                    <Check className="h-3 w-3 text-green-600" />
                  </div>
                  <span className="text-gray-700">
                    {currentLanguage === 'de' 
                      ? 'Implementierung von High-Quality-Zoom und 360°-Produktansicht'
                      : 'Wdrożenie wysokiej jakości zoomu i widoku produktu 360°'}
                  </span>
                </li>
                <li className="flex items-start">
                  <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0 mr-3">
                    <Check className="h-3 w-3 text-green-600" />
                  </div>
                  <span className="text-gray-700">
                    {currentLanguage === 'de' 
                      ? 'Hinzufügung eines „Size Guide" mit interaktiver Größentabelle'
                      : 'Dodanie "Przewodnika po rozmiarach" z interaktywną tabelą rozmiarów'}
                  </span>
                </li>
                <li className="flex items-start">
                  <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0 mr-3">
                    <Check className="h-3 w-3 text-green-600" />
                  </div>
                  <span className="text-gray-700">
                    {currentLanguage === 'de' 
                      ? 'Optimierung der Seitenladezeit durch fortschrittliches Bild-Lazy-Loading und Code-Splitting'
                      : 'Optymalizacja czasu ładowania strony dzięki zaawansowanemu leniwemu ładowaniu obrazów i podziałowi kodu'}
                  </span>
                </li>
              </ul>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeInUp}
              custom={3}
              className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm"
            >
              <h3 className="text-xl font-bold mb-3">
                {currentLanguage === 'de' ? 'Mobile-First-Optimierung' : 'Optymalizacja Mobile-First'}
              </h3>
              <p className="text-gray-700 mb-4">
                {currentLanguage === 'de' 
                  ? 'Vollständige Überarbeitung des mobilen Erlebnisses mit besonderem Fokus auf Touch-freundliche Elemente.'
                  : 'Całkowita przebudowa doświadczenia mobilnego ze szczególnym naciskiem na elementy przyjazne dla dotyku.'}
              </p>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0 mr-3">
                    <Check className="h-3 w-3 text-green-600" />
                  </div>
                  <span className="text-gray-700">
                    {currentLanguage === 'de' 
                      ? 'Implementierung von Touch-optimierten Filtern und Produktgalerien'
                      : 'Wdrożenie filtrów i galerii produktów zoptymalizowanych pod kątem dotyku'}
                  </span>
                </li>
                <li className="flex items-start">
                  <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0 mr-3">
                    <Check className="h-3 w-3 text-green-600" />
                  </div>
                  <span className="text-gray-700">
                    {currentLanguage === 'de' 
                      ? 'Entwicklung eines Floating-Add-to-Cart-Buttons, der beim Scrollen sichtbar bleibt'
                      : 'Opracowanie pływającego przycisku "Dodaj do koszyka", który pozostaje widoczny podczas przewijania'}
                  </span>
                </li>
                <li className="flex items-start">
                  <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0 mr-3">
                    <Check className="h-3 w-3 text-green-600" />
                  </div>
                  <span className="text-gray-700">
                    {currentLanguage === 'de' 
                      ? 'Optimierung der Navigationselemente für einhändige Bedienung auf großen Smartphones'
                      : 'Optymalizacja elementów nawigacyjnych dla obsługi jedną ręką na dużych smartfonach'}
                  </span>
                </li>
              </ul>
            </motion.div>
          </div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
            custom={4}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            <div className="aspect-[4/3] rounded-xl overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1607082349566-187342175e2f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80" 
                alt="Before redesign"
                className="w-full h-full object-cover"
              />
              <div className="bg-white px-4 py-2 text-center">
                <p className="text-gray-500 text-sm font-medium">{currentLanguage === 'de' ? 'Vorher' : 'Przed'}</p>
              </div>
            </div>
            <div className="aspect-[4/3] rounded-xl overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80" 
                alt="After redesign"
                className="w-full h-full object-cover"
              />
              <div className="bg-white px-4 py-2 text-center">
                <p className="text-gray-500 text-sm font-medium">{currentLanguage === 'de' ? 'Nachher' : 'Po'}</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Results section */}
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
            <Badge className="bg-primary/20 text-primary mb-4 py-1 px-3 rounded-full">
              {currentLanguage === 'de' ? 'Ergebnisse' : 'Rezultaty'}
            </Badge>
            <h2 className="text-3xl font-bold mb-6 tracking-tight">
              {currentLanguage === 'de' ? 'Gemessene Auswirkungen' : 'Zmierzone efekty'}
            </h2>
            <div className="prose prose-lg max-w-none text-gray-700 mb-10">
              <p>
                {currentLanguage === 'de' 
                  ? 'Sechs Monate nach der Implementierung der neuen UX/UI-Design-Lösungen wurden folgende beeindruckende Ergebnisse gemessen:'
                  : 'Sześć miesięcy po wdrożeniu nowych rozwiązań UX/UI zmierzono następujące imponujące wyniki:'}
              </p>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeInUp}
              custom={1}
              className="bg-white p-8 rounded-xl shadow-sm text-center"
            >
              <h3 className="text-5xl font-bold text-primary mb-4">+156%</h3>
              <p className="text-gray-700 font-medium">
                {currentLanguage === 'de' ? 'Steigerung der Konversionsrate' : 'Wzrost współczynnika konwersji'}
              </p>
              <p className="text-gray-500 text-sm mt-2">
                {currentLanguage === 'de' ? 'Von 1,2% auf 3,1%' : 'Z 1,2% do 3,1%'}
              </p>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeInUp}
              custom={2}
              className="bg-white p-8 rounded-xl shadow-sm text-center"
            >
              <h3 className="text-5xl font-bold text-green-600 mb-4">-68%</h3>
              <p className="text-gray-700 font-medium">
                {currentLanguage === 'de' ? 'Reduzierung der Abbruchrate' : 'Zmniejszenie wskaźnika porzuceń'}
              </p>
              <p className="text-gray-500 text-sm mt-2">
                {currentLanguage === 'de' ? 'Von 76% auf 24%' : 'Z 76% do 24%'}
              </p>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeInUp}
              custom={3}
              className="bg-white p-8 rounded-xl shadow-sm text-center"
            >
              <h3 className="text-5xl font-bold text-blue-600 mb-4">+42%</h3>
              <p className="text-gray-700 font-medium">
                {currentLanguage === 'de' ? 'Steigerung des durchschnittlichen Bestellwerts' : 'Wzrost średniej wartości zamówienia'}
              </p>
              <p className="text-gray-500 text-sm mt-2">
                {currentLanguage === 'de' ? 'Von 120 PLN auf 170 PLN' : 'Z 120 PLN do 170 PLN'}
              </p>
            </motion.div>
          </div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
            custom={4}
            className="bg-white rounded-xl p-8 shadow-sm"
          >
            <h3 className="text-xl font-bold mb-4">
              {currentLanguage === 'de' ? 'Zusätzliche Vorteile' : 'Dodatkowe korzyści'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start">
                <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0 mr-3">
                  <Check className="h-3 w-3 text-green-600" />
                </div>
                <span className="text-gray-700">
                  {currentLanguage === 'de' 
                    ? '89% Verbesserung der mobilen Nutzererfahrung (basierend auf Kundenfeedback)'
                    : '89% poprawa doświadczenia mobilnego (na podstawie opinii klientów)'}
                </span>
              </div>
              <div className="flex items-start">
                <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0 mr-3">
                  <Check className="h-3 w-3 text-green-600" />
                </div>
                <span className="text-gray-700">
                  {currentLanguage === 'de' 
                    ? '63% Reduzierung der Serviceanfragen bezüglich des Bestellvorgangs'
                    : '63% redukcja zapytań serwisowych dotyczących procesu zamawiania'}
                </span>
              </div>
              <div className="flex items-start">
                <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0 mr-3">
                  <Check className="h-3 w-3 text-green-600" />
                </div>
                <span className="text-gray-700">
                  {currentLanguage === 'de' 
                    ? 'Verbesserung der Google PageSpeed-Scores von 64 auf 94 (mobile)'
                    : 'Poprawa ocen Google PageSpeed z 64 do 94 (mobilnie)'}
                </span>
              </div>
              <div className="flex items-start">
                <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0 mr-3">
                  <Check className="h-3 w-3 text-green-600" />
                </div>
                <span className="text-gray-700">
                  {currentLanguage === 'de' 
                    ? '152% Steigerung der Newsletter-Anmeldungen durch strategische UX-Optimierung'
                    : '152% wzrost zapisów do newslettera dzięki strategicznej optymalizacji UX'}
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Testimonial section */}
      <section className="py-24 bg-white">
        <div className="container max-w-4xl mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
            custom={0}
            className="bg-gradient-to-br from-primary/5 to-secondary/5 rounded-2xl p-8 md:p-12 relative"
          >
            <div className="absolute -top-5 left-10 text-5xl">"</div>
            <div className="relative z-10">
              <p className="text-xl text-gray-700 italic mb-6">
                {currentLanguage === 'de' 
                  ? 'Die Zusammenarbeit mit ECM Digital hat unsere E-Commerce-Plattform vollständig transformiert. Die UX-Optimierungen, die sie implementiert haben, führten zu einer bemerkenswerten Steigerung unserer Konversionsrate und des durchschnittlichen Bestellwerts. Ihr methodischer Ansatz und ihre Aufmerksamkeit für Details haben uns geholfen, in einem hart umkämpften Markt einen Wettbewerbsvorteil zu erlangen.'
                  : 'Współpraca z ECM Digital całkowicie przekształciła naszą platformę e-commerce. Optymalizacje UX, które wdrożyli, doprowadziły do niezwykłego wzrostu naszego współczynnika konwersji i średniej wartości zamówienia. Ich metodyczne podejście i dbałość o szczegóły pomogły nam uzyskać przewagę konkurencyjną na trudnym rynku.'}
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full bg-gray-200 mr-4"></div>
                <div>
                  <p className="font-bold">Marta Kowalska</p>
                  <p className="text-gray-500 text-sm">{currentLanguage === 'de' ? 'E-Commerce-Direktorin, Fashion Brand Polska' : 'Dyrektor E-commerce, Fashion Brand Polska'}</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA section */}
      <section className="py-16 bg-gray-50">
        <div className="container max-w-5xl mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
            custom={0}
            className="bg-white rounded-xl p-8 md:p-12 shadow-md"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
              <div>
                <Badge className="bg-secondary/10 text-secondary mb-4 py-1 px-3 rounded-full">
                  {currentLanguage === 'de' ? 'Bereit für Ihr Projekt?' : 'Gotowy na swój projekt?'}
                </Badge>
                <h2 className="text-2xl md:text-3xl font-bold mb-6">
                  {currentLanguage === 'de' ? 'Lassen Sie uns Ihre E-Commerce-Erfahrung optimieren' : 'Pozwól nam zoptymalizować Twoje doświadczenie e-commerce'}
                </h2>
                <p className="text-gray-600 mb-8">
                  {currentLanguage === 'de' 
                    ? 'Kontaktieren Sie uns heute, um zu besprechen, wie wir Ihre Konversionsraten verbessern und das Kundenerlebnis auf Ihrer E-Commerce-Website steigern können.'
                    : 'Skontaktuj się z nami już dziś, aby omówić, jak możemy poprawić Twoje współczynniki konwersji i podnieść doświadczenie klienta na Twojej stronie e-commerce.'}
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link href="/services">
                    <Button className="rounded-full bg-primary hover:bg-primary/90 text-white py-2 px-8 flex items-center gap-2 group">
                      {currentLanguage === 'de' ? 'Unsere Dienste erkunden' : 'Poznaj nasze usługi'}
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                  <Link href="#contact-form">
                    <Button variant="outline" className="rounded-full py-2 px-8">
                      {currentLanguage === 'de' ? 'Kontakt aufnehmen' : 'Skontaktuj się'}
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="relative mx-auto max-w-md">
                <div className="absolute -top-6 -right-6 w-32 h-32 bg-secondary/10 rounded-full blur-xl"></div>
                <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-primary/10 rounded-full blur-xl"></div>
                <div className="relative z-10 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-2xl p-8 border border-white/20">
                  <h3 className="text-xl font-bold mb-4">{currentLanguage === 'de' ? 'Unsere UX/UI Dienste' : 'Nasze usługi UX/UI'}</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0">
                        <Check className="h-3 w-3 text-green-600" />
                      </div>
                      <span className="text-gray-700">{currentLanguage === 'de' ? 'UX-Audits und Conversion-Optimierung' : 'Audyty UX i optymalizacja konwersji'}</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0">
                        <Check className="h-3 w-3 text-green-600" />
                      </div>
                      <span className="text-gray-700">{currentLanguage === 'de' ? 'E-Commerce-Design und -Entwicklung' : 'Projektowanie i rozwój e-commerce'}</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0">
                        <Check className="h-3 w-3 text-green-600" />
                      </div>
                      <span className="text-gray-700">{currentLanguage === 'de' ? 'UI-Design und Prototyping' : 'Projektowanie UI i prototypowanie'}</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Next case study section */}
      <section className="py-16 bg-white">
        <div className="container max-w-4xl mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold">
              {currentLanguage === 'de' ? 'Entdecken Sie mehr Fallstudien' : 'Odkryj więcej case studies'}
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Link href="/case-studies/2">
              <motion.div 
                className="bg-white rounded-xl overflow-hidden shadow-md transition-all duration-300 hover:-translate-y-2 hover:shadow-lg"
                whileHover={{ scale: 1.02 }}
              >
                <div className="h-48 bg-purple-100 relative">
                  <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/30 to-indigo-500/30 mix-blend-multiply"></div>
                  <div className="absolute bottom-4 left-4">
                    <Badge className="bg-white/80 text-purple-600">{t('home.caseStudyTypes.webapp')}</Badge>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">{t('home.caseStudiesItems.example2.title')}</h3>
                  <p className="text-gray-500 mb-4 text-sm">{t('home.caseStudiesItems.example2.client')}</p>
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-green-600 font-medium">+78% {t('home.userEngagement')}</span>
                    </div>
                    <div className="text-primary font-medium flex items-center">
                      {t('home.readMore')} <ArrowRight className="ml-1 h-4 w-4" />
                    </div>
                  </div>
                </div>
              </motion.div>
            </Link>
            
            <Link href="/services">
              <motion.div 
                className="bg-gradient-to-br from-primary/5 to-secondary/5 rounded-xl p-8 flex flex-col justify-center items-center h-full text-center"
                whileHover={{ scale: 1.02 }}
              >
                <h3 className="text-xl font-bold mb-4">
                  {currentLanguage === 'de' ? 'Sehen Sie sich all unsere Dienstleistungen an' : 'Zobacz wszystkie nasze usługi'}
                </h3>
                <p className="text-gray-600 mb-6">
                  {currentLanguage === 'de' 
                    ? 'Entdecken Sie, wie wir Ihnen bei der Umsetzung Ihrer digitalen Vision helfen können'
                    : 'Odkryj, jak możemy pomóc Ci w realizacji Twojej cyfrowej wizji'}
                </p>
                <Button className="rounded-full bg-primary hover:bg-primary/90 text-white py-2 px-8 flex items-center gap-2 group">
                  {currentLanguage === 'de' ? 'Alle Dienste anzeigen' : 'Zobacz wszystkie usługi'}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </motion.div>
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default CaseStudyOne;