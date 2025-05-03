import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "wouter";
import { Loader2, AlertCircle, CheckCircle, Clock, Calendar, ArrowLeft, FileText, MessageSquare } from "lucide-react";
import { formatDistance, format } from "date-fns";
import { pl } from "date-fns/locale";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MessagesList from "./MessagesList";
import FilesUpload from "./FilesUpload";

export default function OrderDetails() {
  const [, params] = useParams();
  const orderId = params?.orderId;

  const { data: orderData, isLoading: orderLoading, isError: orderError } = useQuery({
    queryKey: [`/api/client/orders/${orderId}`],
    retry: false,
  });

  const { data: milestoneData, isLoading: milestonesLoading } = useQuery({
    queryKey: [`/api/client/orders/${orderId}/milestones`],
    retry: false,
  });

  if (orderLoading || milestonesLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="mt-4 text-muted-foreground">Ładowanie szczegółów zamówienia...</p>
      </div>
    );
  }

  if (orderError || !orderData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <AlertCircle className="h-12 w-12 text-destructive" />
        <p className="mt-4 text-muted-foreground">Wystąpił błąd podczas ładowania szczegółów zamówienia.</p>
        <Link href="/client/orders">
          <Button variant="outline" className="mt-4">
            Wróć do listy zamówień
          </Button>
        </Link>
      </div>
    );
  }

  const order = orderData.order;
  const milestones = milestoneData?.milestones || [];

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
    <div className="container px-4 py-8 mx-auto">
      <div className="flex items-center mb-6">
        <Link href="/client/orders">
          <Button variant="ghost" size="icon" className="mr-2">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">
            {order.serviceName || `Usługa #${order.serviceId}`}
          </h1>
          <p className="text-muted-foreground mt-1">
            Zamówienie #{order.orderId}
            {order.createdAt && (
              <span className="ml-2">
                • Złożone {formatDistance(new Date(order.createdAt), new Date(), { addSuffix: true, locale: pl })}
              </span>
            )}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Tabs defaultValue="details" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="details" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                <span>Szczegóły</span>
              </TabsTrigger>
              <TabsTrigger value="messages" className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                <span>Wiadomości</span>
              </TabsTrigger>
              <TabsTrigger value="files" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                <span>Pliki</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Informacje o zamówieniu</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Status zamówienia</h3>
                      <div className="mt-1">
                        <Badge className={`${statusColors[order.status as keyof typeof statusColors] || 'bg-gray-500'} flex items-center gap-1 text-white`}>
                          {getStatusIcon(order.status)}
                          {order.status}
                        </Badge>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Data złożenia</h3>
                      <p className="mt-1">{order.createdAt ? format(new Date(order.createdAt), 'dd MMMM yyyy', { locale: pl }) : 'Nie określono'}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Wartość zamówienia</h3>
                      <p className="mt-1 font-semibold">{order.totalPrice} zł</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Czas realizacji</h3>
                      <p className="mt-1">{order.deliveryTime} dni</p>
                    </div>
                    {order.deadline && (
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground">Termin realizacji</h3>
                        <p className="mt-1 flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          <span>{format(new Date(order.deadline), 'dd MMMM yyyy', { locale: pl })}</span>
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Konfiguracja usługi</CardTitle>
                </CardHeader>
                <CardContent>
                  {order.configuration && Object.keys(order.configuration).length > 0 ? (
                    <div className="space-y-3">
                      {Object.entries(order.configuration).map(([key, value]) => (
                        <div key={key} className="grid grid-cols-1 md:grid-cols-3 gap-2">
                          <h3 className="text-sm font-medium text-muted-foreground">{key}</h3>
                          <p className="md:col-span-2">{value}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">Brak dodatkowej konfiguracji.</p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Dane kontaktowe</CardTitle>
                </CardHeader>
                <CardContent>
                  {order.contactInfo && Object.keys(order.contactInfo).length > 0 ? (
                    <div className="space-y-3">
                      {Object.entries(order.contactInfo).map(([key, value]) => {
                        if (key === 'message') return null; // Wiadomość pokażemy osobno
                        return (
                          <div key={key} className="grid grid-cols-1 md:grid-cols-3 gap-2">
                            <h3 className="text-sm font-medium text-muted-foreground">
                              {key === 'name' ? 'Imię i nazwisko' :
                               key === 'email' ? 'Email' :
                               key === 'phone' ? 'Telefon' :
                               key === 'company' ? 'Firma' : key}
                            </h3>
                            <p className="md:col-span-2">{value}</p>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">Brak danych kontaktowych.</p>
                  )}

                  {/* Wiadomość od klienta */}
                  {order.contactInfo && order.contactInfo.message && (
                    <div className="mt-4">
                      <h3 className="text-sm font-medium text-muted-foreground mb-2">Wiadomość dodatkowa</h3>
                      <div className="bg-muted p-3 rounded-md">
                        <p>{order.contactInfo.message}</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="messages">
              <MessagesList orderId={order.id} />
            </TabsContent>

            <TabsContent value="files">
              <FilesUpload orderId={order.id} />
            </TabsContent>
          </Tabs>
        </div>

        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Status projektu</CardTitle>
              <CardDescription>Kamienie milowe projektu</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {milestones && milestones.length > 0 ? (
                  milestones.map((milestone, index) => (
                    <MilestoneItem key={milestone.id} milestone={milestone} isLast={index === milestones.length - 1} />
                  ))
                ) : (
                  <p className="text-muted-foreground text-center py-4">
                    Brak zdefiniowanych kamieni milowych dla tego projektu.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

interface Milestone {
  id: number;
  title: string;
  description: string;
  status: string;
  dueDate: string;
  completedAt: string | null;
}

interface MilestoneItemProps {
  milestone: Milestone;
  isLast: boolean;
}

function MilestoneItem({ milestone, isLast }: MilestoneItemProps) {
  const statusColors = {
    "Oczekujące": "border-blue-500",
    "W trakcie": "border-amber-500",
    "Zakończone": "border-green-500",
    "Opóźnione": "border-red-500"
  };
  
  const statusBgColors = {
    "Oczekujące": "bg-blue-500",
    "W trakcie": "bg-amber-500",
    "Zakończone": "bg-green-500",
    "Opóźnione": "bg-red-500"
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Oczekujące": return <Clock className="h-4 w-4" />;
      case "W trakcie": return <Loader2 className="h-4 w-4" />;
      case "Zakończone": return <CheckCircle className="h-4 w-4" />;
      case "Opóźnione": return <AlertCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  return (
    <div className="relative">
      <div className={`flex items-start ${!isLast ? "pb-8" : ""}`}>
        <div className={`mt-1 rounded-full w-5 h-5 flex items-center justify-center ${statusBgColors[milestone.status as keyof typeof statusBgColors] || 'bg-gray-500'} z-10`}>
          {getStatusIcon(milestone.status)}
        </div>
        
        {!isLast && (
          <div className={`absolute top-6 left-2 h-full w-[2px] ${statusColors[milestone.status as keyof typeof statusColors] || 'border-gray-500'}`} />
        )}
        
        <div className="ml-4">
          <h3 className="font-medium">{milestone.title}</h3>
          <p className="text-sm text-muted-foreground mt-1">{milestone.description}</p>
          
          <div className="mt-2 flex items-center text-xs text-muted-foreground">
            {milestone.status === "Zakończone" && milestone.completedAt ? (
              <span>Zakończono {formatDistance(new Date(milestone.completedAt), new Date(), { addSuffix: true, locale: pl })}</span>
            ) : (
              milestone.dueDate && (
                <span>Planowane zakończenie: {formatDistance(new Date(milestone.dueDate), new Date(), { addSuffix: true, locale: pl })}</span>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}