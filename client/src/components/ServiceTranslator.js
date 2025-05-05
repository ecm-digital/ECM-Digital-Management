// Tłumaczenia nazw usług
const serviceTranslations = {
  "pl": {
    // Wszystkie oryginalne nazwy po polsku są takie same
  },
  "de": {
    "Audyt UX": "UX-Audit",
    "Audyt UX z elementami AI": "UX-Audit mit KI",
    "Projektowanie lejków konwersji": "Conversion-Funnel-Design",
    "Miesięczna opieka AI/UX": "Monatliche KI/UX-Betreuung",
    "Strona internetowa": "Webseite",
    "Sklep internetowy": "Online-Shop",
    "Aplikacja webowa": "Web-Anwendung",
    "Kampania Social Media": "Social-Media-Kampagne",
    "Newsletter z insightami": "Insights-Newsletter",
    "AI Chatbot": "KI-Chatbot",
    "Integracja AI": "KI-Integration",
    "Strategia marketingowa": "Marketingstrategie",
    "Automatyzacja Procesów Biznesowych": "Automatisierung von Geschäftsprozessen",
    "Mentoring & Konsultacje": "Mentoring & Beratung"
  },
  "en": {
    "Audyt UX": "UX Audit",
    "Audyt UX z elementami AI": "UX Audit with AI",
    "Projektowanie lejków konwersji": "Conversion Funnel Design",
    "Miesięczna opieka AI/UX": "Monthly AI/UX Care",
    "Strona internetowa": "Website",
    "Sklep internetowy": "Online Store",
    "Aplikacja webowa": "Web Application",
    "Kampania Social Media": "Social Media Campaign",
    "Newsletter z insightami": "Insights Newsletter",
    "AI Chatbot": "AI Chatbot",
    "Integracja AI": "AI Integration",
    "Strategia marketingowa": "Marketing Strategy",
    "Automatyzacja Procesów Biznesowych": "Business Process Automation",
    "Mentoring & Konsultacje": "Mentoring & Consulting"
  }
};

// Tłumaczenia kategorii
const categoryTranslations = {
  "pl": {
    // Wszystkie oryginalne kategorie po polsku są takie same
  },
  "de": {
    "UX/UI": "UX/UI",
    "Web Development": "Web-Entwicklung",
    "Marketing": "Marketing",
    "SEO": "SEO",
    "AI": "KI",
    "Automatyzacja": "Automatisierung",
    "Consulting": "Beratung",
    "Development": "Entwicklung",
    "Inne": "Andere"
  },
  "en": {
    "UX/UI": "UX/UI",
    "Web Development": "Web Development",
    "Marketing": "Marketing",
    "SEO": "SEO",
    "AI": "AI",
    "Automatyzacja": "Automation",
    "Consulting": "Consulting",
    "Development": "Development",
    "Inne": "Other"
  }
};

/**
 * Tłumaczy nazwę usługi na wybrany język
 * @param {string} serviceName - Nazwa usługi w języku polskim
 * @param {string} language - Kod języka (pl, de, en)
 * @returns {string} - Przetłumaczona nazwa usługi
 */
export function getServiceTranslation(serviceName, language) {
  console.log(`Tłumaczenie nazwy usługi: ${serviceName} na język: ${language}`);
  
  if (language === 'pl') return serviceName;
  
  const translations = serviceTranslations[language];
  if (!translations) {
    console.warn(`Brak tłumaczeń dla języka ${language}`);
    return serviceName;
  }
  
  const translation = translations[serviceName];
  if (!translation) {
    console.warn(`Brak tłumaczenia dla usługi "${serviceName}" w języku ${language}`);
    return serviceName;
  }
  
  return translation;
}

/**
 * Tłumaczy nazwę kategorii na wybrany język
 * @param {string} category - Nazwa kategorii w języku polskim
 * @param {string} language - Kod języka (pl, de, en)
 * @returns {string} - Przetłumaczona nazwa kategorii
 */
export function getCategoryTranslation(category, language) {
  console.log(`Tłumaczenie kategorii: ${category} na język: ${language}`);
  
  if (language === 'pl') return category;
  
  const translations = categoryTranslations[language];
  if (!translations) {
    console.warn(`Brak tłumaczeń dla języka ${language}`);
    return category;
  }
  
  const translation = translations[category];
  if (!translation) {
    console.warn(`Brak tłumaczenia dla kategorii "${category}" w języku ${language}`);
    return category;
  }
  
  return translation;
}