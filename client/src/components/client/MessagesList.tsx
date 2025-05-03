import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2, AlertCircle, Send } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { formatDistance } from "date-fns";
import { pl } from "date-fns/locale";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: number;
  content: string;
  senderId: number;
  receiverId: number;
  isRead: boolean;
  createdAt: string;
  senderName?: string;
}

interface MessagesListProps {
  orderId: number | string;
}

export default function MessagesList({ orderId }: MessagesListProps) {
  const [newMessage, setNewMessage] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: [`/api/client/orders/${orderId}/messages`],
    retry: false,
  });

  const sendMessageMutation = useMutation({
    mutationFn: async (content: string) => {
      const response = await fetch(`/api/client/orders/${orderId}/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content }),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Nie udało się wysłać wiadomości");
      }
      
      return response.json();
    },
    onSuccess: () => {
      setNewMessage("");
      toast({
        title: "Wiadomość wysłana",
        description: "Twoja wiadomość została pomyślnie wysłana.",
      });
      queryClient.invalidateQueries({ queryKey: [`/api/client/orders/${orderId}/messages`] });
    },
    onError: (error) => {
      toast({
        title: "Błąd podczas wysyłania wiadomości",
        description: error.message || "Spróbuj ponownie później.",
        variant: "destructive",
      });
    },
  });

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    sendMessageMutation.mutate(newMessage);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && e.ctrlKey) {
      handleSendMessage();
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[200px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="mt-4 text-muted-foreground">Ładowanie wiadomości...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[200px]">
        <AlertCircle className="h-8 w-8 text-destructive" />
        <p className="mt-4 text-muted-foreground">Wystąpił błąd podczas ładowania wiadomości.</p>
      </div>
    );
  }

  const messages = data?.messages || [];
  const currentUserId = data?.currentUserId;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Wiadomości</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6 mb-6">
            {messages.length > 0 ? (
              messages.map((message: Message) => (
                <MessageItem 
                  key={message.id} 
                  message={message} 
                  isCurrentUser={message.senderId === currentUserId} 
                />
              ))
            ) : (
              <div className="text-center py-10">
                <p className="text-muted-foreground">Brak wiadomości. Rozpocznij konwersację!</p>
              </div>
            )}
          </div>
          
          <div className="space-y-2">
            <Textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Wpisz wiadomość... (Ctrl+Enter aby wysłać)"
              rows={3}
              className="resize-none"
            />
            <div className="flex justify-end">
              <Button 
                onClick={handleSendMessage} 
                disabled={!newMessage.trim() || sendMessageMutation.isPending}
                className="flex items-center gap-2"
              >
                {sendMessageMutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
                Wyślij
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Ctrl+Enter aby szybko wysłać wiadomość.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function MessageItem({ message, isCurrentUser }: { message: Message, isCurrentUser: boolean }) {
  return (
    <div className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-[80%] ${isCurrentUser ? 'bg-primary text-primary-foreground' : 'bg-muted'} p-4 rounded-lg`}>
        <div className="flex justify-between items-center mb-1">
          <span className="font-medium text-sm">
            {isCurrentUser ? 'Ty' : message.senderName || 'Pracownik ECM Digital'}
          </span>
          <span className="text-xs opacity-70">
            {formatDistance(new Date(message.createdAt), new Date(), { addSuffix: true, locale: pl })}
          </span>
        </div>
        <p className="whitespace-pre-wrap">{message.content}</p>
      </div>
    </div>
  );
}