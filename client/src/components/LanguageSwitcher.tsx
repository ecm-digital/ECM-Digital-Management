import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Globe } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
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
    
    // Wyślij wiadomość do konsoli dla debugowania
    console.log("Zmieniono język na:", language);
    console.log("i18n.language:", i18n.language);
    console.log("localStorage.getItem('i18nextLng'):", localStorage.getItem('i18nextLng'));
  };

  // Airbnb style language switcher
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className="rounded-full border border-gray-200 shadow-sm hover:shadow-md flex items-center gap-2 pl-2 pr-2 py-1.5"
        >
          <Globe className="h-4 w-4 text-primary" />
          <span className="text-xs font-medium">{getCountryFlag(currentLanguage)}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-2">
        <div className="space-y-1">
          <button
            className={`w-full text-left px-3 py-2 rounded-md flex items-center hover:bg-accent transition-colors ${currentLanguage === 'pl' ? 'bg-accent/50 text-primary' : ''}`}
            onClick={() => handleLanguageChange('pl')}
          >
            <span className="mr-2 text-lg">🇵🇱</span>
            <span className="font-medium">Polski</span>
          </button>
          <button
            className={`w-full text-left px-3 py-2 rounded-md flex items-center hover:bg-accent transition-colors ${currentLanguage === 'de' ? 'bg-accent/50 text-primary' : ''}`}
            onClick={() => handleLanguageChange('de')}
          >
            <span className="mr-2 text-lg">🇩🇪</span>
            <span className="font-medium">Deutsch</span>
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
}