import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart3, 
  FileText, 
  MessageSquare, 
  Package, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  Calendar, 
  ArrowRight 
} from 'lucide-react';

interface DashboardData {
  ordersCount: number;
  activeOrders: number;
  completedOrders: number;
  unreadMessages: number;
  totalSpent: number;
  recentOrders: any[];
}

export default function ClientDashboard() {
  const userId = 1; // Tymczasowo używamy id=1, później będzie z autentykacji

  const { data: dashboardData, isLoading, error } = useQuery<DashboardData>({
    queryKey: ['/api/client/dashboard', { userId }],
    queryFn: async () => {
      // W rzeczywistym projekcie to będzie obsługiwane przez middleware uwierzytelniające
      const response = await fetch(`/api/client/dashboard?userId=${userId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch dashboard data');
      }
      return response.json();
    },
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
          <div className="h-64 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center text-red-700">
          <AlertCircle className="h-5 w-5 mr-2" />
          <p>Nie udało się pobrać danych. Spróbuj odświeżyć stronę.</p>
        </div>
      </div>
    );
  }

  // Użyj danych testowych jeśli prawdziwe dane jeszcze nie są dostępne
  const data = dashboardData || {
    ordersCount: 0,
    activeOrders: 0,
    completedOrders: 0,
    unreadMessages: 0,
    totalSpent: 0,
    recentOrders: []
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pl-PL', {
      style: 'currency',
      currency: 'PLN',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Nowe':
        return 'bg-blue-100 text-blue-800';
      case 'W realizacji':
        return 'bg-yellow-100 text-yellow-800';
      case 'Zakończone':
        return 'bg-green-100 text-green-800';
      case 'Anulowane':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Nowe':
        return <Package className="h-4 w-4" />;
      case 'W realizacji':
        return <Clock className="h-4 w-4" />;
      case 'Zakończone':
        return <CheckCircle2 className="h-4 w-4" />;
      case 'Anulowane':
        return <AlertCircle className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const getRelativeTimeString = (date: string) => {
    const now = new Date();
    const pastDate = new Date(date);
    const diffMs = now.getTime() - pastDate.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return 'dzisiaj';
    } else if (diffDays === 1) {
      return 'wczoraj';
    } else if (diffDays < 7) {
      return `${diffDays} dni temu`;
    } else {
      return pastDate.toLocaleDateString('pl-PL');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Panel klienta</h1>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col">
              <div className="flex items-center mb-2">
                <Package className="h-5 w-5 text-blue-500 mr-2" />
                <span className="text-gray-500 text-sm">Wszystkie zamówienia</span>
              </div>
              <div className="text-3xl font-bold">{data.ordersCount}</div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col">
              <div className="flex items-center mb-2">
                <Clock className="h-5 w-5 text-yellow-500 mr-2" />
                <span className="text-gray-500 text-sm">Aktywne zamówienia</span>
              </div>
              <div className="text-3xl font-bold">{data.activeOrders}</div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col">
              <div className="flex items-center mb-2">
                <MessageSquare className="h-5 w-5 text-purple-500 mr-2" />
                <span className="text-gray-500 text-sm">Nieprzeczytane wiadomości</span>
              </div>
              <div className="text-3xl font-bold">{data.unreadMessages}</div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col">
              <div className="flex items-center mb-2">
                <BarChart3 className="h-5 w-5 text-green-500 mr-2" />
                <span className="text-gray-500 text-sm">Wydatki całkowite</span>
              </div>
              <div className="text-3xl font-bold">{formatCurrency(data.totalSpent)}</div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Recent Orders */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-xl">Ostatnie zamówienia</CardTitle>
          <CardDescription>
            Lista Twoich ostatnich zamówień wraz z ich statusem
          </CardDescription>
        </CardHeader>
        <CardContent>
          {data.recentOrders.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>Nie masz jeszcze żadnych zamówień</p>
              <Link href="/services">
                <Button variant="outline" className="mt-4">
                  Przeglądaj usługi
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {data.recentOrders.map((order) => (
                <div key={order.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center">
                        <h3 className="font-medium">{order.orderId}</h3>
                        <Badge variant="outline" className={`ml-2 ${getStatusColor(order.status)}`}>
                          <span className="flex items-center">
                            {getStatusIcon(order.status)}
                            <span className="ml-1">{order.status}</span>
                          </span>
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">
                        <Calendar className="inline h-3 w-3 mr-1" /> 
                        Zamówiono: {getRelativeTimeString(order.createdAt)}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">{formatCurrency(order.totalPrice)}</div>
                      <Link href={`/client/orders/${order.orderId}`}>
                        <Button variant="ghost" size="sm" className="text-sm mt-1">
                          Szczegóły <ArrowRight className="h-3 w-3 ml-1" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Link href="/client/orders">
            <Button variant="outline">Zobacz wszystkie zamówienia</Button>
          </Link>
        </CardFooter>
      </Card>
      
      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Szybkie akcje</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link href="/services">
              <Button variant="outline" className="w-full justify-start">
                <Package className="h-4 w-4 mr-2" />
                Zamów nową usługę
              </Button>
            </Link>
            <Link href="/client/messages">
              <Button variant="outline" className="w-full justify-start">
                <MessageSquare className="h-4 w-4 mr-2" />
                Sprawdź wiadomości
                {data.unreadMessages > 0 && (
                  <Badge className="ml-2 bg-red-500 text-white">{data.unreadMessages}</Badge>
                )}
              </Button>
            </Link>
            <Link href="/client/profile">
              <Button variant="outline" className="w-full justify-start">
                <FileText className="h-4 w-4 mr-2" />
                Edytuj profil
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}