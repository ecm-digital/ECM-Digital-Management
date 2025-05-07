import React from 'react';
import { useTranslation } from 'react-i18next';
import { Badge } from '@/components/ui/badge';
import { 
  LinkedinIcon, 
  GithubIcon, 
  Globe, 
  Mail
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Layout from '@/components/Layout';

const AboutPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const currentLanguage = i18n.language;
  
  const teamMembers = [
    {
      name: "Tomasz Gnat",
      role: currentLanguage === 'de' ? "UX Designer & Gründer" : "UX Designer & Założyciel",
      imageSrc: "https://ui-avatars.com/api/?name=Tomasz+Gnat&background=0D8ABC&color=fff&size=512",
      description: currentLanguage === 'de' 
        ? "Experte für nutzerzentriertes Design und Conversion-Optimierung. Über 10 Jahre Erfahrung in der Gestaltung digitaler Erlebnisse." 
        : "Ekspert w zakresie projektowania zorientowanego na użytkownika i optymalizacji konwersji. Ponad 10 lat doświadczenia w projektowaniu doświadczeń cyfrowych.",
      linkedin: "https://linkedin.com/in/tomaszgnat",
      github: "https://github.com/tomaszgnat",
      website: "https://ecm-digital.com"
    },
    {
      name: "Mario Rifaat",
      role: currentLanguage === 'de' ? "Entwickler & AI-Spezialist" : "Developer & Specjalista AI",
      imageSrc: "https://ui-avatars.com/api/?name=Mario+Rifaat&background=6366F1&color=fff&size=512",
      description: currentLanguage === 'de' 
        ? "Full-Stack-Entwickler mit Schwerpunkt auf innovative Webentwicklung und KI-Integration. Erfolgreich beim Erstellen skalierbarer Lösungen." 
        : "Full-stack developer specjalizujący się w innowacyjnych rozwiązaniach webowych i integracji AI. Specjalista od tworzenia skalowalnych rozwiązań.",
      linkedin: "https://linkedin.com/in/mariorifaat",
      github: "https://github.com/mariorifaat",
      website: "https://ecm-digital.com"
    },
    {
      name: "Michał Bieguszewski",
      role: currentLanguage === 'de' ? "Marketing & Business Development" : "Marketing & Business Development",
      imageSrc: "https://ui-avatars.com/api/?name=Michal+Bieguszewski&background=22C55E&color=fff&size=512",
      description: currentLanguage === 'de' 
        ? "Stratege für digitales Marketing und Geschäftsentwicklung. Erfahrung bei der Umsetzung erfolgreicher Kampagnen und der Förderung des Unternehmenswachstums." 
        : "Strateg marketingu cyfrowego i rozwoju biznesu. Doświadczenie w prowadzeniu skutecznych kampanii i rozwoju firm.",
      linkedin: "https://linkedin.com/in/michalbieguszewski",
      github: "https://github.com/michalbieguszewski",
      website: "https://ecm-digital.com"
    }
  ];

  return (
    <Layout>
      <div className="bg-background">
      <section className="py-24 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="container-tight">
          <div className="max-w-3xl mx-auto text-center">
            <Badge className="bg-primary/10 text-primary mb-4 py-1 px-3 rounded-full">
              {currentLanguage === 'de' ? 'Über uns' : 'O nas'}
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
              {currentLanguage === 'de' ? 'Wir sind ECM Digital' : 'Jesteśmy ECM Digital'}
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {currentLanguage === 'de' 
                ? 'Eine Agentur, die darauf spezialisiert ist, effektive und innovative digitale Lösungen für Unternehmen jeder Größe zu entwickeln.' 
                : 'Agencja specjalizująca się w tworzeniu skutecznych i innowacyjnych rozwiązań cyfrowych dla firm każdej wielkości.'}
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision section */}
      <section className="py-24 bg-white">
        <div className="container-tight">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div className="card-modern p-8 md:p-10">
              <h2 className="text-2xl md:text-3xl font-bold mb-6">
                {currentLanguage === 'de' ? 'Unsere Mission' : 'Nasza misja'}
              </h2>
              <p className="text-gray-600 mb-6">
                {currentLanguage === 'de' 
                  ? 'Wir bei ECM Digital haben es uns zur Aufgabe gemacht, Unternehmen durch effektive digitale Lösungen zum Erfolg zu verhelfen. Wir glauben, dass gut gestaltete digitale Erlebnisse, die auf soliden UX-Prinzipien und Datenanalysen basieren, messbare Ergebnisse für Unternehmen jeder Größe liefern können.' 
                  : 'W ECM Digital naszą misją jest pomaganie firmom w osiągnięciu sukcesu poprzez efektywne rozwiązania cyfrowe. Wierzymy, że dobrze zaprojektowane doświadczenia cyfrowe, oparte na solidnych zasadach UX i analizie danych, mogą przynieść wymierne rezultaty dla firm każdej wielkości.'}
              </p>
              <p className="text-gray-600">
                {currentLanguage === 'de' 
                  ? 'Wir konzentrieren uns darauf, digitale Produkte und Dienstleistungen zu entwickeln, die nicht nur ästhetisch ansprechend sind, sondern auch geschäftliche Herausforderungen lösen und einen echten Mehrwert für Kunden und Endbenutzer schaffen.' 
                  : 'Skupiamy się na tworzeniu produktów i usług cyfrowych, które są nie tylko estetycznie atrakcyjne, ale przede wszystkim rozwiązują wyzwania biznesowe i dostarczają realną wartość klientom i użytkownikom końcowym.'}
              </p>
            </div>
            
            <div className="card-modern p-8 md:p-10">
              <h2 className="text-2xl md:text-3xl font-bold mb-6">
                {currentLanguage === 'de' ? 'Unsere Vision' : 'Nasza wizja'}
              </h2>
              <p className="text-gray-600 mb-6">
                {currentLanguage === 'de' 
                  ? 'Unsere Vision ist es, ein führender Innovator im Bereich digitaler Lösungen zu sein, der die neuesten Technologien wie KI, Machine Learning und Datenanalyse nutzt, um Unternehmen zu transformieren und in der digitalen Landschaft voranzubringen.' 
                  : 'Naszą wizją jest bycie wiodącym innowatorem w obszarze rozwiązań cyfrowych, wykorzystującym najnowsze technologie, takie jak AI, machine learning i analiza danych, aby transformować firmy i prowadzić je do przodu w cyfrowym krajobrazie.'}
              </p>
              <p className="text-gray-600">
                {currentLanguage === 'de' 
                  ? 'Wir streben danach, die Lücke zwischen Design und Technologie zu schließen, indem wir kreative Lösungen entwickeln, die sowohl menschenzentriert als auch technologisch fortschrittlich sind. Wir möchten unseren Kunden helfen, in der sich schnell verändernden digitalen Welt nicht nur zu überleben, sondern zu gedeihen.' 
                  : 'Dążymy do wypełnienia luki między designem a technologią, tworząc kreatywne rozwiązania, które są zarówno zorientowane na człowieka, jak i zaawansowane technologicznie. Chcemy pomagać naszym klientom nie tylko przetrwać, ale prosperować w szybko zmieniającym się świecie cyfrowym.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values section */}
      <section className="py-24 bg-background">
        <div className="container-tight">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <Badge className="bg-secondary/10 text-secondary mb-4 py-1 px-3 rounded-full">
              {currentLanguage === 'de' ? 'Unsere Werte' : 'Nasze wartości'}
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 tracking-tight">
              {currentLanguage === 'de' ? 'Was leitet uns' : 'Co nas prowadzi'}
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {currentLanguage === 'de' 
                ? 'Diese Grundprinzipien definieren, wie wir arbeiten und mit unseren Kunden umgehen.' 
                : 'Te podstawowe zasady definiują, jak pracujemy i jak współpracujemy z naszymi klientami.'}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card-modern p-8">
              <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600">
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                  <line x1="12" y1="9" x2="12" y2="13"></line>
                  <line x1="12" y1="17" x2="12.01" y2="17"></line>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">
                {currentLanguage === 'de' ? 'Innovation' : 'Innowacyjność'}
              </h3>
              <p className="text-gray-600">
                {currentLanguage === 'de' 
                  ? 'Wir erforschen ständig neue Ideen und Technologien, um die effektivsten Lösungen zu entwickeln. Wir glauben, dass Innovation der Schlüssel ist, um in der digitalen Welt relevant zu bleiben.' 
                  : 'Nieustannie eksplorujemy nowe pomysły i technologie, aby tworzyć najbardziej efektywne rozwiązania. Wierzymy, że innowacja jest kluczem do pozostania istotnym w cyfrowym świecie.'}
              </p>
            </div>
            
            <div className="card-modern p-8">
              <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-600">
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                  <polyline points="7.5 4.21 12 6.81 16.5 4.21"></polyline>
                  <polyline points="7.5 19.79 7.5 14.6 3 12"></polyline>
                  <polyline points="21 12 16.5 14.6 16.5 19.79"></polyline>
                  <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                  <line x1="12" y1="22.08" x2="12" y2="12"></line>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">
                {currentLanguage === 'de' ? 'Qualität' : 'Jakość'}
              </h3>
              <p className="text-gray-600">
                {currentLanguage === 'de' 
                  ? 'Wir setzen auf höchste Qualität in allem, was wir tun. Von der ersten Beratung bis zur endgültigen Lieferung sind wir bestrebt, Exzellenz zu gewährleisten und die Erwartungen unserer Kunden zu übertreffen.' 
                  : 'Stawiamy na najwyższą jakość we wszystkim, co robimy. Od pierwszej konsultacji po ostateczne wdrożenie, dążymy do doskonałości i przekraczania oczekiwań naszych klientów.'}
              </p>
            </div>
            
            <div className="card-modern p-8">
              <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">
                {currentLanguage === 'de' ? 'Zusammenarbeit' : 'Współpraca'}
              </h3>
              <p className="text-gray-600">
                {currentLanguage === 'de' 
                  ? 'Wir glauben an die Kraft der Zusammenarbeit und des Teamworks. Wir arbeiten eng mit unseren Kunden zusammen, um sicherzustellen, dass wir ihre Bedürfnisse und Ziele vollständig verstehen und gemeinsam die besten Ergebnisse erzielen.' 
                  : 'Wierzymy w siłę współpracy i pracy zespołowej. Blisko współpracujemy z naszymi klientami, aby upewnić się, że w pełni rozumiemy ich potrzeby i cele, wspólnie osiągając najlepsze rezultaty.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team section */}
      <section className="py-24 bg-white">
        <div className="container-tight">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <Badge className="bg-primary/10 text-primary mb-4 py-1 px-3 rounded-full">
              {currentLanguage === 'de' ? 'Unser Team' : 'Nasz zespół'}
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 tracking-tight">
              {currentLanguage === 'de' ? 'Die Gesichter hinter ECM Digital' : 'Twarze za ECM Digital'}
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {currentLanguage === 'de' 
                ? 'Lernen Sie die Experten kennen, die Ihre digitalen Projekte zum Leben erwecken.' 
                : 'Poznaj ekspertów, którzy ożywiają Twoje cyfrowe projekty.'}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {teamMembers.map((member, index) => (
              <div key={index} className="card-modern p-0 overflow-hidden">
                <div className="h-72 bg-gray-100 relative">
                  <img 
                    src={member.imageSrc} 
                    alt={member.name} 
                    className="w-full h-full object-cover object-center"
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
                    <a href={`mailto:${member.name.toLowerCase().replace(" ", ".")}@ecm-digital.com`} className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center text-purple-600 hover:bg-purple-100 transition-colors">
                      <Mail className="h-5 w-5" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Join us section */}
      <section className="py-24 bg-gradient-to-br from-secondary/5 to-primary/5">
        <div className="container-tight">
          <div className="max-w-3xl mx-auto text-center">
            <Badge className="bg-secondary/10 text-secondary mb-4 py-1 px-3 rounded-full">
              {currentLanguage === 'de' ? 'Arbeiten Sie mit uns' : 'Współpracuj z nami'}
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 tracking-tight">
              {currentLanguage === 'de' ? 'Bereit, Ihr Projekt zu starten?' : 'Gotowy, by rozpocząć swój projekt?'}
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-10">
              {currentLanguage === 'de' 
                ? 'Kontaktieren Sie uns noch heute, um zu besprechen, wie wir Ihnen bei der Verwirklichung Ihrer digitalen Vision helfen können.' 
                : 'Skontaktuj się z nami już dziś, aby omówić, jak możemy pomóc Ci w realizacji Twojej cyfrowej wizji.'}
            </p>
            
            <Button className="rounded-full bg-primary hover:bg-primary/90 text-white py-2 px-8">
              {currentLanguage === 'de' ? 'Kontakt aufnehmen' : 'Skontaktuj się'}
            </Button>
          </div>
        </div>
      </section>
    </div>
    </Layout>
  );
};

export default AboutPage;