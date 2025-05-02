import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

interface WelcomeScreenProps {
  onStart: () => void;
}

export default function WelcomeScreen({ onStart }: WelcomeScreenProps) {
  return (
    <motion.div 
      className="min-h-screen flex flex-col items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-3xl w-full mx-auto text-center">
        <div className="mb-8">
          <svg className="h-16 mx-auto mb-8" viewBox="0 0 300 50" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 10H20V40H40V10H50V50H10V10Z" fill="#0F52BA"/>
            <path d="M60 10H100V20H70V25H95V35H70V40H100V50H60V10Z" fill="#0F52BA"/>
            <path d="M110 10H130V50H110V10Z" fill="#0F52BA"/>
            <text x="140" y="40" fontFamily="Inter" fontSize="24" fontWeight="bold" fill="#0F52BA">Digital</text>
          </svg>
          
          <h1 className="text-4xl md:text-5xl font-bold text-dark mb-6">Skonfiguruj usługę dla swojej marki</h1>
          <p className="text-lg text-dark-light mb-10">Stwórz idealne rozwiązanie dostosowane do potrzeb Twojego biznesu</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div className="bg-white rounded-xl p-6 shadow-lg flex flex-col items-center text-center">
              <div className="w-full h-48 relative rounded-lg mb-4 overflow-hidden bg-gray-100">
                <svg className="w-full h-full text-gray-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Profesjonalne podejście</h3>
              <p className="text-dark-light">Skorzystaj z naszego doświadczenia i nowoczesnych rozwiązań</p>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-lg flex flex-col items-center text-center">
              <div className="w-full h-48 relative rounded-lg mb-4 overflow-hidden bg-gray-100">
                <svg className="w-full h-full text-gray-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Dopasowane rozwiązania</h3>
              <p className="text-dark-light">Wybierz i skonfiguruj usługi idealnie dopasowane do Twoich potrzeb</p>
            </div>
          </div>
          
          <Button 
            onClick={onStart} 
            className="bg-accent hover:bg-accent/90 text-white font-medium rounded-lg px-8 py-6 text-lg transition-colors shadow-md"
          >
            Rozpocznij konfigurację
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
