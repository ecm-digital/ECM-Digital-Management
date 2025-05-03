import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Package, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  Calendar, 
  ArrowRight,
  Search,
  Filter
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Order {
  id: number;
  orderId: string;
  serviceId: string;
  userId: number;
  status: string;
  totalPrice: number;
  createdAt: string;
  configuration: any;
}

export default function OrdersList() {
  const userId = 1; // Tymczasowo używamy id=1, później będzie z autentykacji
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const { data: orders = [], isLoading, error } = useQuery<Order[]>({
    queryKey: ['/api/client/orders', { userId }],
    queryFn: async () => {
      // W rzeczywistym projekcie to będzie obsługiwane przez middleware uwierzytelniające
      const response = await fetch(`/api/client/orders?userId=${userId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }
      return response.json();
    },
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
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

  const getFormattedDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pl-PL');
  };

  // Filtrowanie zamówień
  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.orderId.toLowerCase().includes(searchQuery.toLowerCase()) || 
      order.serviceId.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = 
      statusFilter === 'all' || 
      order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Moje zamówienia</h1>
        <Link href="/client/dashboard">
          <Button variant="outline">Powrót do panelu</Button>
        </Link>
      </div>
      
      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Szukaj po ID zamówienia"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="w-full md:w-48">
          <Select
            value={statusFilter}
            onValueChange={setStatusFilter}
          >
            <SelectTrigger className="w-full">
              <div className="flex items-center">
                <Filter className="mr-2 h-4 w-4 text-gray-400" />
                <SelectValue placeholder="Status" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Wszystkie</SelectItem>
              <SelectItem value="Nowe">Nowe</SelectItem>
              <SelectItem value="W realizacji">W realizacji</SelectItem>
              <SelectItem value="Zakończone">Zakończone</SelectItem>
              <SelectItem value="Anulowane">Anulowane</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {/* Orders List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Lista zamówień</CardTitle>
          <CardDescription>
            Wszystkie Twoje zamówienia i ich statusy
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredOrders.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Package className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              {orders.length === 0 ? (
                <p>Nie masz jeszcze żadnych zamówień</p>
              ) : (
                <p>Brak zamówień spełniających kryteria wyszukiwania</p>
              )}
              <Link href="/services">
                <Button variant="outline" className="mt-4">
                  Przeglądaj usługi
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredOrders.map((order) => (
                <div key={order.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex flex-col md:flex-row justify-between items-start">
                    <div>
                      <div className="flex items-center flex-wrap gap-2 mb-2">
                        <h3 className="font-medium">Zamówienie: {order.orderId}</h3>
                        <Badge variant="outline" className={getStatusColor(order.status)}>
                          <span className="flex items-center">
                            {getStatusIcon(order.status)}
                            <span className="ml-1">{order.status}</span>
                          </span>
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-500">
                        <Calendar className="inline h-3 w-3 mr-1" /> 
                        Data zamówienia: {getFormattedDate(order.createdAt)}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        ID usługi: {order.serviceId}
                      </p>
                    </div>
                    <div className="mt-4 md:mt-0 md:text-right w-full md:w-auto">
                      <div className="font-semibold">{formatCurrency(order.totalPrice)}</div>
                      <Link href={`/client/orders/${order.orderId}`}>
                        <Button size="sm" className="mt-2 w-full md:w-auto">
                          Szczegóły <ArrowRight className="ml-1 h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}