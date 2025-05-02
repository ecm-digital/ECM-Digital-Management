import { motion } from "framer-motion";

interface ProgressBarProps {
  currentStep: number;
  steps: string[];
}

export default function ProgressBar({ currentStep, steps }: ProgressBarProps) {
  return (
    <div className="mb-12 relative">
      <div className="flex justify-between relative">
        {steps.map((stepName, index) => (
          <div 
            key={stepName} 
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
        animate={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
        transition={{ duration: 0.5 }}
      />
    </div>
  );
}
