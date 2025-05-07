import React from 'react';
import { useTranslation } from 'react-i18next';
import { Badge } from '@/components/ui/badge';
import { 
  LinkedinIcon, 
  GithubIcon, 
  Globe, 
  Mail,
  ArrowRight,
  CheckCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Layout from '@/components/Layout';
import { motion } from 'framer-motion';

// Import team member images
import marioImage from '@/assets/mario.png';
import michalImage from '@/assets/michal.png';
import tomaszImage from '@/assets/tomasz.png';

const AboutPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const currentLanguage = i18n.language;
  
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6 }
    }
  };
  
  const teamMembers = [
    {
      name: "Tomasz Gnat",
      role: currentLanguage === 'de' ? "UX Designer & Gründer" : "UX Designer & Założyciel",
      imageSrc: tomaszImage,
      description: currentLanguage === 'de' 
        ? "Experte für nutzerzentriertes Design und Conversion-Optimierung. Über 10 Jahre Erfahrung in der Gestaltung digitaler Erlebnisse." 
        : "Ekspert w zakresie projektowania zorientowanego na użytkownika i optymalizacji konwersji. Ponad 10 lat doświadczenia w projektowaniu doświadczeń cyfrowych.",
      linkedin: "https://linkedin.com/in/tomaszgnat",
      github: "https://github.com/tomaszgnat",
      website: "https://ecm-digital.com"
    },
    {
      name: "Mario Rifaat",
      role: currentLanguage === 'de' ? "Client Partner" : "Client Partner",
      imageSrc: marioImage,
      description: currentLanguage === 'de' 
        ? "Erfahrener Client Partner mit Fokus auf strategische Kundenbeziehungen und Projektmanagement. Spezialisiert auf die Verbindung von technischen Lösungen mit Geschäftszielen." 
        : "Doświadczony Client Partner skupiający się na strategicznych relacjach z klientami i zarządzaniu projektami. Specjalizuje się w łączeniu rozwiązań technicznych z celami biznesowymi.",
      linkedin: "https://www.linkedin.com/in/mario-rifaat-4b8460164/",
      github: "https://github.com/mariorifaat",
      website: "https://ecm-digital.com"
    },
    {
      name: "Michał Bieguszewski",
      role: currentLanguage === 'de' ? "Head of Design" : "Head of Design",
      imageSrc: michalImage,
      description: currentLanguage === 'de' 
        ? "Erfahrener Design-Leiter mit Hintergrund in UX/UI und digitalen Produkten. Spezialisiert auf die Erstellung benutzerfreundlicher, ästhetisch ansprechender und effektiver Designlösungen." 
        : "Doświadczony kierownik ds. designu z doświadczeniem w UX/UI i produktach cyfrowych. Specjalizuje się w tworzeniu przyjaznych dla użytkownika, estetycznych i skutecznych rozwiązań projektowych.",
      linkedin: "https://www.linkedin.com/in/bieguszewski/",
      github: "https://github.com/michalbieguszewski",
      website: "https://ecm-digital.com"
    }
  ];

  const companyStats = [
    {
      number: "10+",
      label: currentLanguage === 'de' ? "Jahre Erfahrung" : "Lat doświadczenia"
    },
    {
      number: "120+",
      label: currentLanguage === 'de' ? "Abgeschlossene Projekte" : "Ukończonych projektów"
    },
    {
      number: "96%",
      label: currentLanguage === 'de' ? "Kundenzufriedenheit" : "Zadowolonych klientów"
    },
    {
      number: "3",
      label: currentLanguage === 'de' ? "Spezialisierte Experten" : "Wyspecjalizowanych ekspertów"
    }
  ];

  const achievements = [
    {
      icon: "🏆",
      title: currentLanguage === 'de' ? "Top 10 E-Commerce Anbieter 2023" : "Top 10 Dostawców E-Commerce 2023",
      description: currentLanguage === 'de' 
        ? "Ausgezeichnet als einer der führenden E-Commerce-Dienstleister in Polen." 
        : "Wyróżnienie jako jeden z wiodących dostawców usług e-commerce w Polsce."
    },
    {
      icon: "🚀",
      title: currentLanguage === 'de' ? "50+ Startups unterstützt" : "Wsparcie dla 50+ startupów",
      description: currentLanguage === 'de' 
        ? "Wir haben über 50 Startups bei ihrem Wachstum und ihrer digitalen Präsenz unterstützt." 
        : "Pomogliśmy ponad 50 startupom w ich rozwoju i obecności cyfrowej."
    },
    {
      icon: "💡",
      title: currentLanguage === 'de' ? "15+ Branchen bedient" : "Obsługa 15+ branż",
      description: currentLanguage === 'de' 
        ? "Erfahrung in verschiedenen Branchen, von E-Commerce bis zu Finanzdienstleistungen." 
        : "Doświadczenie w różnych branżach, od e-commerce po usługi finansowe."
    }
  ];

  const values = [
    {
      title: currentLanguage === 'de' ? "Innovation" : "Innowacyjność",
      description: currentLanguage === 'de' 
        ? "Wir erforschen ständig neue Technologien und Ansätze, um die wirksamsten digitalen Lösungen zu entwickeln." 
        : "Nieustannie eksplorujemy nowe technologie i podejścia, aby tworzyć najbardziej efektywne rozwiązania cyfrowe."
    },
    {
      title: currentLanguage === 'de' ? "Qualität" : "Jakość",
      description: currentLanguage === 'de' 
        ? "Bei allem, was wir tun, setzen wir auf höchste Qualität und die Einhaltung bewährter Branchenstandards." 
        : "We wszystkim, co robimy, stawiamy na najwyższą jakość i przestrzeganie sprawdzonych standardów branżowych."
    },
    {
      title: currentLanguage === 'de' ? "Zusammenarbeit" : "Współpraca",
      description: currentLanguage === 'de' 
        ? "Wir glauben an die Kraft der Zusammenarbeit und arbeiten eng mit unseren Kunden zusammen, um echten Mehrwert zu schaffen." 
        : "Wierzymy w siłę współpracy i blisko współpracujemy z naszymi klientami, aby tworzyć prawdziwą wartość."
    },
    {
      title: currentLanguage === 'de' ? "Transparenz" : "Transparentność",
      description: currentLanguage === 'de' 
        ? "Wir stehen für offene Kommunikation und halten unsere Kunden während des gesamten Projekts auf dem Laufenden." 
        : "Stawiamy na otwartą komunikację i informujemy naszych klientów na bieżąco przez cały czas trwania projektu."
    }
  ];

  return (
    <Layout>
      {/* Hero section */}
      <section className="py-20 md:py-32 bg-gradient-to-b from-white to-gray-50">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div 
              className="max-w-2xl" 
              initial="hidden"
              animate="visible"
              variants={fadeIn}
            >
              <Badge className="bg-primary/10 text-primary mb-6 py-1.5 px-4 rounded-full text-sm font-medium">
                {currentLanguage === 'de' ? 'Über uns' : 'O nas'}
              </Badge>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 tracking-tight leading-tight">
                {currentLanguage === 'de' 
                  ? 'Wir erschaffen digitale Lösungen, die Ergebnisse liefern' 
                  : 'Tworzymy cyfrowe rozwiązania, które przynoszą rezultaty'}
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                {currentLanguage === 'de' 
                  ? 'ECM Digital ist eine Agentur, die sich auf die Entwicklung effektiver und innovativer digitaler Lösungen für Unternehmen jeder Größe spezialisiert hat. Mit einem Fokus auf UX Design, Web-Entwicklung und KI-Integration helfen wir Ihnen, Ihre digitalen Ziele zu erreichen.' 
                  : 'ECM Digital to agencja specjalizująca się w tworzeniu skutecznych i innowacyjnych rozwiązań cyfrowych dla firm każdej wielkości. Skupiając się na projektowaniu UX, tworzeniu stron internetowych i integracji AI, pomagamy osiągać cyfrowe cele.'}
              </p>
              <div className="flex flex-wrap gap-4">
                <Button className="rounded-full bg-primary hover:bg-primary/90 text-white py-2 px-8 flex items-center gap-2 group">
                  {currentLanguage === 'de' ? 'Unsere Dienste erkunden' : 'Poznaj nasze usługi'}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button variant="outline" className="rounded-full py-2 px-8">
                  {currentLanguage === 'de' ? 'Kontakt aufnehmen' : 'Skontaktuj się'}
                </Button>
              </div>
            </motion.div>
            <motion.div 
              className="relative hidden lg:block aspect-square"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-purple-600/20 rounded-3xl transform rotate-6"></div>
              <div className="absolute inset-0 bg-white rounded-3xl shadow-xl overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2340&q=80" 
                  alt="ECM Digital Team"
                  className="w-full h-full object-cover"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats section */}
      <section className="py-16 bg-white">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {companyStats.map((stat, index) => (
              <motion.div 
                key={index}
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                <p className="text-4xl md:text-5xl font-bold text-primary mb-2">{stat.number}</p>
                <p className="text-gray-600">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Story section */}
      <section className="py-24 bg-gray-50">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <Badge className="bg-secondary/10 text-secondary mb-6 py-1.5 px-4 rounded-full text-sm font-medium">
                {currentLanguage === 'de' ? 'Unsere Geschichte' : 'Nasza historia'}
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 tracking-tight">
                {currentLanguage === 'de' ? 'Von der Vision zur digitalen Exzellenz' : 'Od wizji do cyfrowej doskonałości'}
              </h2>
              <div className="space-y-6 text-gray-600">
                <p>
                  {currentLanguage === 'de' 
                    ? 'ECM Digital wurde 2017 mit der Vision gegründet, die Lücke zwischen Design und Technologie zu schließen. Wir begannen als kleine Gruppe leidenschaftlicher Fachleute mit dem Ziel, digitale Produkte zu entwickeln, die nicht nur gut aussehen, sondern auch geschäftliche Herausforderungen lösen.' 
                    : 'ECM Digital zostało założone w 2017 roku z wizją wypełnienia luki między designem a technologią. Zaczynaliśmy jako mała grupa pasjonatów z celem tworzenia cyfrowych produktów, które nie tylko dobrze wyglądają, ale przede wszystkim rozwiązują wyzwania biznesowe.'}
                </p>
                <p>
                  {currentLanguage === 'de' 
                    ? 'Im Laufe der Jahre haben wir unser Team erweitert und unser Angebot diversifiziert, um den sich wandelnden Bedürfnissen des digitalen Marktes gerecht zu werden. Heute sind wir stolz darauf, eine Vielzahl von Dienstleistungen anzubieten, von UX/UI-Design über Webentwicklung bis hin zu KI-Integration und Marketing.' 
                    : 'Na przestrzeni lat rozszerzyliśmy nasz zespół i zdywersyfikowaliśmy ofertę, aby sprostać zmieniającym się potrzebom cyfrowego rynku. Dziś z dumą oferujemy szeroki zakres usług, od projektowania UX/UI, przez tworzenie stron internetowych, po integrację AI i marketing.'}
                </p>
                <p>
                  {currentLanguage === 'de' 
                    ? 'Unser Engagement für Qualität und Kundenzufriedenheit hat uns zu einem vertrauenswürdigen Partner für Unternehmen gemacht, die ihre digitale Präsenz stärken und ihre Geschäftsziele erreichen wollen.' 
                    : 'Nasze zaangażowanie w jakość i zadowolenie klientów uczyniło nas zaufanym partnerem dla firm, które chcą wzmocnić swoją obecność cyfrową i osiągnąć swoje cele biznesowe.'}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-6">
              {achievements.map((achievement, index) => (
                <div key={index} className="bg-white p-8 rounded-xl shadow-sm">
                  <div className="text-4xl mb-4">{achievement.icon}</div>
                  <h3 className="text-xl font-semibold mb-3">{achievement.title}</h3>
                  <p className="text-gray-600">{achievement.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision section */}
      <section className="py-24 bg-white">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div className="bg-gray-50 rounded-2xl p-10">
              <h2 className="text-2xl md:text-3xl font-bold mb-6 text-primary">
                {currentLanguage === 'de' ? 'Unsere Mission' : 'Nasza misja'}
              </h2>
              <p className="text-gray-600 mb-6 text-lg">
                {currentLanguage === 'de' 
                  ? 'Wir bei ECM Digital haben es uns zur Aufgabe gemacht, Unternehmen durch effektive digitale Lösungen zum Erfolg zu verhelfen. Wir glauben, dass gut gestaltete digitale Erlebnisse, die auf soliden UX-Prinzipien und Datenanalysen basieren, messbare Ergebnisse für Unternehmen jeder Größe liefern können.' 
                  : 'W ECM Digital naszą misją jest pomaganie firmom w osiągnięciu sukcesu poprzez efektywne rozwiązania cyfrowe. Wierzymy, że dobrze zaprojektowane doświadczenia cyfrowe, oparte na solidnych zasadach UX i analizie danych, mogą przynieść wymierne rezultaty dla firm każdej wielkości.'}
              </p>
              <div className="space-y-4">
                {[
                  currentLanguage === 'de' ? 'Nutzerorientierte Lösungen schaffen' : 'Tworzenie rozwiązań zorientowanych na użytkownika',
                  currentLanguage === 'de' ? 'Innovation und Kreativität fördern' : 'Wspieranie innowacji i kreatywności',
                  currentLanguage === 'de' ? 'Datengestützte Entscheidungen treffen' : 'Podejmowanie decyzji w oparciu o dane'
                ].map((item, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <p className="text-gray-700">{item}</p>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-2xl p-10">
              <h2 className="text-2xl md:text-3xl font-bold mb-6 text-secondary">
                {currentLanguage === 'de' ? 'Unsere Vision' : 'Nasza wizja'}
              </h2>
              <p className="text-gray-600 mb-6 text-lg">
                {currentLanguage === 'de' 
                  ? 'Unsere Vision ist es, ein führender Innovator im Bereich digitaler Lösungen zu sein, der die neuesten Technologien wie KI, Machine Learning und Datenanalyse nutzt, um Unternehmen zu transformieren und in der digitalen Landschaft voranzubringen.' 
                  : 'Naszą wizją jest bycie wiodącym innowatorem w obszarze rozwiązań cyfrowych, wykorzystującym najnowsze technologie, takie jak AI, machine learning i analiza danych, aby transformować firmy i prowadzić je do przodu w cyfrowym krajobrazie.'}
              </p>
              <div className="space-y-4">
                {[
                  currentLanguage === 'de' ? 'Technologische Grenzen verschieben' : 'Przesuwanie granic technologicznych',
                  currentLanguage === 'de' ? 'Branchenübergreifende Zusammenarbeit fördern' : 'Wspieranie współpracy międzybranżowej',
                  currentLanguage === 'de' ? 'Nachhaltige digitale Lösungen entwickeln' : 'Rozwijanie zrównoważonych rozwiązań cyfrowych'
                ].map((item, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-secondary mt-0.5 flex-shrink-0" />
                    <p className="text-gray-700">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values section */}
      <section className="py-24 bg-gray-50">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <Badge className="bg-secondary/10 text-secondary mb-4 py-1.5 px-4 rounded-full text-sm font-medium">
              {currentLanguage === 'de' ? 'Unsere Werte' : 'Nasze wartości'}
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 tracking-tight">
              {currentLanguage === 'de' ? 'Was leitet uns' : 'Co nas prowadzi'}
            </h2>
            <p className="text-xl text-gray-600">
              {currentLanguage === 'de' 
                ? 'Diese Grundprinzipien definieren, wie wir arbeiten und mit unseren Kunden umgehen.' 
                : 'Te podstawowe zasady definiują, jak pracujemy i jak współpracujemy z naszymi klientami.'}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {values.map((value, index) => (
              <motion.div 
                key={index} 
                className="bg-white p-10 rounded-xl shadow-sm"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-6 text-primary">
                  {index + 1}
                </div>
                <h3 className="text-xl font-semibold mb-3">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team section */}
      <section className="py-24 bg-white">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <Badge className="bg-primary/10 text-primary mb-4 py-1.5 px-4 rounded-full text-sm font-medium">
              {currentLanguage === 'de' ? 'Unser Team' : 'Nasz zespół'}
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 tracking-tight">
              {currentLanguage === 'de' ? 'Die Gesichter hinter ECM Digital' : 'Twarze za ECM Digital'}
            </h2>
            <p className="text-xl text-gray-600">
              {currentLanguage === 'de' 
                ? 'Lernen Sie die Experten kennen, die Ihre digitalen Projekte zum Leben erwecken.' 
                : 'Poznaj ekspertów, którzy ożywiają Twoje cyfrowe projekty.'}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {teamMembers.map((member, index) => (
              <motion.div 
                key={index} 
                className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                <div className="h-72 bg-gray-100 relative overflow-hidden">
                  <img 
                    src={member.imageSrc} 
                    alt={member.name} 
                    className="w-full h-full object-cover object-center transition-transform hover:scale-105 duration-500"
                  />
                </div>
                <div className="p-8">
                  <h3 className="text-xl font-bold mb-1">{member.name}</h3>
                  <p className="text-primary mb-4">{member.role}</p>
                  <p className="text-gray-600 mb-6">{member.description}</p>
                  
                  <div className="flex space-x-3">
                    <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 hover:bg-blue-100 transition-colors">
                      <LinkedinIcon className="h-5 w-5" />
                    </a>
                    <a href={member.github} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-700 hover:bg-gray-200 transition-colors">
                      <GithubIcon className="h-5 w-5" />
                    </a>
                    <a href={member.website} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-green-600 hover:bg-green-100 transition-colors">
                      <Globe className="h-5 w-5" />
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA section */}
      <section className="py-24 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="container max-w-5xl mx-auto px-4 text-center">
          <Badge className="bg-secondary/10 text-secondary mb-4 py-1.5 px-4 rounded-full text-sm font-medium inline-block">
            {currentLanguage === 'de' ? 'Bereit loszulegen?' : 'Gotowy do rozpoczęcia?'}
          </Badge>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 tracking-tight">
            {currentLanguage === 'de' ? 'Lassen Sie uns gemeinsam etwas Großartiges schaffen' : 'Stwórzmy razem coś wspaniałego'}
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10">
            {currentLanguage === 'de' 
              ? 'Kontaktieren Sie uns noch heute, um zu besprechen, wie wir Ihnen bei der Verwirklichung Ihrer digitalen Vision helfen können.' 
              : 'Skontaktuj się z nami już dziś, aby omówić, jak możemy pomóc Ci w realizacji Twojej cyfrowej wizji.'}
          </p>
          
          <div className="flex flex-wrap gap-4 justify-center">
            <Button className="rounded-full bg-primary hover:bg-primary/90 text-white py-2 px-8 flex items-center gap-2 group">
              {currentLanguage === 'de' ? 'Kontakt aufnehmen' : 'Skontaktuj się'}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button variant="outline" className="rounded-full py-2 px-8">
              {currentLanguage === 'de' ? 'Unsere Dienste erkunden' : 'Poznaj nasze usługi'}
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default AboutPage;