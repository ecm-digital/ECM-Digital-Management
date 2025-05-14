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
  // Stan dla przetwarzania płatności
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

  // Multi-step form hook
  const { 
    currentStepIndex, 
    step, 
    steps, 
    isFirstStep, 
    isLastStep, 
    goTo, 
    next, 
    back 
  } = useMultiStepForm([
    { 
      component: <ServiceSelection 
        services={services} 
        isLoading={isLoading} 
        onSelect={(service) => {
          setSelectedService(service);
          updateFormData({ 
            service,
            totalPrice: service.basePrice,
            deliveryTime: service.deliveryTime
          });
        }} 
        selectedService={selectedService} 
      /> 
    },
    { 
      component: <ServiceConfiguration 
        service={selectedService} 
        onChange={(config, price, deliveryTime) => {
          setConfiguration(config);
          setTotalPrice(price);
          updateFormData({ 
            configuration: config,
            totalPrice: price,
            deliveryTime
          });
        }}
        onFileUpload={(file) => {
          setUploadedFile(file);
          updateFormData({ uploadedFile: file });
        }}
        initialConfiguration={configuration}
        initialPrice={totalPrice}
      /> 
    },
    { 
      component: <ContactInformation 
        onChange={(info) => {
          setContactInfo(info);
          updateFormData({ contactInfo: info });
        }}
        initialContactInfo={contactInfo}
        totalPrice={totalPrice}
        service={selectedService}
      /> 
    },
    { 
      component: <Summary 
        serviceOrder={{
          service: selectedService,
          configuration,
          contactInfo,
          totalPrice,
          uploadedFile,
          deliveryTime: formData.deliveryTime
        }} 
        paymentPending={paymentPending}
        onProceedToPayment={() => {
          if (!selectedService) return;
          setPaymentPending(true);
          setLocation(`/checkout?order_id=${selectedService.id}&price=${totalPrice}`);
        }}
      /> 
    }
  ]);

  // Submit order mutation
  const { mutate, isPending } = useMutation({
    mutationFn: async (data: FormData) => {
      // If there's an uploaded file, first upload it to Firebase Storage
      let fileUrl = null;
      
      if (data.uploadedFile) {
        const formData = new FormData();
        formData.append('file', data.uploadedFile);
        
        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
          credentials: 'include'
        });
        
        if (!response.ok) {
          throw new Error(t('errors.fileUploadFailed'));
        }
        
        const { url } = await response.json();
        fileUrl = url;
      }
      
      // Submit order with file URL if present
      const orderData = {
        ...data,
        fileUrl,
        uploadedFile: null, // Don't send the file object to the API
        createdAt: new Date().toISOString()
      };
      
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(orderData),
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error(t('errors.orderSubmissionFailed'));
      }
      
      return response.json();
    },
    onSuccess: () => {
      // Go to final step (summary)
      goTo(steps.length - 1);
      toast({
        title: t('configurator.orderSubmitted'),
        description: t('configurator.orderAccepted'),
      });
    },
    onError: (error) => {
      toast({
        title: t('common.error'),
        description: t('configurator.orderError', { error: error.message }),
        variant: "destructive"
      });
    }
  });

  // Handle next button
  const handleNext = () => {
    if (isLastStep) {
      // Submit the form
      mutate(formData);
    } else {
      // Validate current step
      if (currentStepIndex === 0 && !selectedService) {
        toast({
          title: t('configurator.selectService'),
          description: t('configurator.pleaseSelectService'),
          variant: "destructive"
        });
        return;
      }
      
      if (currentStepIndex === 2) {
        // Validate contact info
        const { name, email, company } = contactInfo;
        if (!name || !email || !company) {
          toast({
            title: t('configurator.completeData'),
            description: t('configurator.fillRequiredFields'),
            variant: "destructive"
          });
          return;
        }
      }
      
      next();
    }
  };

  // Reset application
  const handleRestart = () => {
    setSelectedService(null);
    setConfiguration({});
    setContactInfo({});
    setUploadedFile(null);
    setTotalPrice(0);
    setFormData(initialData);
    goTo(0);
  };

  return (
    <motion.div 
      className="flex-1 py-8 px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-5xl mx-auto">
        {/* Header with logo */}
        <header className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-2xl font-bold text-[#0F52BA]">ECM Digital</h1>
          </div>
          <div>
            <button 
              onClick={handleRestart}
              className="text-dark-light hover:text-dark text-sm font-medium flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              {t('configurator.startAgain')}
            </button>
          </div>
        </header>

        {/* Progress Bar */}
        <ProgressBar 
          currentStep={currentStepIndex} 
          steps={[
            t('configurator.steps.serviceSelection'), 
            t('configurator.steps.configuration'), 
            t('configurator.steps.contactInfo'), 
            t('configurator.steps.summary')
          ]} 
        />

        {/* Step Container */}
        <motion.div 
          className="mb-8"
          key={currentStepIndex}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          {step.component}
        </motion.div>

        {/* Navigation Buttons */}
        {!isLastStep && (
          <NavigationButtons 
            onPrev={back} 
            onNext={handleNext} 
            isFirstStep={isFirstStep} 
            isLastStep={isLastStep} 
            isSubmitting={isPending}
          />
        )}
      </div>
    </motion.div>
  );
}
