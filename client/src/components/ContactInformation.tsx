import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Service } from "@/types";
import i18next from "i18next";

interface ContactInformationProps {
  onChange: (contactInfo: Record<string, any>) => void;
  initialContactInfo?: Record<string, any>;
  totalPrice: number;
  service: Service | null;
}

export default function ContactInformation({
  onChange,
  initialContactInfo = {},
  totalPrice,
  service
}: ContactInformationProps) {
  const [contactInfo, setContactInfo] = useState<Record<string, any>>({
    company: initialContactInfo.company || "",
    website: initialContactInfo.website || "",
    industry: initialContactInfo.industry || "",
    companySize: initialContactInfo.companySize || "",
    name: initialContactInfo.name || "",
    position: initialContactInfo.position || "",
    email: initialContactInfo.email || "",
    phone: initialContactInfo.phone || "",
    additionalInfo: initialContactInfo.additionalInfo || "",
    consentGiven: initialContactInfo.consentGiven || false
  });

  useEffect(() => {
    onChange(contactInfo);
  }, [contactInfo, onChange]);

  const handleInputChange = (field: string, value: string | boolean) => {
    setContactInfo(prev => ({ ...prev, [field]: value }));
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: 'spring', stiffness: 300, damping: 24 }
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="flex justify-between items-start mb-8">
        <div>
          <h2 className="text-3xl font-bold text-dark mb-3">Dane kontaktowe</h2>
          <p className="text-dark-light">Podaj dane kontaktowe, abyśmy mogli przygotować ofertę</p>
        </div>
        <Card className="shadow-md min-w-[200px]">
          <CardContent className="pt-4">
            <p className="text-sm text-dark-light mb-1">Wartość zamówienia:</p>
            <p className="text-2xl font-bold text-dark">{totalPrice.toLocaleString()} zł</p>
            <p className="text-xs text-dark-light">{service?.name}</p>
          </CardContent>
        </Card>
      </div>

      <motion.div variants={itemVariants} className="bg-white rounded-xl p-8 shadow-sm mb-8">
        <h3 className="text-xl font-semibold mb-6">Informacje o firmie</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <Label htmlFor="company" className="block text-dark-light mb-2 font-medium">
              Nazwa firmy*
            </Label>
            <Input 
              id="company"
              type="text"
              placeholder="Nazwa Twojej firmy"
              required
              value={contactInfo.company}
              onChange={(e) => handleInputChange("company", e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
          
          <div>
            <Label htmlFor="website" className="block text-dark-light mb-2 font-medium">
              Strona internetowa
            </Label>
            <Input 
              id="website"
              type="url"
              placeholder="https://twoja-strona.pl"
              value={contactInfo.website}
              onChange={(e) => handleInputChange("website", e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
          
          <div>
            <Label htmlFor="industry" className="block text-dark-light mb-2 font-medium">
              Branża*
            </Label>
            <Select
              value={contactInfo.industry}
              onValueChange={(value) => handleInputChange("industry", value)}
            >
              <SelectTrigger id="industry" className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent">
                <SelectValue placeholder="Wybierz branżę" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ecommerce">E-commerce</SelectItem>
                <SelectItem value="services">Usługi</SelectItem>
                <SelectItem value="manufacturing">Produkcja</SelectItem>
                <SelectItem value="healthcare">Ochrona zdrowia</SelectItem>
                <SelectItem value="education">Edukacja</SelectItem>
                <SelectItem value="technology">Technologia</SelectItem>
                <SelectItem value="other">Inna</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="companySize" className="block text-dark-light mb-2 font-medium">
              Wielkość firmy*
            </Label>
            <Select
              value={contactInfo.companySize}
              onValueChange={(value) => handleInputChange("companySize", value)}
            >
              <SelectTrigger id="companySize" className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent">
                <SelectValue placeholder="Wybierz wielkość" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="solo">Jednoosobowa</SelectItem>
                <SelectItem value="micro">Mikro (do 10 pracowników)</SelectItem>
                <SelectItem value="small">Mała (10-50 pracowników)</SelectItem>
                <SelectItem value="medium">Średnia (50-250 pracowników)</SelectItem>
                <SelectItem value="large">Duża (powyżej 250 pracowników)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </motion.div>
      
      <motion.div variants={itemVariants} className="bg-white rounded-xl p-8 shadow-sm mb-8">
        <h3 className="text-xl font-semibold mb-6">Dane kontaktowe</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <Label htmlFor="name" className="block text-dark-light mb-2 font-medium">
              Imię i nazwisko*
            </Label>
            <Input 
              id="name"
              type="text"
              placeholder="Jan Kowalski"
              required
              value={contactInfo.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
          
          <div>
            <Label htmlFor="position" className="block text-dark-light mb-2 font-medium">
              Stanowisko
            </Label>
            <Input 
              id="position"
              type="text"
              placeholder="Marketing Manager"
              value={contactInfo.position}
              onChange={(e) => handleInputChange("position", e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
          
          <div>
            <Label htmlFor="email" className="block text-dark-light mb-2 font-medium">
              Email*
            </Label>
            <Input 
              id="email"
              type="email"
              placeholder="jan.kowalski@firma.pl"
              required
              value={contactInfo.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
          
          <div>
            <Label htmlFor="phone" className="block text-dark-light mb-2 font-medium">
              Telefon
            </Label>
            <Input 
              id="phone"
              type="tel"
              placeholder="+48 123 456 789"
              value={contactInfo.phone}
              onChange={(e) => handleInputChange("phone", e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
        </div>
        
        <div className="mb-6">
          <Label htmlFor="additionalInfo" className="block text-dark-light mb-2 font-medium">
            Dodatkowe informacje
          </Label>
          <Textarea 
            id="additionalInfo"
            rows={3}
            placeholder="Dodatkowe informacje, które mogą być istotne dla realizacji zamówienia..."
            value={contactInfo.additionalInfo}
            onChange={(e) => handleInputChange("additionalInfo", e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
        
        <div>
          <div className="flex items-start">
            <Checkbox 
              id="consent"
              required
              checked={contactInfo.consentGiven}
              onCheckedChange={(checked) => handleInputChange("consentGiven", Boolean(checked))}
              className="mt-1 h-5 w-5"
            />
            <Label 
              htmlFor="consent"
              className="ml-2 text-dark-light text-sm cursor-pointer"
            >
              Wyrażam zgodę na przetwarzanie moich danych osobowych w celu przygotowania oferty zgodnie z{" "}
              <a href="#" className="text-primary">
                polityką prywatności
              </a>
              .*
            </Label>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
