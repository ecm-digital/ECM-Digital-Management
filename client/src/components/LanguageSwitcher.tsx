import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { changeLanguage } from '../i18n';

// Funkcja pomocnicza do uzyskiwania etykiety języka
const getLanguageLabel = (code: string): string => {
  switch (code) {
    case 'pl':
      return 'Polski';
    case 'de':
      return 'Deutsch';
    default:
      return 'Język';
  }
};

// Funkcja pomocnicza do uzyskiwania flagi kraju
const getCountryFlag = (code: string): string => {
  switch (code) {
    case 'pl':
      return '🇵🇱';
    case 'de':
      return '🇩🇪';
    default:
      return '🌐';
  }
};

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language);

  // Aktualizacja stanu po zmianie języka
  useEffect(() => {
    // Czyszczenie kodu języka (np. z "de-DE" do "de")
    const cleanLanguageCode = i18n.language.split('-')[0];
    if (['pl', 'de'].includes(cleanLanguageCode)) {
      setCurrentLanguage(cleanLanguageCode);
    } else {
      setCurrentLanguage(i18n.language);
    }
  }, [i18n.language]);

  const handleLanguageChange = (language: string) => {
    console.log("Zmiana języka na:", language);
    
    // Zmień język w i18next - ta funkcja również zapisuje w localStorage
    changeLanguage(language);
    setCurrentLanguage(language);
    
    // Opcjonalnie: przeładuj stronę, aby wszystkie komponenty zostały odpowiednio zaktualizowane
    // window.location.reload();
    
    // Wyślij wiadomość do konsoli dla debugowania
    console.log("Zmieniono język na:", language);
    console.log("i18n.language:", i18n.language);
    console.log("localStorage.getItem('i18nextLng'):", localStorage.getItem('i18nextLng'));
  };

  return (
    <Select value={currentLanguage} onValueChange={handleLanguageChange}>
      <SelectTrigger className="w-[120px]">
        <SelectValue>
          <div className="flex items-center">
            <span className="mr-2">{getCountryFlag(currentLanguage)}</span> 
            {getLanguageLabel(currentLanguage)}
          </div>
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="pl">
          <div className="flex items-center">
            <span className="mr-2">🇵🇱</span> Polski
          </div>
        </SelectItem>
        <SelectItem value="de">
          <div className="flex items-center">
            <span className="mr-2">🇩🇪</span> Deutsch
          </div>
        </SelectItem>
      </SelectContent>
    </Select>
  );
}