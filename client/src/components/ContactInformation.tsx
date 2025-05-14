import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Service } from "@/types";
import { useTranslation } from "react-i18next";
import i18next from "i18next";

interface ContactInformationProps {
  onContactInfoChange: (contactInfo: Record<string, any>) => void;
  contactInfo?: Record<string, any>;
  totalPrice?: number;
  service?: Service | null;
}

export default function ContactInformation({
  onContactInfoChange,
  contactInfo: initialContactInfo = {},
  totalPrice = 0,
  service = null
}: ContactInformationProps) {
  const { t } = useTranslation();
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
    onContactInfoChange(contactInfo);
  }, [contactInfo, onContactInfoChange]);

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
          <h2 className="text-3xl font-bold text-dark mb-3">{t('contact.title')}</h2>
          <p className="text-dark-light">{t('contact.subtitle')}</p>
        </div>
        <Card className="shadow-md min-w-[200px]">
          <CardContent className="pt-4">
            <p className="text-sm text-dark-light mb-1">{t('summary.totalPrice')}:</p>
            <p className="text-2xl font-bold text-dark">
              {totalPrice.toLocaleString()} {i18next.language === 'de' ? '€' : 'PLN'}
            </p>
            <p className="text-xs text-dark-light">{service?.name}</p>
          </CardContent>
        </Card>
      </div>

      <motion.div variants={itemVariants} className="bg-white rounded-xl p-8 shadow-sm mb-8">
        <h3 className="text-xl font-semibold mb-6">{t('contact.company')}</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <Label htmlFor="company" className="block text-dark-light mb-2 font-medium">
              {t('contact.company')}*
            </Label>
            <Input 
              id="company"
              type="text"
              placeholder={t('contact.inputPlaceholders.company')}
              required
              value={contactInfo.company}
              onChange={(e) => handleInputChange("company", e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
          
          <div>
            <Label htmlFor="website" className="block text-dark-light mb-2 font-medium">
              {t('contact.website')}
            </Label>
            <Input 
              id="website"
              type="url"
              placeholder={t('contact.inputPlaceholders.website')}
              value={contactInfo.website}
              onChange={(e) => handleInputChange("website", e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
          
          <div>
            <Label htmlFor="industry" className="block text-dark-light mb-2 font-medium">
              {t('contact.industry')}*
            </Label>
            <Select
              value={contactInfo.industry}
              onValueChange={(value) => handleInputChange("industry", value)}
            >
              <SelectTrigger id="industry" className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent">
                <SelectValue placeholder={t('contact.industry')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ecommerce">{t('contact.industryOptions.ecommerce')}</SelectItem>
                <SelectItem value="services">{t('contact.industryOptions.services')}</SelectItem>
                <SelectItem value="manufacturing">{t('contact.industryOptions.manufacturing')}</SelectItem>
                <SelectItem value="healthcare">{t('contact.industryOptions.healthcare')}</SelectItem>
                <SelectItem value="education">{t('contact.industryOptions.education')}</SelectItem>
                <SelectItem value="technology">{t('contact.industryOptions.technology')}</SelectItem>
                <SelectItem value="other">{t('contact.industryOptions.other')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="companySize" className="block text-dark-light mb-2 font-medium">
              {t('contact.companySize')}*
            </Label>
            <Select
              value={contactInfo.companySize}
              onValueChange={(value) => handleInputChange("companySize", value)}
            >
              <SelectTrigger id="companySize" className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent">
                <SelectValue placeholder={t('contact.companySize')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="solo">{t('contact.companySizeOptions.solo')}</SelectItem>
                <SelectItem value="small">{t('contact.companySizeOptions.small')}</SelectItem>
                <SelectItem value="medium">{t('contact.companySizeOptions.medium')}</SelectItem>
                <SelectItem value="large">{t('contact.companySizeOptions.large')}</SelectItem>
                <SelectItem value="enterprise">{t('contact.companySizeOptions.enterprise')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </motion.div>
      
      <motion.div variants={itemVariants} className="bg-white rounded-xl p-8 shadow-sm mb-8">
        <h3 className="text-xl font-semibold mb-6">{t('contact.title')}</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <Label htmlFor="name" className="block text-dark-light mb-2 font-medium">
              {t('contact.name')}*
            </Label>
            <Input 
              id="name"
              type="text"
              placeholder={t('contact.inputPlaceholders.name')}
              required
              value={contactInfo.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
          
          <div>
            <Label htmlFor="position" className="block text-dark-light mb-2 font-medium">
              {t('contact.position', 'Stanowisko')}
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
              {t('contact.email')}*
            </Label>
            <Input 
              id="email"
              type="email"
              placeholder={t('contact.inputPlaceholders.email')}
              required
              value={contactInfo.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
          
          <div>
            <Label htmlFor="phone" className="block text-dark-light mb-2 font-medium">
              {t('contact.phone')}
            </Label>
            <Input 
              id="phone"
              type="tel"
              placeholder={t('contact.inputPlaceholders.phone')}
              value={contactInfo.phone}
              onChange={(e) => handleInputChange("phone", e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
        </div>
        
        <div className="mb-6">
          <Label htmlFor="additionalInfo" className="block text-dark-light mb-2 font-medium">
            {t('contact.message')}
          </Label>
          <Textarea 
            id="additionalInfo"
            rows={3}
            placeholder={t('contact.inputPlaceholders.message')}
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
              {t('contact.consent')}{" "}
              <a href="#" className="text-primary">
                {t('common.privacyPolicy', 'polityką prywatności')}
              </a>
              *
            </Label>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
