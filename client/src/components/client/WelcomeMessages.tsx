import React from "react";
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
import { CalendarIcon, CheckIcon, ExternalLinkIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface WelcomeMessage {
  id: number;
  userId: number;
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
        throw new Error('Nie udało się oznaczyć wiadomości jako przeczytanej');
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/client/welcome-messages'] });
    },
    onError: (error) => {
      toast({
        title: "Błąd",
        description: `Wystąpił problem: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  // Obsługa oznaczania wiadomości jako przeczytanej
  const handleMarkAsCompleted = (messageId: number) => {
    markAsCompletedMutation.mutate(messageId);
  };

  // Wykonaj akcję
  const handleAction = (message: WelcomeMessage) => {
    // Oznacz jako zrealizowane
    handleMarkAsCompleted(message.id);
    
    // Jeśli typ akcji to "url", przekieruj do URL
    if (message.actionType === "url" && message.actionLabel) {
      window.open(message.actionLabel, "_blank");
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

  // Filtruj tylko nieukończone wiadomości
  const pendingMessages = messages.filter(msg => !msg.isCompleted);

  if (pendingMessages.length === 0) {
    return null;
  }

  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-4">{t('clientPanel.welcomeMessages.title')}</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <AnimatePresence>
          {pendingMessages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="border-primary/20 h-full">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{message.title}</CardTitle>
                    <Badge variant="outline" className="text-xs">
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
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleMarkAsCompleted(message.id)}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <CheckIcon className="h-4 w-4 mr-1" />
                    {t('clientPanel.welcomeMessages.markAsRead')}
                  </Button>
                  
                  {message.actionLabel && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleAction(message)}
                      className="gap-1"
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