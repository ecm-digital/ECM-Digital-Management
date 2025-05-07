import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'wouter';
import { useTranslation } from 'react-i18next';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Layout from '@/components/Layout';
import { ChevronLeft, ArrowRight, Check, Code, PieChart, Zap, RefreshCw } from 'lucide-react';

const CaseStudyTwo: React.FC = () => {
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

  const fadeInRight = {
    hidden: { opacity: 0, x: -40 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.8, delay: 0.2 }
    }
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
              <Badge className="bg-purple-100 text-purple-700 mb-6 py-1.5 px-4 rounded-full text-sm font-medium">
                {currentLanguage === 'de' ? 'Fallstudie: AI-Plattform' : 'Case Study: Platforma AI'}
              </Badge>
              <h1 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight leading-tight">
                {currentLanguage === 'de' 
                  ? 'Intelligente KI-Empfehlungsplattform'
                  : 'Platforma rekomendacji oparta na AI'}
              </h1>
              <p className="text-xl text-gray-600 mb-6">
                {currentLanguage === 'de' 
                  ? 'Entwicklung einer intelligenten Empfehlungsplattform, die Kundenvorlieben analysiert und personalisierte Produktvorschläge liefert.'
                  : 'Opracowanie inteligentnej platformy rekomendacji, która analizuje preferencje klientów i dostarcza spersonalizowane sugestie produktów.'}
              </p>
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500 mb-1">{currentLanguage === 'de' ? 'Kunde' : 'Klient'}</p>
                  <p className="font-medium">Tech Solutions Polska</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500 mb-1">{currentLanguage === 'de' ? 'Zeitraum' : 'Okres'}</p>
                  <p className="font-medium">2024</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500 mb-1">{currentLanguage === 'de' ? 'Dienste' : 'Usługi'}</p>
                  <p className="font-medium">{currentLanguage === 'de' ? 'KI-Integration, Web-App-Entwicklung' : 'Integracja AI, Tworzenie aplikacji webowych'}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500 mb-1">{currentLanguage === 'de' ? 'Ergebnisse' : 'Rezultaty'}</p>
                  <p className="font-medium text-green-600">+78% {currentLanguage === 'de' ? 'Benutzerengagement' : 'zaangażowanie użytkowników'}</p>
                </div>
              </div>
            </motion.div>
            <motion.div 
              className="relative aspect-video mt-6 lg:mt-0"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
            >
              <div className="absolute -inset-4 bg-gradient-to-tr from-purple-500/20 to-indigo-500/20 rounded-3xl transform rotate-3"></div>
              <div className="absolute inset-0 bg-white rounded-2xl shadow-xl overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8YWklMjBwbGF0Zm9ybXxlbnwwfHwwfHx8MA%3D%3D" 
                  alt="AI Recommendation Platform"
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
                  ? 'Tech Solutions Polska, ein wachsendes SaaS-Unternehmen, stand vor einer kritischen Herausforderung in seiner E-Learning-Plattform. Das Unternehmen bot Tausende von Online-Kursen an, aber die Nutzer hatten Schwierigkeiten, relevante Inhalte zu finden, was zu einer hohen Abwanderungsrate und einer niedrigen Plattformnutzung führte.'
                  : 'Tech Solutions Polska, rozwijająca się firma SaaS, stanęła przed krytycznym wyzwaniem w swojej platformie e-learningowej. Firma oferowała tysiące kursów online, ale użytkownicy mieli trudności ze znalezieniem odpowiednich treści, co prowadziło do wysokiego wskaźnika odejść i niskiego wykorzystania platformy.'}
              </p>
              <p>
                {currentLanguage === 'de' 
                  ? 'Die Hauptprobleme umfassten:'
                  : 'Główne problemy obejmowały:'}
              </p>
              <ul>
                <li>
                  {currentLanguage === 'de' 
                    ? 'Ein statisches, kategoriebasiertes Kurssystem, das nicht an individuelle Lernbedürfnisse angepasst war'
                    : 'Statyczny, oparty na kategoriach system kursów, który nie był dostosowany do indywidualnych potrzeb edukacyjnych'}
                </li>
                <li>
                  {currentLanguage === 'de' 
                    ? 'Eine niedrige Kursabschlussrate von nur 23%, da die Nutzer Schwierigkeiten hatten, für sie relevante und ansprechende Inhalte zu finden'
                    : 'Niski wskaźnik ukończenia kursów wynoszący zaledwie 23%, ponieważ użytkownicy mieli trudności ze znalezieniem istotnych i angażujących ich treści'}
                </li>
                <li>
                  {currentLanguage === 'de' 
                    ? 'Limitierte Erkenntnisse über Benutzervorlieben und Lernmuster'
                    : 'Ograniczone informacje na temat preferencji użytkowników i wzorców uczenia się'}
                </li>
                <li>
                  {currentLanguage === 'de' 
                    ? 'Begrenzte personalisierte Empfehlungen für Folge- und ergänzende Kurse'
                    : 'Ograniczone spersonalizowane rekomendacje dla kursów uzupełniających i kontynuacyjnych'}
                </li>
              </ul>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Approach section */}
      <section className="py-24 bg-gray-50">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeInUp}
              custom={0}
            >
              <Badge className="bg-blue-100 text-blue-700 mb-4 py-1 px-3 rounded-full">
                {currentLanguage === 'de' ? 'Ansatz' : 'Podejście'}
              </Badge>
              <h2 className="text-3xl font-bold mb-6 tracking-tight">
                {currentLanguage === 'de' ? 'Unsere Strategie' : 'Nasza strategia'}
              </h2>
              <div className="prose prose-lg max-w-none text-gray-700">
                <p>
                  {currentLanguage === 'de' 
                    ? 'Nach einer gründlichen Bedarfsanalyse haben wir einen mehrschichtigen Ansatz entwickelt, um eine dynamische, KI-gestützte Empfehlungsplattform zu implementieren:'
                    : 'Po dogłębnej analizie potrzeb, opracowaliśmy wielowarstwowe podejście do wdrożenia dynamicznej platformy rekomendacji opartej na AI:'}
                </p>
                
                <div className="mt-6 space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <Code className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold mb-2">
                        {currentLanguage === 'de' ? 'Entwicklung eines hybriden KI-Modells' : 'Opracowanie hybrydowego modelu AI'}
                      </h3>
                      <p className="text-gray-700">
                        {currentLanguage === 'de' 
                          ? 'Wir haben ein maßgeschneidertes Empfehlungssystem entwickelt, das sowohl kollaboratives Filtern als auch inhaltsbasierte Empfehlungen nutzt, um Benutzerverhalten, Kursinhalte und Lernziele zu analysieren.'
                          : 'Opracowaliśmy niestandardowy system rekomendacji wykorzystujący zarówno filtrowanie współpracujące, jak i rekomendacje oparte na zawartości, w celu analizy zachowań użytkowników, treści kursów i celów edukacyjnych.'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <PieChart className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold mb-2">
                        {currentLanguage === 'de' ? 'Implementierung von Echtzeit-Datenanalysen' : 'Wdrożenie analiz danych w czasie rzeczywistym'}
                      </h3>
                      <p className="text-gray-700">
                        {currentLanguage === 'de' 
                          ? 'Integration von Echtzeit-Datenerfassung und -verarbeitung, um Benutzerpräferenzen umgehend zu aktualisieren und dynamisch wechselnde Interessen zu erkennen.'
                          : 'Integracja zbierania i przetwarzania danych w czasie rzeczywistym w celu natychmiastowej aktualizacji preferencji użytkowników i rozpoznawania dynamicznie zmieniających się zainteresowań.'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <Zap className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold mb-2">
                        {currentLanguage === 'de' ? 'Entwicklung einer nahtlosen Benutzeroberfläche' : 'Opracowanie płynnego interfejsu użytkownika'}
                      </h3>
                      <p className="text-gray-700">
                        {currentLanguage === 'de' 
                          ? 'Gestaltung einer intuitiven Benutzeroberfläche, die personalisierte Empfehlungen auf subtile und nicht aufdringliche Weise präsentiert, ohne dabei das Hauptlernerlebnis zu überwältigen.'
                          : 'Zaprojektowanie intuicyjnego interfejsu użytkownika, który przedstawia spersonalizowane rekomendacje w subtelny i nieinwazyjny sposób, nie przytłaczając głównego doświadczenia edukacyjnego.'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <RefreshCw className="w-5 h-5 text-amber-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold mb-2">
                        {currentLanguage === 'de' ? 'Implementierung von Feedback-Schleifen' : 'Wdrożenie pętli feedbacku'}
                      </h3>
                      <p className="text-gray-700">
                        {currentLanguage === 'de' 
                          ? 'Entwicklung von Mechanismen zur Erfassung expliziter und impliziter Nutzerfeedbacks, um kontinuierlich die Qualität der Empfehlungen zu verbessern und das System weiterzuentwickeln.'
                          : 'Opracowanie mechanizmów zbierania jawnych i niejawnych informacji zwrotnych od użytkowników w celu ciągłego ulepszania jakości rekomendacji i rozwoju systemu.'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
            
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeInRight}
              className="relative"
            >
              <div className="relative z-10 bg-white rounded-xl shadow-lg p-6 max-w-lg mx-auto">
                <div className="bg-indigo-50 rounded-lg p-4 mb-6">
                  <h3 className="text-lg font-bold text-indigo-800 mb-3">
                    {currentLanguage === 'de' ? 'Verwendete Technologien' : 'Wykorzystane technologie'}
                  </h3>
                  <ul className="grid grid-cols-2 gap-3">
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-indigo-600 rounded-full"></div>
                      <span className="text-gray-800">TensorFlow</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-indigo-600 rounded-full"></div>
                      <span className="text-gray-800">React.js</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-indigo-600 rounded-full"></div>
                      <span className="text-gray-800">Python (FastAPI)</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-indigo-600 rounded-full"></div>
                      <span className="text-gray-800">PostgreSQL</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-indigo-600 rounded-full"></div>
                      <span className="text-gray-800">Docker</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-indigo-600 rounded-full"></div>
                      <span className="text-gray-800">Redis</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-indigo-600 rounded-full"></div>
                      <span className="text-gray-800">OpenAI API</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-indigo-600 rounded-full"></div>
                      <span className="text-gray-800">AWS Lambda</span>
                    </li>
                  </ul>
                </div>
                
                <div className="relative rounded-lg overflow-hidden aspect-video mb-6">
                  <img 
                    src="https://images.unsplash.com/photo-1633613286991-611fe299c4be?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80" 
                    alt="AI model visualization"
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div className="bg-green-50 rounded-lg p-4">
                  <h3 className="text-lg font-bold text-green-800 mb-3">
                    {currentLanguage === 'de' ? 'Modellarchitektur-Highlights' : 'Główne cechy architektury modelu'}
                  </h3>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0 mr-3">
                        <Check className="h-3 w-3 text-green-600" />
                      </div>
                      <span className="text-gray-700">
                        {currentLanguage === 'de' ? 'Hybrides Filtersystem (kollaborativ + inhaltsbasiert)' : 'Hybrydowy system filtrowania (współpracujący + oparty na zawartości)'}
                      </span>
                    </li>
                    <li className="flex items-start">
                      <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0 mr-3">
                        <Check className="h-3 w-3 text-green-600" />
                      </div>
                      <span className="text-gray-700">
                        {currentLanguage === 'de' ? 'Deep-Learning-Komponenten für die Inhaltsanalyse' : 'Komponenty uczenia głębokiego do analizy treści'}
                      </span>
                    </li>
                    <li className="flex items-start">
                      <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0 mr-3">
                        <Check className="h-3 w-3 text-green-600" />
                      </div>
                      <span className="text-gray-700">
                        {currentLanguage === 'de' ? 'Echtzeit-Ereignisverarbeitung für sofortige Empfehlungen' : 'Przetwarzanie zdarzeń w czasie rzeczywistym dla natychmiastowych rekomendacji'}
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
              
              <div className="absolute -z-10 w-64 h-64 bg-gradient-to-br from-purple-300/30 to-indigo-300/30 rounded-full blur-3xl -top-10 -left-10"></div>
              <div className="absolute -z-10 w-64 h-64 bg-gradient-to-tr from-blue-300/30 to-indigo-400/30 rounded-full blur-3xl -bottom-10 -right-10"></div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Implementation section */}
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
              {currentLanguage === 'de' ? 'Implementierung' : 'Implementacja'}
            </Badge>
            <h2 className="text-3xl font-bold mb-6 tracking-tight">
              {currentLanguage === 'de' ? 'Der Entwicklungsprozess' : 'Proces rozwoju'}
            </h2>
            <div className="prose prose-lg max-w-none text-gray-700 mb-10">
              <p>
                {currentLanguage === 'de' 
                  ? 'Für dieses Projekt haben wir einen iterativen, agilen Entwicklungsansatz verfolgt, der aus mehreren Hauptphasen bestand:'
                  : 'W tym projekcie zastosowaliśmy iteracyjne, zwinne podejście do rozwoju, które składało się z kilku głównych faz:'}
              </p>
            </div>
          </motion.div>

          <div className="relative">
            <div className="absolute left-[27px] top-0 bottom-0 w-1 bg-blue-100"></div>
            
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeInUp}
              custom={1}
              className="flex gap-6 mb-12 relative"
            >
              <div className="w-14 h-14 bg-blue-600 rounded-full text-white flex items-center justify-center flex-shrink-0 z-10">
                <span className="font-bold text-lg">1</span>
              </div>
              <div className="pt-2 pb-4">
                <h3 className="text-xl font-bold mb-3">
                  {currentLanguage === 'de' ? 'Datenerhebung und -analyse' : 'Zbieranie i analiza danych'}
                </h3>
                <p className="text-gray-700 mb-4">
                  {currentLanguage === 'de' 
                    ? 'In der ersten Phase haben wir historische Lern- und Nutzerdaten gesammelt und analysiert, um erste Muster und Erkenntnisse zu gewinnen.'
                    : 'W pierwszej fazie zebraliśmy i przeanalizowaliśmy historyczne dane dotyczące nauki i użytkowników, aby uzyskać wstępne wzorce i spostrzeżenia.'}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                  <div>
                    <h4 className="font-bold text-sm text-gray-700 mb-2">
                      {currentLanguage === 'de' ? 'Analysierte Daten' : 'Analizowane dane'}
                    </h4>
                    <ul className="space-y-1">
                      <li className="flex items-center gap-2 text-sm text-gray-600">
                        <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                        <span>{currentLanguage === 'de' ? 'Kursabschlussraten' : 'Wskaźniki ukończenia kursów'}</span>
                      </li>
                      <li className="flex items-center gap-2 text-sm text-gray-600">
                        <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                        <span>{currentLanguage === 'de' ? 'Nutzungszeiten und -muster' : 'Czasy i wzorce użytkowania'}</span>
                      </li>
                      <li className="flex items-center gap-2 text-sm text-gray-600">
                        <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                        <span>{currentLanguage === 'de' ? 'Inhaltsinteraktionen' : 'Interakcje z treścią'}</span>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-gray-700 mb-2">
                      {currentLanguage === 'de' ? 'Verwendete Werkzeuge' : 'Użyte narzędzia'}
                    </h4>
                    <ul className="space-y-1">
                      <li className="flex items-center gap-2 text-sm text-gray-600">
                        <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                        <span>Python (Pandas, NumPy)</span>
                      </li>
                      <li className="flex items-center gap-2 text-sm text-gray-600">
                        <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                        <span>Jupyter Notebooks</span>
                      </li>
                      <li className="flex items-center gap-2 text-sm text-gray-600">
                        <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                        <span>PostgreSQL</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </motion.div>
            
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeInUp}
              custom={2}
              className="flex gap-6 mb-12 relative"
            >
              <div className="w-14 h-14 bg-blue-600 rounded-full text-white flex items-center justify-center flex-shrink-0 z-10">
                <span className="font-bold text-lg">2</span>
              </div>
              <div className="pt-2 pb-4">
                <h3 className="text-xl font-bold mb-3">
                  {currentLanguage === 'de' ? 'Modellentwicklung und -training' : 'Rozwój i trening modelu'}
                </h3>
                <p className="text-gray-700 mb-4">
                  {currentLanguage === 'de' 
                    ? 'Entwicklung und Schulung unseres hybriden Empfehlungsmodells unter Verwendung eines kollaborativen Filterungsansatzes, ergänzt durch inhaltsbasierte Empfehlungen.'
                    : 'Opracowanie i wytrenowanie naszego hybrydowego modelu rekomendacji przy użyciu podejścia filtrowania współpracującego, uzupełnionego o rekomendacje oparte na zawartości.'}
                </p>
                <div className="relative rounded-lg overflow-hidden aspect-video mb-4">
                  <img 
                    src="https://images.unsplash.com/photo-1620712943543-bcc4688e7485?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80" 
                    alt="Model development"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-bold text-gray-700 mb-2">
                    {currentLanguage === 'de' ? 'Wichtige Entwicklungsmeilensteine' : 'Kluczowe kamienie milowe rozwoju'}
                  </h4>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0 mr-3">
                        <Check className="h-3 w-3 text-green-600" />
                      </div>
                      <span className="text-gray-700 text-sm">
                        {currentLanguage === 'de' 
                          ? 'Entwicklung eines Basismodells mit 72% Vorhersagegenauigkeit für Kurspräferenzen'
                          : 'Opracowanie modelu bazowego z 72% dokładnością przewidywania preferencji kursów'}
                      </span>
                    </li>
                    <li className="flex items-start">
                      <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0 mr-3">
                        <Check className="h-3 w-3 text-green-600" />
                      </div>
                      <span className="text-gray-700 text-sm">
                        {currentLanguage === 'de' 
                          ? 'Optimierung durch A/B-Tests, was zu einer Verbesserung der Modellleistung um 24% führte'
                          : 'Optymalizacja poprzez testy A/B, co doprowadziło do 24% poprawy wydajności modelu'}
                      </span>
                    </li>
                    <li className="flex items-start">
                      <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0 mr-3">
                        <Check className="h-3 w-3 text-green-600" />
                      </div>
                      <span className="text-gray-700 text-sm">
                        {currentLanguage === 'de' 
                          ? 'Integration von NLP-Funktionen zur Analyse von Kursinhalten und Benutzerrezensionen'
                          : 'Integracja funkcji NLP do analizy treści kursów i recenzji użytkowników'}
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </motion.div>
            
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeInUp}
              custom={3}
              className="flex gap-6 mb-12 relative"
            >
              <div className="w-14 h-14 bg-blue-600 rounded-full text-white flex items-center justify-center flex-shrink-0 z-10">
                <span className="font-bold text-lg">3</span>
              </div>
              <div className="pt-2 pb-4">
                <h3 className="text-xl font-bold mb-3">
                  {currentLanguage === 'de' ? 'API-Entwicklung und Backend-Integration' : 'Rozwój API i integracja backendu'}
                </h3>
                <p className="text-gray-700 mb-4">
                  {currentLanguage === 'de' 
                    ? 'Entwicklung einer skalierbaren API-Infrastruktur für Echtzeit-Empfehlungen und nahtlose Integration mit der bestehenden Plattform.'
                    : 'Opracowanie skalowalnej infrastruktury API dla rekomendacji w czasie rzeczywistym i bezproblemowej integracji z istniejącą platformą.'}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-bold text-sm text-gray-700 mb-2">
                      {currentLanguage === 'de' ? 'API-Architektur' : 'Architektura API'}
                    </h4>
                    <ul className="space-y-1">
                      <li className="flex items-center gap-2 text-sm text-gray-600">
                        <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                        <span>RESTful API (FastAPI)</span>
                      </li>
                      <li className="flex items-center gap-2 text-sm text-gray-600">
                        <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                        <span>{currentLanguage === 'de' ? 'Mikrodienste-Architektur' : 'Architektura mikroserwisowa'}</span>
                      </li>
                      <li className="flex items-center gap-2 text-sm text-gray-600">
                        <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                        <span>{currentLanguage === 'de' ? 'Docker-Container' : 'Kontenery Docker'}</span>
                      </li>
                    </ul>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-bold text-sm text-gray-700 mb-2">
                      {currentLanguage === 'de' ? 'Integrierte Systeme' : 'Zintegrowane systemy'}
                    </h4>
                    <ul className="space-y-1">
                      <li className="flex items-center gap-2 text-sm text-gray-600">
                        <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                        <span>{currentLanguage === 'de' ? 'Benutzerauthentifizierungssystem' : 'System uwierzytelniania użytkowników'}</span>
                      </li>
                      <li className="flex items-center gap-2 text-sm text-gray-600">
                        <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                        <span>{currentLanguage === 'de' ? 'Kurskatalog-Datenbank' : 'Baza danych katalogu kursów'}</span>
                      </li>
                      <li className="flex items-center gap-2 text-sm text-gray-600">
                        <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                        <span>{currentLanguage === 'de' ? 'Analytiksystem' : 'System analityczny'}</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </motion.div>
            
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeInUp}
              custom={4}
              className="flex gap-6 relative"
            >
              <div className="w-14 h-14 bg-blue-600 rounded-full text-white flex items-center justify-center flex-shrink-0 z-10">
                <span className="font-bold text-lg">4</span>
              </div>
              <div className="pt-2">
                <h3 className="text-xl font-bold mb-3">
                  {currentLanguage === 'de' ? 'Frontend-Design und Benutzeroberfläche' : 'Projektowanie frontendu i interfejsu użytkownika'}
                </h3>
                <p className="text-gray-700 mb-4">
                  {currentLanguage === 'de' 
                    ? 'Gestaltung und Implementierung einer intuitiven, reaktionsschnellen Benutzeroberfläche für die Anzeige personalisierter Empfehlungen.'
                    : 'Zaprojektowanie i wdrożenie intuicyjnego, responsywnego interfejsu użytkownika do wyświetlania spersonalizowanych rekomendacji.'}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="aspect-video rounded-lg overflow-hidden relative">
                    <img 
                      src="https://images.unsplash.com/photo-1496171367470-9ed9a91ea931?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80" 
                      alt="Platform UI - Before"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-0 inset-x-0 bg-white bg-opacity-80 py-2 text-center">
                      <span className="text-sm font-medium text-gray-700">{currentLanguage === 'de' ? 'Vorher' : 'Przed'}</span>
                    </div>
                  </div>
                  <div className="aspect-video rounded-lg overflow-hidden relative">
                    <img 
                      src="https://images.unsplash.com/photo-1551739440-5dd934d3a94a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80" 
                      alt="Platform UI - After"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-0 inset-x-0 bg-white bg-opacity-80 py-2 text-center">
                      <span className="text-sm font-medium text-gray-700">{currentLanguage === 'de' ? 'Nachher' : 'Po'}</span>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-bold text-gray-700 mb-2">
                    {currentLanguage === 'de' ? 'UI/UX-Verbesserungen' : 'Ulepszenia UI/UX'}
                  </h4>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0 mr-3">
                        <Check className="h-3 w-3 text-green-600" />
                      </div>
                      <span className="text-gray-700 text-sm">
                        {currentLanguage === 'de' 
                          ? 'Personalisierte Dashboards mit anpassbaren Empfehlungsabschnitten'
                          : 'Spersonalizowane pulpity z konfigurowalnymi sekcjami rekomendacji'}
                      </span>
                    </li>
                    <li className="flex items-start">
                      <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0 mr-3">
                        <Check className="h-3 w-3 text-green-600" />
                      </div>
                      <span className="text-gray-700 text-sm">
                        {currentLanguage === 'de' 
                          ? 'Kontextbezogene Empfehlungen, die während des Lernprozesses dynamisch angezeigt werden'
                          : 'Kontekstowe rekomendacje wyświetlane dynamicznie podczas procesu nauki'}
                      </span>
                    </li>
                    <li className="flex items-start">
                      <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0 mr-3">
                        <Check className="h-3 w-3 text-green-600" />
                      </div>
                      <span className="text-gray-700 text-sm">
                        {currentLanguage === 'de' 
                          ? 'Implementierung von Erklärbarkeitsfeatures („Empfohlen, weil...")'
                          : 'Implementacja funkcji wyjaśnialności ("Polecane, ponieważ...")'}
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </motion.div>
          </div>
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
              {currentLanguage === 'de' ? 'Messbarer Einfluss' : 'Mierzalny wpływ'}
            </h2>
            <div className="prose prose-lg max-w-none text-gray-700 mb-10">
              <p>
                {currentLanguage === 'de' 
                  ? 'Nach einer dreimonatigen Implementierung und kontinuierlichen Verbesserung des KI-Empfehlungssystems verzeichnete Tech Solutions Polska erhebliche Verbesserungen in mehreren Schlüsselbereichen:'
                  : 'Po trzech miesiącach wdrażania i ciągłego ulepszania systemu rekomendacji AI, Tech Solutions Polska doświadczyło znacznej poprawy w kilku kluczowych obszarach:'}
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
              <h3 className="text-5xl font-bold text-primary mb-4">+78%</h3>
              <p className="text-gray-700 font-medium">
                {currentLanguage === 'de' ? 'Steigerung des Nutzerengagements' : 'Wzrost zaangażowania użytkowników'}
              </p>
              <p className="text-gray-500 text-sm mt-2">
                {currentLanguage === 'de' ? 'Gemessen an der durchschnittlichen Verweildauer' : 'Mierzone średnim czasem spędzonym na platformie'}
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
              <h3 className="text-5xl font-bold text-green-600 mb-4">+142%</h3>
              <p className="text-gray-700 font-medium">
                {currentLanguage === 'de' ? 'Steigerung der Kursabschlussrate' : 'Wzrost wskaźnika ukończenia kursów'}
              </p>
              <p className="text-gray-500 text-sm mt-2">
                {currentLanguage === 'de' ? 'Von 23% auf 56%' : 'Z 23% do 56%'}
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
              <h3 className="text-5xl font-bold text-blue-600 mb-4">+35%</h3>
              <p className="text-gray-700 font-medium">
                {currentLanguage === 'de' ? 'Steigerung der durchschnittlichen Kursanmeldungen' : 'Wzrost średniej liczby zapisów na kursy'}
              </p>
              <p className="text-gray-500 text-sm mt-2">
                {currentLanguage === 'de' ? 'Pro Benutzer und Monat' : 'Na użytkownika miesięcznie'}
              </p>
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
            <div className="bg-white rounded-xl p-8 shadow-sm">
              <h3 className="text-xl font-bold mb-4">
                {currentLanguage === 'de' ? 'Weitere Geschäftsvorteile' : 'Dodatkowe korzyści biznesowe'}
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0 mr-3">
                    <Check className="h-3 w-3 text-green-600" />
                  </div>
                  <span className="text-gray-700">
                    {currentLanguage === 'de' 
                      ? '48% Steigerung der Kundenbindungsrate über einen Zeitraum von drei Monaten'
                      : '48% wzrost wskaźnika utrzymania klientów w okresie trzech miesięcy'}
                  </span>
                </li>
                <li className="flex items-start">
                  <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0 mr-3">
                    <Check className="h-3 w-3 text-green-600" />
                  </div>
                  <span className="text-gray-700">
                    {currentLanguage === 'de' 
                      ? '29% Steigerung der Abonnementverlängerungen für Premium-Kurspakete'
                      : '29% wzrost odnowień subskrypcji dla pakietów kursów premium'}
                  </span>
                </li>
                <li className="flex items-start">
                  <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0 mr-3">
                    <Check className="h-3 w-3 text-green-600" />
                  </div>
                  <span className="text-gray-700">
                    {currentLanguage === 'de' 
                      ? 'Erschließung von 18% mehr Kursinhalt, der zuvor wenig genutzt wurde'
                      : 'Odkrycie o 18% więcej treści kursów, które wcześniej były mało wykorzystywane'}
                  </span>
                </li>
              </ul>
            </div>
            
            <div className="bg-white rounded-xl p-8 shadow-sm">
              <h3 className="text-xl font-bold mb-4">
                {currentLanguage === 'de' ? 'Technische Leistung' : 'Wydajność techniczna'}
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0 mr-3">
                    <Check className="h-3 w-3 text-green-600" />
                  </div>
                  <span className="text-gray-700">
                    {currentLanguage === 'de' 
                      ? '92% Vorhersagegenauigkeit bei Kurspräferenzen nach der Feinabstimmung'
                      : '92% dokładność przewidywania preferencji kursów po dostrojeniu'}
                  </span>
                </li>
                <li className="flex items-start">
                  <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0 mr-3">
                    <Check className="h-3 w-3 text-green-600" />
                  </div>
                  <span className="text-gray-700">
                    {currentLanguage === 'de' 
                      ? 'Durchschnittliche Reaktionszeit der API von 120ms für Empfehlungen in Echtzeit'
                      : 'Średni czas odpowiedzi API 120ms dla rekomendacji w czasie rzeczywistym'}
                  </span>
                </li>
                <li className="flex items-start">
                  <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0 mr-3">
                    <Check className="h-3 w-3 text-green-600" />
                  </div>
                  <span className="text-gray-700">
                    {currentLanguage === 'de' 
                      ? 'Erfolgreiche Skalierung auf über 50.000 gleichzeitige Benutzer ohne Leistungseinbußen'
                      : 'Pomyślne skalowanie do ponad 50 000 jednoczesnych użytkowników bez utraty wydajności'}
                  </span>
                </li>
              </ul>
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
                  ? 'Das von ECM Digital entwickelte KI-Empfehlungssystem hat unsere Lernplattform revolutioniert. Die tiefgreifende technische Expertise des Teams in Kombination mit ihrem nuancierten Verständnis von Benutzerbedürfnissen hat zu einem bemerkenswerten Anstieg des Engagements und der Abschlussraten geführt. Die nahtlose Integration und der skalierbaren Architektur ermöglichen es uns, kontinuierlich zu wachsen und unseren Benutzern ein wirklich personalisiertes Lernerlebnis zu bieten.'
                  : 'System rekomendacji AI opracowany przez ECM Digital zrewolucjonizował naszą platformę edukacyjną. Głęboka wiedza techniczna zespołu w połączeniu z niuansowym zrozumieniem potrzeb użytkowników doprowadziła do niezwykłego wzrostu zaangażowania i wskaźników ukończenia. Bezproblemowa integracja i skalowalna architektura pozwalają nam stale się rozwijać i zapewniać użytkownikom prawdziwie spersonalizowane doświadczenie edukacyjne.'}
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full bg-gray-200 mr-4"></div>
                <div>
                  <p className="font-bold">Adam Nowak</p>
                  <p className="text-gray-500 text-sm">{currentLanguage === 'de' ? 'CTO, Tech Solutions Polska' : 'CTO, Tech Solutions Polska'}</p>
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
                  {currentLanguage === 'de' ? 'Nutzen Sie die Leistungsfähigkeit von KI für Ihr Unternehmen' : 'Wykorzystaj moc AI w swojej firmie'}
                </h2>
                <p className="text-gray-600 mb-8">
                  {currentLanguage === 'de' 
                    ? 'Kontaktieren Sie uns noch heute, um zu besprechen, wie wir mit maßgeschneiderten KI-Lösungen zum Erfolg Ihres Unternehmens beitragen können.'
                    : 'Skontaktuj się z nami już dziś, aby omówić, jak możemy przyczynić się do sukcesu Twojej firmy dzięki niestandardowym rozwiązaniom AI.'}
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link href="/services">
                    <Button className="rounded-full bg-primary hover:bg-primary/90 text-white py-2 px-8 flex items-center gap-2 group">
                      {currentLanguage === 'de' ? 'Unsere KI-Dienste erkunden' : 'Poznaj nasze usługi AI'}
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
                  <h3 className="text-xl font-bold mb-4">{currentLanguage === 'de' ? 'Unsere KI-Dienste' : 'Nasze usługi AI'}</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0">
                        <Check className="h-3 w-3 text-green-600" />
                      </div>
                      <span className="text-gray-700">{currentLanguage === 'de' ? 'Maßgeschneiderte KI-Integrationen' : 'Niestandardowe integracje AI'}</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0">
                        <Check className="h-3 w-3 text-green-600" />
                      </div>
                      <span className="text-gray-700">{currentLanguage === 'de' ? 'KI-gestützte Automatisierung' : 'Automatyzacja wspierana przez AI'}</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0">
                        <Check className="h-3 w-3 text-green-600" />
                      </div>
                      <span className="text-gray-700">{currentLanguage === 'de' ? 'Intelligente Datenanalyse' : 'Inteligentna analiza danych'}</span>
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
            <Link href="/case-studies/1">
              <motion.div 
                className="bg-white rounded-xl overflow-hidden shadow-md transition-all duration-300 hover:-translate-y-2 hover:shadow-lg"
                whileHover={{ scale: 1.02 }}
              >
                <div className="h-48 bg-blue-100 relative">
                  <div className="absolute inset-0 bg-gradient-to-tr from-primary/30 to-secondary/30 mix-blend-multiply"></div>
                  <div className="absolute bottom-4 left-4">
                    <Badge className="bg-white/80 text-primary">{t('home.caseStudyTypes.ecommerce')}</Badge>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">{t('home.caseStudiesItems.example1.title')}</h3>
                  <p className="text-gray-500 mb-4 text-sm">{t('home.caseStudiesItems.example1.client')}</p>
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-green-600 font-medium">+156% {t('home.conversion')}</span>
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

export default CaseStudyTwo;