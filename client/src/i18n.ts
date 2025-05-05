import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import Backend from 'i18next-http-backend';

i18n
  // load translations using http
  .use(Backend)
  // pass the i18n instance to react-i18next
  .use(initReactI18next)
  // init i18next
  .init({
    fallbackLng: 'pl',
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

// Sprawdzenie czy istnieje preferencja językowa użytkownika
const savedLanguage = localStorage.getItem('i18nextLng');
if (savedLanguage && ['pl', 'de'].includes(savedLanguage)) {
  i18n.changeLanguage(savedLanguage);
}

export default i18n;