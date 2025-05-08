import React from 'react';
import { useAuth } from '@/hooks/use-auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

const ClientDashboardPage = () => {
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
      <h1 className="text-3xl font-bold mb-6">Panel Klienta</h1>
      
      <p className="text-gray-600 mb-8">
        Witaj, {user?.username}! Tutaj możesz zarządzać swoimi zamówieniami i ustawieniami konta.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Twoje dane</CardTitle>
            <CardDescription>Podstawowe informacje o twoim koncie</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Nazwa użytkownika</p>
                <p className="font-medium">{user?.username}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium">{user?.email || 'Nie podano'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Rola</p>
                <p className="font-medium">{user?.role || 'client'}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Ostatnie zamówienia</CardTitle>
            <CardDescription>Podsumowanie twoich ostatnich zamówień</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-500">Nie masz jeszcze żadnych zamówień.</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Szybkie akcje</CardTitle>
            <CardDescription>Popularne funkcje panelu klienta</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li className="text-primary hover:underline cursor-pointer">Zamów nową usługę</li>
              <li className="text-primary hover:underline cursor-pointer">Skontaktuj się z supportem</li>
              <li className="text-primary hover:underline cursor-pointer">Edytuj profil</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ClientDashboardPage;