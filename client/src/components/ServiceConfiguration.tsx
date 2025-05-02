import { useEffect, useState } from "react";
import { Service, ConfigStep, ConfigOption } from "@/types";
import { motion } from "framer-motion";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import FileUpload from "./FileUpload";
import { Card, CardContent } from "@/components/ui/card";

interface ServiceConfigurationProps {
  service: Service | null;
  onChange: (configuration: Record<string, any>, price: number, deliveryTime: number) => void;
  onFileUpload: (file: File | null) => void;
  initialConfiguration?: Record<string, any>;
  initialPrice?: number;
}

export default function ServiceConfiguration({
  service,
  onChange,
  onFileUpload,
  initialConfiguration = {},
  initialPrice = 0
}: ServiceConfigurationProps) {
  const [configuration, setConfiguration] = useState<Record<string, any>>(initialConfiguration);
  const [price, setPrice] = useState<number>(initialPrice || (service?.basePrice || 0));
  const [deliveryTime, setDeliveryTime] = useState<number>(service?.deliveryTime || 0);
  const [websiteUrl, setWebsiteUrl] = useState<string>(initialConfiguration.websiteUrl || "");

  useEffect(() => {
    if (service && Object.keys(initialConfiguration).length === 0) {
      // Initialize configuration with default values if not already set
      const defaultConfig: Record<string, any> = {};
      service.steps?.forEach(step => {
        step.options?.forEach(option => {
          if (option.type === 'select' && option.choices && option.choices.length > 0) {
            defaultConfig[option.id] = option.choices[0].value;
            
            // Apply initial price from default selection
            if (option.choices[0].priceAdjustment) {
              setPrice(prev => prev + option.choices[0].priceAdjustment!);
            }
            
            // Apply initial delivery time from default selection
            if (option.choices[0].deliveryTimeAdjustment) {
              setDeliveryTime(prev => prev + option.choices[0].deliveryTimeAdjustment!);
            }
          } else if (option.type === 'checkbox') {
            defaultConfig[option.id] = false;
          }
        });
      });
      
      setConfiguration(defaultConfig);
      setPrice(service.basePrice);
      setDeliveryTime(service.deliveryTime);
    }
  }, [service, initialConfiguration]);

  // Calculate price and update configuration when options change
  const handleOptionChange = (optionId: string, value: any, option: ConfigOption) => {
    // Handle price adjustment for select
    if (option.type === 'select' && option.choices) {
      const oldSelection = configuration[optionId];
      const oldChoice = option.choices.find(c => c.value === oldSelection);
      const newChoice = option.choices.find(c => c.value === value);
      
      // Remove the old price adjustment if it exists
      if (oldChoice && oldChoice.priceAdjustment) {
        setPrice(prev => prev - oldChoice.priceAdjustment!);
      }
      
      // Add the new price adjustment if it exists
      if (newChoice && newChoice.priceAdjustment) {
        setPrice(prev => prev + newChoice.priceAdjustment!);
      }
      
      // Handle delivery time adjustment
      if (oldChoice && oldChoice.deliveryTimeAdjustment) {
        setDeliveryTime(prev => prev - oldChoice.deliveryTimeAdjustment!);
      }
      
      if (newChoice && newChoice.deliveryTimeAdjustment) {
        setDeliveryTime(prev => prev + newChoice.deliveryTimeAdjustment!);
      }
    }
    
    // Handle price adjustment for checkbox
    if (option.type === 'checkbox' && option.priceAdjustment) {
      if (value) {
        setPrice(prev => prev + option.priceAdjustment!);
      } else {
        setPrice(prev => prev - option.priceAdjustment!);
      }
      
      // Handle delivery time adjustment for checkbox
      if (option.deliveryTimeAdjustment) {
        if (value) {
          setDeliveryTime(prev => prev + option.deliveryTimeAdjustment!);
        } else {
          setDeliveryTime(prev => prev - option.deliveryTimeAdjustment!);
        }
      }
    }
    
    // Update configuration
    const newConfig = { ...configuration, [optionId]: value };
    setConfiguration(newConfig);
    
    // Call parent onChange callback
    onChange(newConfig, price, deliveryTime);
  };

  const handleWebsiteUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setWebsiteUrl(url);
    const newConfig = { ...configuration, websiteUrl: url };
    setConfiguration(newConfig);
    onChange(newConfig, price, deliveryTime);
  };

  const handleBriefChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const brief = e.target.value;
    const newConfig = { ...configuration, brief };
    setConfiguration(newConfig);
    onChange(newConfig, price, deliveryTime);
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

  if (!service) {
    return <div>Proszę wybrać usługę, aby kontynuować.</div>;
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="flex justify-between items-start mb-8">
        <div>
          <h2 className="text-3xl font-bold text-dark mb-3">Konfiguracja usługi</h2>
          <p className="text-dark-light">
            Dostosuj parametry usługi <span className="font-medium text-primary">{service.name}</span> do Twoich potrzeb
          </p>
        </div>
        <Card className="shadow-md min-w-[200px]">
          <CardContent className="pt-4">
            <p className="text-sm text-dark-light mb-1">Aktualna wycena:</p>
            <p className="text-2xl font-bold text-dark">{price.toLocaleString()} zł</p>
            <p className="text-xs text-dark-light">
              Czas realizacji: <span>{deliveryTime} dni roboczych</span>
            </p>
          </CardContent>
        </Card>
      </div>

      {service.steps?.map((step: ConfigStep, stepIndex: number) => (
        <motion.div
          key={stepIndex}
          variants={itemVariants}
          className="bg-white rounded-xl p-6 shadow-sm mb-8"
        >
          <h3 className="text-xl font-semibold mb-4">{step.title}</h3>
          
          {step.layout === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {step.options?.map((option: ConfigOption) => renderConfigOption(option))}
            </div>
          ) : step.layout === 'checkbox-grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {step.options?.map((option: ConfigOption) => renderConfigOption(option))}
            </div>
          ) : (
            <div className="space-y-6">
              {step.options?.map((option: ConfigOption) => renderConfigOption(option))}
            </div>
          )}
        </motion.div>
      ))}

      {/* Website URL input */}
      <motion.div variants={itemVariants} className="bg-white rounded-xl p-6 shadow-sm mb-8">
        <h3 className="text-xl font-semibold mb-4">Link do strony</h3>
        <div className="mb-6">
          <Label htmlFor="website-url">Link do strony</Label>
          <Input
            id="website-url"
            type="url"
            placeholder="https://twoja-strona.pl"
            value={websiteUrl}
            onChange={handleWebsiteUrlChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
      </motion.div>

      {/* Brief and file upload */}
      <motion.div variants={itemVariants} className="bg-white rounded-xl p-6 shadow-sm">
        <h3 className="text-xl font-semibold mb-4">Brief projektu</h3>
        
        <div className="mb-6">
          <Label htmlFor="brief">Cele projektu (opcjonalnie)</Label>
          <Textarea
            id="brief"
            rows={3}
            placeholder={`Opisz główne cele, które chcesz osiągnąć dzięki ${service.name}...`}
            value={configuration.brief || ''}
            onChange={handleBriefChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
        
        <div>
          <Label>Dodatkowe pliki</Label>
          <FileUpload onFileUpload={onFileUpload} />
        </div>
      </motion.div>
    </motion.div>
  );

  function renderConfigOption(option: ConfigOption) {
    switch (option.type) {
      case 'select':
        return (
          <div key={option.id}>
            <Label htmlFor={option.id} className="block text-dark-light mb-2 font-medium">
              {option.label}
            </Label>
            <Select
              value={configuration[option.id] || ''}
              onValueChange={(value) => handleOptionChange(option.id, value, option)}
            >
              <SelectTrigger className="w-full border border-gray-300 rounded-lg px-4 py-6 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent">
                <SelectValue placeholder={`Wybierz ${option.label.toLowerCase()}`} />
              </SelectTrigger>
              <SelectContent>
                {option.choices?.map((choice) => (
                  <SelectItem key={choice.value} value={choice.value}>
                    {choice.label} {choice.priceAdjustment ? 
                      `(${choice.priceAdjustment > 0 ? '+' : ''}${choice.priceAdjustment} zł)` : ''}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        );
        
      case 'checkbox':
        // Używamy stylu karty dla pól checkbox w układzie gridowym
        const isInCheckboxGrid = service?.steps?.some(
          step => step.layout === 'checkbox-grid' && step.options?.some(opt => opt.id === option.id)
        );
        
        if (isInCheckboxGrid) {
          return (
            <label 
              key={option.id}
              className={`border border-gray-200 rounded-lg p-4 flex items-start cursor-pointer ${
                configuration[option.id] ? 'border-primary' : ''
              } hover:border-primary transition-colors`}
            >
              <Checkbox 
                id={option.id}
                checked={configuration[option.id] || false}
                onCheckedChange={(checked) => 
                  handleOptionChange(option.id, Boolean(checked), option)
                }
                className="mt-1 h-5 w-5"
              />
              <div className="ml-3">
                <p className="font-medium text-dark">{option.label}</p>
                <p className="text-sm text-dark-light">
                  {option.description} {option.priceAdjustment ? `(+${option.priceAdjustment} zł)` : ''}
                </p>
              </div>
            </label>
          );
        } else {
          return (
            <div key={option.id} className="flex items-center">
              <Checkbox 
                id={option.id}
                checked={configuration[option.id] || false}
                onCheckedChange={(checked) => 
                  handleOptionChange(option.id, Boolean(checked), option)
                }
                className="h-5 w-5"
              />
              <label 
                htmlFor={option.id}
                className="ml-2 text-dark-light cursor-pointer"
              >
                {option.label} {option.priceAdjustment ? `(+${option.priceAdjustment} zł)` : ''}
              </label>
            </div>
          );
        }
        
      default:
        return null;
    }
  }
}
