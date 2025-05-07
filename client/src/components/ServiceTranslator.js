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
    "Mentoring & Konsultacje": "Mentoring & Beratung",
    "Strona E-commerce": "E-Commerce-Website",
    "Strony w Wix Studio i Webflow": "Wix Studio & Webflow Websites",
    "E-commerce z AI": "E-Commerce mit KI",
    "Kampania Google Ads": "Google Ads Kampagne",
    "MVP z AI": "MVP mit KI",
    "Performance & SEO": "Performance & SEO",
    "Facebook & Instagram Ads": "Facebook & Instagram Ads",
    "Strategie contentowe": "Content-Strategien",
    "Sklepy pod kampanie": "Kampagnen-Shops",
    "Automatyzacje (n8n, Zapier)": "Automatisierungen (n8n, Zapier)",
    "Custom AI Tools": "Individuelle KI-Tools",
    "Product Discovery Workshop": "Product Discovery Workshop",
    "UX Scorecard": "UX Scorecard",
    "AI Landing Pages": "AI Landing Pages",
    "AI Prototypy UI": "AI UI-Prototypen",
    "Kampanie graficzne z AI": "KI-gestützte Grafikdesign-Kampagnen",
    "Ilustracje & ikony": "Illustrationen & Icons",
    "Pixel-perfect Dev Ready": "Pixel-perfect Dev Ready"
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
    "Mentoring & Konsultacje": "Mentoring & Consulting",
    "AI Landing Pages": "AI Landing Pages",
    "AI Prototypy UI": "AI UI Prototypes",
    "Kampanie graficzne z AI": "AI Graphic Campaigns",
    "Ilustracje & ikony": "Illustrations & Icons",
    "Pixel-perfect Dev Ready": "Pixel-perfect Dev Ready"
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
 * Pobiera aktualny język z localStorage
 * @returns {string} - Kod języka (pl, de, en)
 */
export function getCurrentLanguage() {
  // Sprawdź oba miejsca zapisu języka (dla kompatybilności)
  const appLanguage = localStorage.getItem('app_language');
  const i18nextLanguage = localStorage.getItem('i18nextLng');
  
  console.log(`getCurrentLanguage - app_language: ${appLanguage}, i18nextLng: ${i18nextLanguage}`);
  
  // Priorytet: app_language -> i18nextLng -> domyślnie 'pl'
  return appLanguage || i18nextLanguage || 'pl';
}

/**
 * Tłumaczy nazwę usługi na wybrany język
 * @param {string} serviceName - Nazwa usługi w języku polskim
 * @param {string} language - Kod języka (pl, de, en)
 * @returns {string} - Przetłumaczona nazwa usługi
 */
export function getServiceTranslation(serviceName, language) {
  // Pobierz język z parametru lub z localStorage
  const currentLanguage = language || getCurrentLanguage();
  
  console.log(`Tłumaczenie nazwy usługi: "${serviceName}" na język: ${currentLanguage}`);
  
  if (!serviceName) {
    console.warn('Pusta nazwa usługi!');
    return '';
  }
  
  if (currentLanguage === 'pl') return serviceName;
  
  const translations = serviceTranslations[currentLanguage];
  if (!translations) {
    console.warn(`Brak tłumaczeń dla języka ${currentLanguage}`);
    return serviceName;
  }
  
  const translation = translations[serviceName];
  if (!translation) {
    console.warn(`Brak tłumaczenia dla usługi "${serviceName}" w języku ${currentLanguage}`);
    return serviceName;
  }
  
  console.log(`Przetłumaczona nazwa: "${translation}"`);
  return translation;
}

/**
 * Tłumaczy nazwę kategorii na wybrany język
 * @param {string} category - Nazwa kategorii w języku polskim
 * @param {string} language - Kod języka (pl, de, en)
 * @returns {string} - Przetłumaczona nazwa kategorii
 */
export function getCategoryTranslation(category, language) {
  // Pobierz język z parametru lub z localStorage
  const currentLanguage = language || getCurrentLanguage();

  console.log(`Tłumaczenie kategorii: "${category}" na język: ${currentLanguage}`);
  
  if (!category) {
    console.warn('Pusta nazwa kategorii!');
    return 'Inne';
  }
  
  if (currentLanguage === 'pl') return category;
  
  const translations = categoryTranslations[currentLanguage];
  if (!translations) {
    console.warn(`Brak tłumaczeń dla języka ${currentLanguage}`);
    return category;
  }
  
  const translation = translations[category];
  if (!translation) {
    console.warn(`Brak tłumaczenia dla kategorii "${category}" w języku ${currentLanguage}`);
    return category;
  }
  
  console.log(`Przetłumaczona kategoria: "${translation}"`);
  return translation;
}