import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import Backend from 'i18next-http-backend';

// Funkcja do wykrywania kraju użytkownika na podstawie lokalizacji przeglądarki
const detectUserCountry = (): string | null => {
  // Najpierw sprawdź, czy istnieje navigator.language
  if (navigator && navigator.language) {
    const fullLocale = navigator.language.toLowerCase();
    
    // Sprawdź, czy kod kraju zawiera "de" dla Niemiec
    if (fullLocale.includes('de')) {
      return 'de';
    }
  }
  
  // Alternatywnie, sprawdź listę języków preferowanych przez przeglądarkę
  if (navigator && navigator.languages && navigator.languages.length > 0) {
    for (const lang of navigator.languages) {
      if (lang.toLowerCase().includes('de')) {
        return 'de';
      }
    }
  }
  
  // Nie udało się wykryć Niemiec
  return null;
};

// Funkcja do ustalenia początkowego języka
const determineInitialLanguage = (): string => {
  // 1. Najpierw sprawdź, czy użytkownik ma zapisaną preferencję
  const savedLanguage = localStorage.getItem('i18nextLng');
  if (savedLanguage && ['pl', 'de'].includes(savedLanguage)) {
    return savedLanguage;
  }
  
  // 2. Jeśli nie ma zapisanej preferencji, sprawdź czy użytkownik jest z Niemiec
  const userCountry = detectUserCountry();
  if (userCountry === 'de') {
    return 'de';
  }
  
  // 3. W przeciwnym razie, użyj domyślnego języka
  return 'pl';
};

// Ustal początkowy język
const initialLanguage = determineInitialLanguage();

i18n
  // load translations using http
  .use(Backend)
  // pass the i18n instance to react-i18next
  .use(initReactI18next)
  // init i18next
  .init({
    fallbackLng: 'pl',
    lng: initialLanguage, // Ustaw wykryty język
    debug: true,
    supportedLngs: ['pl', 'de'],
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json',
    },
  });

// Funkcja pomocnicza do zmiany języka
export const changeLanguage = (lng: string) => {
  i18n.changeLanguage(lng);
  // Zapisanie preferencji użytkownika w localStorage
  localStorage.setItem('i18nextLng', lng);
};

// Zapisz wykryty język, jeśli nie ma zapisanej preferencji
if (!localStorage.getItem('i18nextLng')) {
  localStorage.setItem('i18nextLng', initialLanguage);
}

export default i18n;