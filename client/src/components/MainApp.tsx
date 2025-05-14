import { useState } from "react";
import { motion } from "framer-motion";
import { useLocation } from "wouter";
import ProgressBar from "./ProgressBar";
import ServiceSelection from "./ServiceSelection";
import ServiceConfiguration from "./ServiceConfiguration";
import ContactInformation from "./ContactInformation";
import Summary from "./Summary";
import NavigationButtons from "./NavigationButtons";
import useMultiStepForm from "@/hooks/useMultiStepForm";
import { Service, ServiceOrder } from "@/types";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "react-i18next";
import i18next from "i18next";

// Define the FormData interface locally
interface FormData {
  service: Service | null;
  configuration: Record<string, any>;
  contactInfo: Record<string, any>;
  totalPrice: number;
  deliveryTime: number;
  uploadedFile: File | null;
}

interface MainAppProps {
  services: Service[];
  isLoading: boolean;
}

export default function MainApp({ services, isLoading }: MainAppProps) {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [configuration, setConfiguration] = useState<Record<string, any>>({});
  const [contactInfo, setContactInfo] = useState<Record<string, any>>({});
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [paymentPending, setPaymentPending] = useState(false);
  const [, setLocation] = useLocation();

  // Initial form data
  const initialData: FormData = {
    service: null,
    configuration: {},
    contactInfo: {},
    totalPrice: 0,
    deliveryTime: 0,
    uploadedFile: null,
  };

  // Form state
  const [formData, setFormData] = useState<FormData>(initialData);

  // Update form data when values change
  const updateFormData = (updates: Partial<FormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  // Track the service delivery time
  const [deliveryTime, setDeliveryTime] = useState<number>(0);

  // Calculate total price
  const calculateTotalPrice = (
    service: Service | null, 
    configuration: Record<string, any>
  ): number => {
    if (!service) return 0;
    
    let total = service.basePrice || 0;
    
    // Add prices for selected configuration options
    if (service.configOptions && Object.keys(service.configOptions).length > 0) {
      Object.entries(configuration).forEach(([key, value]) => {
        const option = service.configOptions?.[key];
        if (!option) return;
        
        if (Array.isArray(value)) {
          // For multi-select options
          value.forEach(selectedValue => {
            const priceOption = option.options?.find(opt => opt.value === selectedValue);
            if (priceOption && priceOption.price) {
              total += priceOption.price;
            }
          });
        } else if (typeof value === 'string' || typeof value === 'number') {
          // For single-select options
          const priceOption = option.options?.find(opt => opt.value === value);
          if (priceOption && priceOption.price) {
            total += priceOption.price;
          }
        } else if (typeof value === 'boolean' && value === true) {
          // For boolean options
          if (option.price) {
            total += option.price;
          }
        }
      });
    }
    
    return total;
  };

  // Submit order mutation
  const { mutate, isPending } = useMutation({
    mutationFn: async (data: FormData) => {
      // If there's an uploaded file, first upload it to Firebase Storage
      let fileUrl = null;
      
      if (data.uploadedFile) {
        // In a real application, you would upload the file to Firebase Storage here
        // and get the download URL to store in the service order
        console.log("File would be uploaded here:", data.uploadedFile.name);
        fileUrl = "https://example.com/uploaded-file";
      }
      
      // Create the service order with all the collected data
      const serviceOrder: ServiceOrder = {
        serviceId: data.service?.id || "",
        serviceName: data.service?.name || "",
        configuration: data.configuration,
        contactInfo: data.contactInfo,
        totalPrice: data.totalPrice,
        uploadedFileUrl: fileUrl,
        status: "pending",
        deliveryTime: data.deliveryTime,
        currency: i18next.language === 'pl' ? 'PLN' : 'EUR', 
        createdAt: new Date().toISOString(),
      };
      
      // Send the service order to the backend
      const response = await apiRequest("POST", "/api/orders", serviceOrder);
      return await response.json();
    },
    onSuccess: (data) => {
      toast({
        title: t('order.success.title'),
        description: t('order.success.description'),
      });
      
      // Reset form data after successful submission
      setFormData(initialData);
      setSelectedService(null);
      setConfiguration({});
      setContactInfo({});
      setUploadedFile(null);
      setCurrentStep(0);
    },
    onError: (error) => {
      toast({
        title: t('order.error.title'),
        description: t('order.error.description'),
        variant: "destructive",
      });
      console.error("Error creating order:", error);
    }
  });

  // Multi-step form setup
  const [currentStep, setCurrentStep] = useState(0);
  
  const { steps, currentStepIndex, step, isFirstStep, isLastStep, back, next } = 
    useMultiStepForm([
      // 1. Select a service
      <ServiceSelection 
        key="service-selection"
        services={services}
        isLoading={isLoading}
        selectedService={selectedService}
        onSelectService={(service) => {
          setSelectedService(service);
          setDeliveryTime(service?.deliveryTime || 0);
          setConfiguration({});
          updateFormData({ 
            service,
            configuration: {},
            deliveryTime: service?.deliveryTime || 0,
          });
        }}
      />,
      
      // 2. Configure the service
      <ServiceConfiguration 
        key="service-configuration"
        service={selectedService}
        configuration={configuration}
        onConfigurationChange={(config) => {
          setConfiguration(config);
          const newTotalPrice = calculateTotalPrice(selectedService, config);
          setTotalPrice(newTotalPrice);
          updateFormData({ 
            configuration: config,
            totalPrice: newTotalPrice
          });
        }}
        uploadedFile={uploadedFile}
        onFileUpload={(file) => {
          setUploadedFile(file);
          updateFormData({ uploadedFile: file });
        }}
      />,
      
      // 3. Contact Information
      <ContactInformation 
        key="contact-information"
        contactInfo={contactInfo}
        onContactInfoChange={(info) => {
          setContactInfo(info);
          updateFormData({ contactInfo: info });
        }}
      />,
      
      // 4. Summary and Confirmation
      <Summary 
        key="summary"
        serviceOrder={{
          serviceId: selectedService?.id || "",
          serviceName: selectedService?.name || "",
          configuration,
          contactInfo,
          totalPrice,
          status: "pending",
          deliveryTime,
          currency: i18next.language === 'pl' ? 'PLN' : 'EUR',
          createdAt: new Date().toISOString(),
        }}
        paymentPending={paymentPending}
        onProceedToPayment={() => {
          if (!selectedService) return;
          setPaymentPending(true);
          setLocation(`/checkout?order_id=${selectedService.id}&price=${totalPrice}`);
        }}
      /> 
    ]);

  // Handle next step
  const handleNext = () => {
    // Only allow proceeding to the next step if the current step is valid
    switch (currentStepIndex) {
      case 0:
        // Service Selection - can only proceed if a service is selected
        if (!selectedService) {
          toast({
            title: t('form.error.title'),
            description: t('form.error.selectService'),
            variant: "destructive",
          });
          return;
        }
        break;
      case 2:
        // Contact Information - basic validation
        if (!contactInfo.name || !contactInfo.email) {
          toast({
            title: t('form.error.title'),
            description: t('form.error.requiredFields'),
            variant: "destructive",
          });
          return;
        }
        // Simple email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(contactInfo.email)) {
          toast({
            title: t('form.error.title'),
            description: t('form.error.invalidEmail'),
            variant: "destructive",
          });
          return;
        }
        break;
    }
    
    // All validations passed, proceed to next step
    next();
  };

  // Handle submit
  const handleSubmit = () => {
    // Submit the completed form
    mutate(formData);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <ProgressBar 
          currentStep={currentStepIndex}
          totalSteps={steps.length}
          labels={[
            t('steps.selectService'),
            t('steps.configureService'),
            t('steps.contactInformation'),
            t('steps.review')
          ]}
        />
      </div>
      
      <motion.div
        key={currentStepIndex}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-lg shadow-lg p-6 mb-6"
      >
        {step}
      </motion.div>
      
      {!isLastStep && (
        <NavigationButtons 
          isFirstStep={isFirstStep}
          isSubmitting={isPending}
          onBack={back}
          onNext={handleNext}
        />
      )}
    </div>
  );
}