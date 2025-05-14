import { motion } from "framer-motion";

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
  labels?: string[];
}

export default function ProgressBar({ currentStep, totalSteps, labels }: ProgressBarProps) {
  // Create default step labels if translations are missing
  const defaultLabels = Array.from({ length: totalSteps }, (_, i) => `Step ${i + 1}`);
  const steps = labels || defaultLabels;
  
  return (
    <div className="mb-12 relative">
      <div className="flex justify-between relative">
        {steps.map((stepName, index) => (
          <div 
            key={index} 
            className="progress-bar-item relative flex flex-col items-center z-10"
          >
            <motion.div 
              className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 font-medium ${
                index <= currentStep 
                  ? "bg-primary text-white" 
                  : "bg-gray-300 text-dark-light"
              }`}
              initial={{ scale: index === currentStep ? 0.8 : 1 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              {index + 1}
            </motion.div>
            <span className={`text-sm font-medium ${
              index <= currentStep 
                ? "text-dark" 
                : "text-dark-light"
            }`}>
              {stepName}
            </span>
          </div>
        ))}
      </div>
      <motion.div 
        className="absolute top-5 left-0 h-0.5 bg-primary" 
        initial={{ width: 0 }}
        animate={{ width: `${(currentStep / (totalSteps - 1)) * 100}%` }}
        transition={{ duration: 0.5 }}
      />
    </div>
  );
}
