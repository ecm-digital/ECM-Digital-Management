import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Loader2, AlertCircle, CheckCircle, Clock, Search, Calendar, Inbox } from "lucide-react";
import { formatDistance } from "date-fns";
import { pl } from "date-fns/locale";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type OrderStatus = "Wszystkie" | "Nowe" | "W realizacji" | "Zakończone" | "Anulowane";

export default function OrdersList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<OrderStatus>("Wszystkie");

  const { data, isLoading, isError } = useQuery({
    queryKey: ["/api/client/orders"],
    retry: false,
  });

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="mt-4 text-muted-foreground">Ładowanie zamówień...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <AlertCircle className="h-12 w-12 text-destructive" />
        <p className="mt-4 text-muted-foreground">Wystąpił błąd podczas ładowania zamówień.</p>
        <Button variant="outline" className="mt-4">
          Spróbuj ponownie
        </Button>
      </div>
    );
  }

  const orders = data?.orders || [];

  // Filtrowanie zamówień
  const filteredOrders = orders.filter(order => {
    // Filtrowanie po statusie
    if (statusFilter !== "Wszystkie" && order.status !== statusFilter) {
      return false;
    }
    
    // Filtrowanie po wyszukiwanym terminie
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      return (
        order.orderId?.toLowerCase().includes(searchLower) ||
        order.serviceName?.toLowerCase().includes(searchLower) ||
        order.serviceId?.toLowerCase().includes(searchLower)
      );
    }
    
    return true;
  });

  return (
    <div className="container px-4 py-8 mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Twoje zamówienia</h1>
          <p className="text-muted-foreground mt-1">
            Zarządzaj zamówieniami i śledź ich status
          </p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative w-full md:w-2/3">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Szukaj zamówienia..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as OrderStatus)}>
          <SelectTrigger className="w-full md:w-1/3">
            <SelectValue placeholder="Filtruj po statusie" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Wszystkie">Wszystkie</SelectItem>
            <SelectItem value="Nowe">Nowe</SelectItem>
            <SelectItem value="W realizacji">W realizacji</SelectItem>
            <SelectItem value="Zakończone">Zakończone</SelectItem>
            <SelectItem value="Anulowane">Anulowane</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Tabs defaultValue="wszystkie" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="wszystkie" className="flex items-center gap-2">
            <Inbox className="h-4 w-4" />
            <span>Wszystkie</span>
            <Badge variant="outline" className="ml-1 bg-muted">{orders.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="aktywne" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span>Aktywne</span>
            <Badge variant="outline" className="ml-1 bg-muted">
              {orders.filter(order => order.status === "Nowe" || order.status === "W realizacji").length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="zakonczone" className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            <span>Zakończone</span>
            <Badge variant="outline" className="ml-1 bg-muted">
              {orders.filter(order => order.status === "Zakończone").length}
            </Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="wszystkie" className="mt-0">
          <OrdersGrid orders={filteredOrders} />
        </TabsContent>

        <TabsContent value="aktywne" className="mt-0">
          <OrdersGrid 
            orders={orders.filter(order => 
              (order.status === "Nowe" || order.status === "W realizacji") &&
              (statusFilter === "Wszystkie" || order.status === statusFilter) &&
              (!searchTerm || 
                order.orderId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                order.serviceName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                order.serviceId?.toLowerCase().includes(searchTerm.toLowerCase())
              )
            )} 
          />
        </TabsContent>

        <TabsContent value="zakonczone" className="mt-0">
          <OrdersGrid 
            orders={orders.filter(order => 
              order.status === "Zakończone" &&
              (statusFilter === "Wszystkie" || order.status === statusFilter) &&
              (!searchTerm || 
                order.orderId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                order.serviceName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                order.serviceId?.toLowerCase().includes(searchTerm.toLowerCase())
              )
            )} 
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

interface Order {
  id: number | string;
  orderId: string;
  serviceId: string;
  serviceName?: string;
  status: string;
  totalPrice: number;
  createdAt: string;
  deadline?: string;
}

interface OrdersGridProps {
  orders: Order[];
}

function OrdersGrid({ orders }: OrdersGridProps) {
  if (orders.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
          <Inbox className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-medium">Brak zamówień</h3>
        <p className="text-muted-foreground mt-2">
          Nie znaleziono żadnych zamówień spełniających kryteria.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {orders.map((order) => (
        <OrderCard key={order.id} order={order} />
      ))}
    </div>
  );
}

function OrderCard({ order }: { order: Order }) {
  const statusColors = {
    "Nowe": "bg-blue-500",
    "W realizacji": "bg-amber-500",
    "Zakończone": "bg-green-500",
    "Anulowane": "bg-red-500"
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Nowe": return <Clock className="h-4 w-4" />;
      case "W realizacji": return <Loader2 className="h-4 w-4" />;
      case "Zakończone": return <CheckCircle className="h-4 w-4" />;
      case "Anulowane": return <AlertCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{order.serviceName || 'Usługa #' + order.serviceId}</CardTitle>
          <Badge className={`${statusColors[order.status as keyof typeof statusColors] || 'bg-gray-500'} flex items-center gap-1 text-white`}>
            {getStatusIcon(order.status)}
            {order.status}
          </Badge>
        </div>
        <CardDescription>
          Zamówienie #{order.orderId}
          {order.createdAt && (
            <span className="ml-2">
              • Złożone {formatDistance(new Date(order.createdAt), new Date(), { addSuffix: true, locale: pl })}
            </span>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-3">
          {order.deadline && (
            <div className="flex items-center text-sm text-muted-foreground mb-2">
              <Calendar className="h-4 w-4 mr-2" />
              <span>Termin: {formatDistance(new Date(order.deadline), new Date(), { addSuffix: true, locale: pl })}</span>
            </div>
          )}
          <div className="text-sm text-muted-foreground">Wartość zamówienia</div>
          <div className="font-semibold">{order.totalPrice} zł</div>
        </div>
        <Link href={`/client/orders/${order.id}`}>
          <Button variant="outline" className="w-full">Szczegóły zamówienia</Button>
        </Link>
      </CardContent>
    </Card>
  );
}