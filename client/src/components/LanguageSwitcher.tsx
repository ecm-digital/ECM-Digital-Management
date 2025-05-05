import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language);

  const changeLanguage = (language: string) => {
    i18n.changeLanguage(language);
    setCurrentLanguage(language);
  };

  return (
    <Select value={currentLanguage} onValueChange={changeLanguage}>
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