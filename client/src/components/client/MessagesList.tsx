import React, { useState, useRef, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { SendHorizontal } from 'lucide-react';

interface Message {
  id: number;
  content: string;
  senderId: number;
  receiverId: number;
  isRead: boolean;
  createdAt: string;
}

interface MessagesListProps {
  messages: Message[];
  orderId: number;
  userId: number;
}

export default function MessagesList({ messages, orderId, userId }: MessagesListProps) {
  const [newMessage, setNewMessage] = useState('');
  const [receiverId, setReceiverId] = useState(2); // Default receiver (example: Admin)
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();

  // Scroll to bottom of messages when new messages are added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async (messageData: { orderId: number, content: string, receiverId: number }) => {
      const response = await fetch(`/api/client/orders/${orderId}/messages?userId=${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(messageData),
      });
      
      if (!response.ok) {
        throw new Error('Failed to send message');
      }
      
      return response.json();
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: [`/api/client/orders/${orderId}`, { userId }] });
      setNewMessage('');
    },
  });

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    
    sendMessageMutation.mutate({
      orderId,
      content: newMessage,
      receiverId
    });
  };

  const formatMessageTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' }) + ' • ' + 
           date.toLocaleDateString('pl-PL', { day: 'numeric', month: 'short' });
  };

  // Sort messages by date
  const sortedMessages = [...messages].sort((a, b) => 
    new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );

  if (sortedMessages.length === 0) {
    return (
      <div>
        <div className="text-center py-8 text-gray-500">
          <p>Brak wiadomości. Rozpocznij konwersację.</p>
        </div>
        <form onSubmit={handleSendMessage} className="mt-6">
          <div className="flex flex-col space-y-2">
            <Textarea
              placeholder="Napisz wiadomość..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="min-h-[100px]"
            />
            <Button 
              type="submit" 
              className="self-end"
              disabled={!newMessage.trim() || sendMessageMutation.isPending}
            >
              <SendHorizontal className="h-4 w-4 mr-2" />
              Wyślij wiadomość
            </Button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div>
      <div className="space-y-4 max-h-[400px] overflow-y-auto p-2">
        {sortedMessages.map((message) => {
          const isUserMessage = message.senderId === userId;
          
          return (
            <div 
              key={message.id} 
              className={`flex ${isUserMessage ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex max-w-[80%] ${isUserMessage ? 'flex-row-reverse' : 'flex-row'}`}>
                <Avatar className={`h-8 w-8 ${isUserMessage ? 'ml-2' : 'mr-2'}`}>
                  <AvatarFallback>
                    {isUserMessage ? 'JA' : 'AD'}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div 
                    className={`p-3 rounded-lg ${
                      isUserMessage 
                        ? 'bg-blue-500 text-white rounded-tr-none' 
                        : 'bg-gray-100 text-gray-800 rounded-tl-none'
                    }`}
                  >
                    <p className="whitespace-pre-wrap break-words">{message.content}</p>
                  </div>
                  <div 
                    className={`text-xs text-gray-500 mt-1 ${
                      isUserMessage ? 'text-right' : 'text-left'
                    }`}
                  >
                    {formatMessageTime(message.createdAt)}
                    {isUserMessage && (
                      <span className="ml-1">
                        {message.isRead ? '• Przeczytane' : ''}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>
      
      <form onSubmit={handleSendMessage} className="mt-6">
        <div className="flex flex-col space-y-2">
          <Textarea
            placeholder="Napisz wiadomość..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="min-h-[100px]"
          />
          <Button 
            type="submit" 
            className="self-end"
            disabled={!newMessage.trim() || sendMessageMutation.isPending}
          >
            <SendHorizontal className="h-4 w-4 mr-2" />
            {sendMessageMutation.isPending ? 'Wysyłanie...' : 'Wyślij wiadomość'}
          </Button>
        </div>
      </form>
    </div>
  );
}