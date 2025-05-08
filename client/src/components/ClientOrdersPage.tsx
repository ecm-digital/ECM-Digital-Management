import React from 'react';
import { useAuth } from '@/hooks/use-auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

const ClientOrdersPage = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-6">Twoje Zamówienia</h1>
      
      <p className="text-gray-600 mb-8">
        Witaj, {user?.username}! Tutaj możesz zobaczyć historię swoich zamówień i śledzić ich status.
      </p>
      
      <Card>
        <CardHeader>
          <CardTitle>Brak zamówień</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500">Nie masz jeszcze żadnych zamówień. Zapraszamy do zamówienia jednej z naszych usług.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default ClientOrdersPage;