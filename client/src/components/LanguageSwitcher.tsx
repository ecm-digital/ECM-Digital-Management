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

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language);

  // Aktualizacja stanu po zmianie języka
  useEffect(() => {
    setCurrentLanguage(i18n.language);
  }, [i18n.language]);

  const handleLanguageChange = (language: string) => {
    changeLanguage(language);
    setCurrentLanguage(language);
  };

  return (
    <Select value={currentLanguage} onValueChange={handleLanguageChange}>
      <SelectTrigger className="w-[120px]">
        <SelectValue placeholder="Język" />
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