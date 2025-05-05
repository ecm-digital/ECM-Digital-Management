import React from 'react';

interface ServiceTranslations {
  [key: string]: {
    de: string;
    en: string;
  };
}

interface CategoryTranslations {
  [key: string]: {
    de: string;
    en: string;
  };
}

// Słownik tłumaczeń nazw usług
export const serviceTranslations: ServiceTranslations = {
  // UX/UI kategoria
  "Audyt UX": {
    de: "UX-Audit",
    en: "UX Audit"
  },
  "Audyt UX z elementami AI": {
    de: "UX-Audit mit KI",
    en: "UX Audit with AI"
  },
  "Projektowanie lejków konwersji": {
    de: "Conversion-Funnel-Design",
    en: "Conversion Funnel Design"
  },
  "Miesięczna opieka AI/UX": {
    de: "Monatliche KI/UX-Betreuung",
    en: "Monthly AI/UX Care"
  },
  // Web Development kategoria
  "Strona internetowa": {
    de: "Webseite",
    en: "Website"
  },
  "Sklep internetowy": {
    de: "Online-Shop",
    en: "Online Store"
  },
  "Aplikacja webowa": {
    de: "Web-Anwendung",
    en: "Web Application"
  },
  // Marketing kategoria
  "Kampania Social Media": {
    de: "Social-Media-Kampagne",
    en: "Social Media Campaign"
  },
  "Newsletter z insightami": {
    de: "Insights-Newsletter",
    en: "Insights Newsletter"
  },
  // AI kategoria
  "AI Chatbot": {
    de: "KI-Chatbot",
    en: "AI Chatbot"
  },
  "Integracja AI": {
    de: "KI-Integration",
    en: "AI Integration"
  },
  // Inne
  "Strategia marketingowa": {
    de: "Marketingstrategie",
    en: "Marketing Strategy"
  },
  "Automatyzacja Procesów Biznesowych": {
    de: "Automatisierung von Geschäftsprozessen",
    en: "Business Process Automation"
  },
  "Mentoring & Konsultacje": {
    de: "Mentoring & Beratung",
    en: "Mentoring & Consulting"
  }
};

// Słownik tłumaczeń kategorii
export const categoryTranslations: CategoryTranslations = {
  "UX/UI": {
    de: "UX/UI",
    en: "UX/UI"
  },
  "Web Development": {
    de: "Web-Entwicklung",
    en: "Web Development"
  },
  "Marketing": {
    de: "Marketing",
    en: "Marketing"
  },
  "SEO": {
    de: "SEO",
    en: "SEO"
  },
  "AI": {
    de: "KI",
    en: "AI"
  },
  "Automatyzacja": {
    de: "Automatisierung",
    en: "Automation"
  },
  "Consulting": {
    de: "Beratung",
    en: "Consulting"
  },
  "Development": {
    de: "Entwicklung",
    en: "Development"
  },
  "Inne": {
    de: "Andere",
    en: "Other"
  }
};

interface ServiceTranslatorProps {
  serviceName: string;
  language: string;
}

export const TranslateService: React.FC<ServiceTranslatorProps> = ({ serviceName, language }) => {
  // Dla języka polskiego zwracamy oryginalną nazwę
  if (language === 'pl') {
    return <>{serviceName}</>;
  }
  
  // Sprawdzamy czy mamy tłumaczenie
  const translation = serviceTranslations[serviceName];
  if (translation && translation[language as keyof typeof translation]) {
    return <>{translation[language as keyof typeof translation]}</>;
  }
  
  // Jeśli nie ma tłumaczenia, zwracamy oryginalną nazwę
  return <>{serviceName}</>;
};

interface CategoryTranslatorProps {
  categoryName: string;
  language: string;
}

export const TranslateCategory: React.FC<CategoryTranslatorProps> = ({ categoryName, language }) => {
  // Dla języka polskiego zwracamy oryginalną nazwę
  if (language === 'pl') {
    return <>{categoryName}</>;
  }
  
  // Sprawdzamy czy mamy tłumaczenie
  const translation = categoryTranslations[categoryName];
  if (translation && translation[language as keyof typeof translation]) {
    return <>{translation[language as keyof typeof translation]}</>;
  }
  
  // Jeśli nie ma tłumaczenia, zwracamy oryginalną nazwę
  return <>{categoryName}</>;
};

// Funkcje pomocnicze
export const getServiceTranslation = (serviceName: string, language: string): string => {
  if (language === 'pl') return serviceName;
  
  const translation = serviceTranslations[serviceName];
  return translation && translation[language as keyof typeof translation] 
    ? translation[language as keyof typeof translation] 
    : serviceName;
};

export const getCategoryTranslation = (categoryName: string, language: string): string => {
  if (language === 'pl') return categoryName;
  
  const translation = categoryTranslations[categoryName];
  return translation && translation[language as keyof typeof translation] 
    ? translation[language as keyof typeof translation] 
    : categoryName;
};