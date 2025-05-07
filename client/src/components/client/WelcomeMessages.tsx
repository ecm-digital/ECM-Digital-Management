import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, CheckIcon, ExternalLinkIcon, XCircleIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface WelcomeMessage {
  id: number;
  userId: string; // Zmienione z number na string po migracji do Replit Auth
  step: number;
  title: string;
  content: string;
  actionLabel?: string;
  actionType?: string;
  isCompleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export function WelcomeMessages() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [completedIds, setCompletedIds] = useState<number[]>([]);

  // Pobieramy wiadomości powitalne
  const { data: messages, isLoading } = useQuery<WelcomeMessage[]>({
    queryKey: ['/api/client/welcome-messages'],
    refetchOnWindowFocus: false,
  });

  // Mutacja do oznaczania wiadomości jako przeczytanej
  const markAsCompletedMutation = useMutation({
    mutationFn: async (messageId: number) => {
      const response = await fetch(`/api/client/welcome-messages/${messageId}/complete`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(t('clientPanel.welcomeMessages.error'));
      }
      
      return response.json();
    },
    onSuccess: (_, messageId) => {
      // Dodaj ID do lokalnego stanu przetworzonych wiadomości (dla animacji)
      setCompletedIds(prev => [...prev, messageId]);
      
      // Po 500ms odśwież dane z serwera
      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: ['/api/client/welcome-messages'] });
      }, 500);
      
      toast({
        title: t('clientPanel.welcomeMessages.completed'),
        description: t('clientPanel.welcomeMessages.markAsRead'),
      });
    },
    onError: (error) => {
      toast({
        title: t('clientPanel.welcomeMessages.error'),
        description: `${error.message}`,
        variant: "destructive",
      });
    },
  });

  // Obsługa oznaczania wiadomości jako przeczytanej
  const handleMarkAsCompleted = (messageId: number) => {
    if (!completedIds.includes(messageId)) {
      markAsCompletedMutation.mutate(messageId);
    }
  };

  // Wykonaj akcję
  const handleAction = (message: WelcomeMessage) => {
    // Oznacz jako zrealizowane
    handleMarkAsCompleted(message.id);
    
    // Jeśli typ akcji to "url", przekieruj do URL
    if (message.actionType === "url" && message.actionLabel) {
      window.open(message.actionLabel, "_blank");
    } else if (message.actionType === "profile") {
      // Przekieruj do profilu
      window.location.href = "/client/profile";
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!messages || messages.length === 0) {
    return null;
  }

  // Filtruj wiadomości, które nie są jeszcze oznaczone jako ukończone
  const pendingMessages = messages.filter(msg => 
    !msg.isCompleted && !completedIds.includes(msg.id)
  );

  if (pendingMessages.length === 0) {
    return null;
  }

  // Efekt konfetti dla ukończonych wiadomości
  const confettiVariants = {
    initial: { opacity: 0, scale: 0 },
    animate: {
      opacity: [0, 1, 0],
      scale: [0, 1.2, 0],
      transition: { duration: 0.5 }
    }
  };
  
  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-4">{t('clientPanel.welcomeMessages.title')}</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <AnimatePresence mode="wait">
          {pendingMessages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ 
                opacity: 0, 
                y: -50, 
                scale: 0.9,
                transition: { 
                  duration: 0.5,
                  ease: "easeInOut"
                }
              }}
              transition={{ duration: 0.4 }}
              className="relative"
            >
              {/* Konfetti efekt - pojawiają się przy ukończeniu */}
              {completedIds.includes(message.id) && (
                <>
                  <motion.div
                    className="absolute -top-4 -left-4 w-8 h-8 bg-green-500 rounded-full z-10"
                    variants={confettiVariants}
                    initial="initial"
                    animate="animate"
                  />
                  <motion.div
                    className="absolute -top-4 -right-4 w-8 h-8 bg-blue-500 rounded-full z-10"
                    variants={confettiVariants}
                    initial="initial"
                    animate="animate"
                  />
                  <motion.div
                    className="absolute -bottom-4 -left-4 w-8 h-8 bg-pink-500 rounded-full z-10"
                    variants={confettiVariants}
                    initial="initial"
                    animate="animate"
                  />
                  <motion.div
                    className="absolute -bottom-4 -right-4 w-8 h-8 bg-purple-500 rounded-full z-10"
                    variants={confettiVariants}
                    initial="initial"
                    animate="animate"
                  />
                </>
              )}
              
              <Card 
                className={`border-primary/20 h-full overflow-hidden ${
                  completedIds.includes(message.id) ? 'border-green-500/50 bg-green-50/50 dark:bg-green-950/10' : ''
                }`}
              >
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{message.title}</CardTitle>
                    <Badge 
                      variant="outline"
                      className={`text-xs ${completedIds.includes(message.id) ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : ""}`}
                    >
                      {t('clientPanel.welcomeMessages.step')} {message.step}
                    </Badge>
                  </div>
                  <CardDescription className="flex items-center text-xs">
                    <CalendarIcon className="h-3 w-3 mr-1" />
                    {new Date(message.createdAt).toLocaleDateString()}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pb-3">
                  <div className="prose prose-sm max-w-none">
                    <p>{message.content}</p>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between pt-0">
                  <Button 
                    variant={completedIds.includes(message.id) ? "ghost" : "ghost"}
                    size="sm"
                    onClick={() => handleMarkAsCompleted(message.id)}
                    className={`${
                      completedIds.includes(message.id) 
                      ? "text-green-700 dark:text-green-400 bg-green-100 dark:bg-green-900/30 hover:bg-green-200 dark:hover:bg-green-800/40" 
                      : "text-muted-foreground hover:text-foreground"
                    }`}
                    disabled={completedIds.includes(message.id) || markAsCompletedMutation.isPending}
                  >
                    {completedIds.includes(message.id) ? (
                      <>
                        <CheckIcon className="h-4 w-4 mr-1" />
                        {t('clientPanel.welcomeMessages.completed')}
                      </>
                    ) : (
                      <>
                        <CheckIcon className="h-4 w-4 mr-1" />
                        {t('clientPanel.welcomeMessages.markAsRead')}
                      </>
                    )}
                  </Button>
                  
                  {message.actionLabel && !completedIds.includes(message.id) && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleAction(message)}
                      className="gap-1"
                      disabled={markAsCompletedMutation.isPending}
                    >
                      <ExternalLinkIcon className="h-4 w-4" />
                      {message.actionLabel}
                    </Button>
                  )}
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}