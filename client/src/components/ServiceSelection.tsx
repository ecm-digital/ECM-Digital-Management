import { motion } from "framer-motion";
import { Service } from "@/types";
import { FcSearch, FcAdvertising, FcHome, FcAutomatic } from "react-icons/fc";
import { Skeleton } from "@/components/ui/skeleton";

interface ServiceSelectionProps {
  services: Service[];
  isLoading: boolean;
  onSelectService: (service: Service) => void;
  selectedService: Service | null;
}

export default function ServiceSelection({
  services,
  isLoading,
  onSelectService,
  selectedService,
}: ServiceSelectionProps) {
  // Map service IDs to icons
  const serviceIcons = {
    "1": <FcSearch className="h-6 w-6" />,
    "2": <FcAdvertising className="h-6 w-6" />,
    "3": <FcHome className="h-6 w-6" />,
    "4": <FcAutomatic className="h-6 w-6" />
  };

  // Mock services for loading state
  const loadingServices = Array(4).fill(0);

  // Animation variants for container
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1
      }
    }
  };

  // Animation variants for items
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: 'spring', stiffness: 300, damping: 24 }
    }
  };

  return (
    <div>
      <h2 className="text-3xl font-bold text-dark mb-6">Wybierz usługę</h2>
      <p className="text-dark-light mb-10 max-w-2xl">
        Wybierz jedną z naszych specjalistycznych usług, aby rozpocząć proces
        konfiguracji dopasowany do potrzeb Twojego biznesu.
      </p>

      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {isLoading ? (
          loadingServices.map((_, index) => (
            <div key={index} className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="flex items-start mb-4">
                <Skeleton className="h-12 w-12 rounded-lg" />
                <div className="ml-4 flex-1">
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-1/3" />
                </div>
              </div>
              <div className="flex gap-2">
                <Skeleton className="h-6 w-20 rounded-full" />
                <Skeleton className="h-6 w-20 rounded-full" />
                <Skeleton className="h-6 w-20 rounded-full" />
              </div>
            </div>
          ))
        ) : (
          services.map((service) => (
            <motion.div
              key={service.id}
              variants={itemVariants}
              className={`service-card bg-white rounded-xl p-6 border ${
                selectedService?.id === service.id
                  ? "border-primary shadow-md"
                  : "border-gray-200"
              } hover:border-primary hover:shadow-md transition-all cursor-pointer`}
              onClick={() => onSelectService(service)}
            >
              <div className="flex items-start mb-4">
                <div className="bg-primary/10 p-3 rounded-lg">
                  {serviceIcons[service.id as keyof typeof serviceIcons] || (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-primary"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                  )}
                </div>
                <div className="ml-4">
                  <h3 className="text-xl font-semibold mb-1">{service.name}</h3>
                  <p className="text-dark-light mb-2">{service.description}</p>
                  <p className="text-primary font-medium">
                    Od {service.basePrice.toLocaleString()} zł
                  </p>
                </div>
              </div>
              <div className="text-sm text-dark-light flex flex-wrap gap-2">
                <span className="bg-gray-100 rounded-full px-3 py-1">
                  {service.deliveryTime} dni
                </span>
                {service.features?.map((feature, index) => (
                  <span key={index} className="bg-gray-100 rounded-full px-3 py-1">
                    {feature}
                  </span>
                ))}
              </div>
            </motion.div>
          ))
        )}
      </motion.div>
    </div>
  );
}
