import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { AnimatePresence, motion } from 'framer-motion';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  MessageSquare,
  Bot,
  ChevronDown,
  X,
  Send,
  User,
  RefreshCw,
  Loader,
} from 'lucide-react';

// Tymczasowy hook useAuth do momentu zaimplementowania prawdziwej autoryzacji
interface User {
  id: string;
  [key: string]: any;
}

const useAuth = () => {
  return {
    user: { id: 'guest-user' } as User,
    isAuthenticated: false
  };
};

// Typ pojedynczej wiadomości
interface ChatMessage {
  id: number;
  sessionId: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  userId?: string;
  metadata?: any;
}

// Typ sesji czatu
interface ChatSession {
  id: string;
  name: string;
  createdAt: string;
  lastActive: string;
  isActive: boolean;
}

// Komponent główny widgetu czatu
export const ChatWidget: React.FC = () => {
  const { t } = useTranslation();
  const { user, isAuthenticated } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Tymczasowa implementacja zamiast WebSocketa
  const connected = true; // Zakładamy, że jesteśmy połączeni
  
  // Funkcja która będzie używana do tworzenia sesji
  const createSession = (params: { userId?: string | null, name?: string }) => {
    // Tworzymy tymczasowe ID sesji
    const sessionId = `temp-${Date.now()}`;
    setCurrentSessionId(sessionId);
    
    // Wiadomość powitalna
    const welcomeMessage: ChatMessage = {
      id: Date.now(),
      sessionId,
      role: 'assistant',
      content: 'Witaj! Jestem chatbotem ECM Digital. W czym mogę Ci pomóc? Zapytaj mnie o naszą ofertę, usługi UX/UI, lub inne kwestie.',
      timestamp: new Date().toISOString(),
      userId: params.userId || undefined,
      metadata: { isWelcomeMessage: true }
    };
    
    setMessages([welcomeMessage]);
  };
  
  // Funkcja do wysyłania wiadomości (symulacja odpowiedzi)
  const sendMessage = (params: any) => {
    // Symulacja opóźnienia odpowiedzi (0.5-1.5s)
    setTimeout(() => {
      const responseMessage: ChatMessage = {
        id: Date.now(),
        sessionId: params.sessionId,
        role: 'assistant',
        content: 'To jest tymczasowa odpowiedź chatbota. Pełna funkcjonalność zostanie wdrożona wkrótce. Dziękujemy za cierpliwość!',
        timestamp: new Date().toISOString(),
        userId: params.userId
      };
      
      setMessages(prev => [...prev, responseMessage]);
      setIsLoading(false);
    }, 500 + Math.random() * 1000);
  };
  
  // Przewijanie na dół po otrzymaniu nowej wiadomości
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Utworzenie sesji przy pierwszym otwarciu chatu
  useEffect(() => {
    if (isOpen && !currentSessionId && connected) {
      handleCreateSession();
    }
  }, [isOpen, connected, currentSessionId]);

  // Tworzenie nowej sesji
  const handleCreateSession = async () => {
    const userId = isAuthenticated ? user?.id : null;
    createSession({ userId });
  };

  // Wysłanie wiadomości
  const handleSendMessage = () => {
    if (!message.trim() || !currentSessionId) return;
    
    // Dodaj wiadomość użytkownika do listy lokalnie
    const userMessage: ChatMessage = {
      id: Date.now(), // Tymczasowe ID
      sessionId: currentSessionId,
      role: 'user',
      content: message,
      timestamp: new Date().toISOString(),
      userId: isAuthenticated ? user?.id : undefined,
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    
    // Wyślij przez WebSocket
    sendMessage({
      type: 'chat_message',
      sessionId: currentSessionId,
      content: message,
      userId: isAuthenticated ? user?.id : undefined,
    });
    
    // Wyczyść pole tekstowe
    setMessage('');
  };

  // Obsługa klawisza Enter - wysłanie wiadomości
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Render każdej wiadomości
  const renderMessage = (msg: ChatMessage) => {
    const isUser = msg.role === 'user';
    
    return (
      <motion.div
        key={msg.id}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`flex gap-3 mb-4 ${isUser ? 'flex-row-reverse' : ''}`}
      >
        <div className={`h-8 w-8 rounded-full flex items-center justify-center ${isUser ? 'bg-blue-600' : 'bg-green-600'} text-white`}>
          {isUser ? <User size={16} /> : <Bot size={16} />}
        </div>
        
        <div className={`max-w-[75%] rounded-lg px-4 py-2 ${
          isUser ? 'bg-blue-600 text-white ml-auto' : 'bg-gray-100 dark:bg-gray-800'
        }`}>
          <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
          <span className="text-xs opacity-70 mt-1 block">
            {new Date(msg.timestamp).toLocaleTimeString()}
          </span>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {/* Przycisk otwierania chatu */}
      <motion.button
        className={`bg-green-600 text-white p-3 rounded-full shadow-lg hover:bg-green-700 transition-all`}
        onClick={() => setIsOpen(!isOpen)}
        whileTap={{ scale: 0.9 }}
        aria-label={isOpen ? t('chat.closeChat', 'Zamknij czat') : t('chat.openChat', 'Otwórz czat')}
      >
        {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
      </motion.button>

      {/* Okno chatu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="absolute bottom-16 right-0 w-[350px] bg-white dark:bg-gray-900 rounded-lg shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-700"
          >
            {/* Nagłówek */}
            <div className="bg-green-600 text-white p-3 flex justify-between items-center">
              <h3 className="font-semibold">{t('chat.title', 'Czat z ECM Digital')}</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="hover:bg-green-700 p-1 rounded"
                aria-label={t('chat.closeChat', 'Zamknij czat')}
              >
                <ChevronDown size={18} />
              </button>
            </div>

            {/* Obszar wiadomości */}
            <ScrollArea className="h-[350px] p-4">
              <div className="flex flex-col">
                {messages.map(renderMessage)}
                
                {/* Wskaźnik ładowania */}
                {isLoading && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex gap-3 mb-4"
                  >
                    <div className="h-8 w-8 bg-green-600 rounded-full flex items-center justify-center text-white">
                      <Bot size={16} />
                    </div>
                    <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-3">
                      <Loader size={16} className="animate-spin" />
                    </div>
                  </motion.div>
                )}
                
                {/* Referencja do przewijania na dół */}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Pole wiadomości */}
            <div className="p-3 border-t border-gray-200 dark:border-gray-700 flex">
              <Textarea 
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder={t('chat.messagePlaceholder', 'Wpisz wiadomość...')}
                className="min-h-10 resize-none flex-1 mr-2"
                disabled={!connected || isLoading}
              />
              <Button 
                onClick={handleSendMessage}
                disabled={!message.trim() || !connected || isLoading}
                size="icon"
                className="bg-green-600 hover:bg-green-700"
              >
                <Send size={18} />
              </Button>
            </div>
            
            {/* Status połączenia */}
            <div className="px-3 py-1 text-xs bg-gray-100 dark:bg-gray-800 flex items-center justify-end">
              {connected ? (
                <span className="text-green-600 flex items-center gap-1">
                  <span className="w-2 h-2 bg-green-600 rounded-full"></span>
                  {t('chat.connected', 'Połączono')}
                </span>
              ) : (
                <span className="text-yellow-600 flex items-center gap-1">
                  <RefreshCw size={12} className="animate-spin" />
                  {t('chat.connecting', 'Łączenie...')}
                </span>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ChatWidget;