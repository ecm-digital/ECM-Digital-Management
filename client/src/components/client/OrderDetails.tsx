import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link, useParams } from 'wouter';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Package, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  Calendar, 
  ArrowRight,
  ArrowLeft,
  FileText,
  MessageSquare,
  Flag,
  Download,
  Upload
} from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Progress } from '@/components/ui/progress';
// Użyjemy komponentów mockowych tymczasowo do celów demonstracyjnych
// W rzeczywistym projekcie zastąpilibyśmy je prawdziwymi implementacjami

// Mock komponentu wiadomości
const MessagesList = ({ messages, orderId, userId }: any) => {
  return (
    <div className="text-center py-8 text-gray-500">
      <p>Komponent wiadomości - obecnie funkcjonalność demonstracyjna</p>
      <p className="text-sm mt-2">Ilość wiadomości: {messages.length}</p>
    </div>
  );
};

// Mock komponentu plików
const FilesUpload = ({ files, orderId }: any) => {
  return (
    <div className="text-center py-8 text-gray-500">
      <p>Komponenty plików - obecnie funkcjonalność demonstracyjna</p>
      <p className="text-sm mt-2">Ilość plików: {files.length}</p>
    </div>
  );
};

interface OrderDetailsData {
  order: {
    id: number;
    orderId: string;
    serviceId: string;
    userId: number;
    status: string;
    totalPrice: number;
    createdAt: string;
    updatedAt: string;
    configuration: Record<string, any>;
    contactInfo: Record<string, any>;
    notes: string;
  };
  service: {
    id: number;
    serviceId: string;
    name: string;
    description: string;
    basePrice: number;
    deliveryTime: number;
    features: string[];
  };
  files: Array<{
    id: number;
    fileName: string;
    fileUrl: string;
    fileType: string;
    fileSize: number;
    uploadedById: number;
    createdAt: string;
  }>;
  messages: Array<{
    id: number;
    content: string;
    senderId: number;
    receiverId: number;
    isRead: boolean;
    createdAt: string;
  }>;
  milestones: Array<{
    id: number;
    title: string;
    description: string;
    status: string;
    dueDate: string;
    completedAt: string | null;
  }>;
}

export default function OrderDetails() {
  const { orderId } = useParams<{ orderId: string }>();
  const userId = 1; // Tymczasowo używamy id=1, później będzie z autentykacji
  const [activeTab, setActiveTab] = useState('details');

  const { data, isLoading, error } = useQuery<OrderDetailsData>({
    queryKey: [`/api/client/orders/${orderId}`, { userId }],
    queryFn: async () => {
      const response = await fetch(`/api/client/orders/${orderId}?userId=${userId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch order details');
      }
      return response.json();
    },
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-40 bg-gray-200 rounded-lg"></div>
          <div className="h-60 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center text-red-700">
          <AlertCircle className="h-5 w-5 mr-2" />
          <p>Nie udało się pobrać danych zamówienia. Spróbuj odświeżyć stronę.</p>
        </div>
        <Link href="/client/orders">
          <Button variant="outline" className="mt-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Powrót do listy zamówień
          </Button>
        </Link>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-center text-yellow-700">
          <AlertCircle className="h-5 w-5 mr-2" />
          <p>Nie znaleziono zamówienia o podanym ID.</p>
        </div>
        <Link href="/client/orders">
          <Button variant="outline" className="mt-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Powrót do listy zamówień
          </Button>
        </Link>
      </div>
    );
  }

  const { order, service, files, messages, milestones } = data;

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
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('pl-PL');
  };

  // Oblicz postęp projektu
  const calculateProgress = () => {
    if (!milestones || milestones.length === 0) return 0;
    const completedMilestones = milestones.filter(m => m.status === 'Zakończone').length;
    return Math.round((completedMilestones / milestones.length) * 100);
  };

  const progress = calculateProgress();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Link href="/client/orders">
              <Button variant="ghost" size="sm" className="p-0">
                <ArrowLeft className="h-4 w-4 mr-1" />
              </Button>
            </Link>
            <h1 className="text-3xl font-bold">Zamówienie {order.orderId}</h1>
            <Badge variant="outline" className={getStatusColor(order.status)}>
              <span className="flex items-center">
                {getStatusIcon(order.status)}
                <span className="ml-1">{order.status}</span>
              </span>
            </Badge>
          </div>
          <p className="text-gray-500">
            Data zamówienia: {getFormattedDate(order.createdAt)}
          </p>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-gray-500 text-sm">Wartość zamówienia</span>
          <span className="text-2xl font-bold">{formatCurrency(order.totalPrice)}</span>
        </div>
      </div>

      {/* Progress bar for project status */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium">Postęp projektu</span>
          <span className="text-sm font-medium">{progress}%</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>
      
      {/* Tabs */}
      <Tabs defaultValue="details" className="mb-8" onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-4 mb-8">
          <TabsTrigger value="details" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            <span className="hidden sm:inline">Szczegóły</span>
          </TabsTrigger>
          <TabsTrigger value="messages" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            <span className="hidden sm:inline">Wiadomości</span>
            {messages.filter(m => !m.isRead && m.receiverId === userId).length > 0 && (
              <Badge variant="destructive" className="ml-1 h-5 w-5 p-0 flex items-center justify-center">
                {messages.filter(m => !m.isRead && m.receiverId === userId).length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="files" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            <span className="hidden sm:inline">Pliki</span>
            <Badge variant="outline" className="ml-1 h-5 w-5 p-0 flex items-center justify-center">
              {files.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="milestones" className="flex items-center gap-2">
            <Flag className="h-4 w-4" />
            <span className="hidden sm:inline">Etapy</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="details">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Informacje o usłudze</CardTitle>
                  <CardDescription>
                    Szczegóły zamówionej usługi
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <h3 className="text-lg font-semibold mb-2">{service.name}</h3>
                  <p className="text-gray-600 mb-4">{service.description}</p>
                  
                  <div className="mb-4">
                    <h4 className="font-medium mb-2">Czas realizacji</h4>
                    <p className="text-gray-600">{service.deliveryTime} dni</p>
                  </div>
                  
                  <div className="mb-4">
                    <h4 className="font-medium mb-2">Zawartość usługi</h4>
                    <ul className="list-disc pl-5 space-y-1">
                      {service.features.map((feature, index) => (
                        <li key={index} className="text-gray-600">{feature}</li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Konfiguracja</CardTitle>
                  <CardDescription>
                    Wybrane opcje i parametry usługi
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {order.configuration && Object.keys(order.configuration).length > 0 ? (
                    <Accordion type="single" collapsible className="w-full">
                      {Object.entries(order.configuration).map(([key, value], index) => (
                        <AccordionItem key={index} value={`item-${index}`}>
                          <AccordionTrigger>{key}</AccordionTrigger>
                          <AccordionContent>
                            {typeof value === 'object' ? (
                              <pre className="text-sm bg-gray-50 p-2 rounded">
                                {JSON.stringify(value, null, 2)}
                              </pre>
                            ) : (
                              <p>{String(value)}</p>
                            )}
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  ) : (
                    <p className="text-gray-500">Brak dodatkowej konfiguracji</p>
                  )}
                </CardContent>
              </Card>
            </div>
            
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Dane kontaktowe</CardTitle>
                </CardHeader>
                <CardContent>
                  {order.contactInfo && Object.keys(order.contactInfo).length > 0 ? (
                    <div className="space-y-4">
                      {Object.entries(order.contactInfo).map(([key, value], index) => (
                        <div key={index}>
                          <h4 className="text-sm font-medium text-gray-500 capitalize">{key.replace(/([A-Z])/g, ' $1')}</h4>
                          <p>{String(value)}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500">Brak danych kontaktowych</p>
                  )}
                </CardContent>
              </Card>
              
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Notatki</CardTitle>
                </CardHeader>
                <CardContent>
                  {order.notes ? (
                    <p className="text-gray-600 whitespace-pre-line">{order.notes}</p>
                  ) : (
                    <p className="text-gray-500">Brak notatek</p>
                  )}
                </CardContent>
              </Card>
              
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Szybkie akcje</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Button 
                      variant="outline" 
                      className="w-full justify-start"
                      onClick={() => setActiveTab('messages')}
                    >
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Wyślij wiadomość
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full justify-start"
                      onClick={() => setActiveTab('files')}
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Dodaj pliki
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="messages">
          <Card>
            <CardHeader>
              <CardTitle>Wiadomości</CardTitle>
              <CardDescription>
                Komunikacja związana z zamówieniem
              </CardDescription>
            </CardHeader>
            <CardContent>
              <MessagesList 
                messages={messages}
                orderId={order.id}
                userId={userId}
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="files">
          <Card>
            <CardHeader>
              <CardTitle>Pliki</CardTitle>
              <CardDescription>
                Pliki związane z zamówieniem
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FilesUpload 
                files={files}
                orderId={order.id}
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="milestones">
          <Card>
            <CardHeader>
              <CardTitle>Etapy projektu</CardTitle>
              <CardDescription>
                Plan realizacji zamówienia
              </CardDescription>
            </CardHeader>
            <CardContent>
              {milestones.length > 0 ? (
                <div className="space-y-6">
                  {milestones.map((milestone, index) => (
                    <div key={milestone.id} className="relative pl-8 pb-8">
                      {/* Vertical line */}
                      {index < milestones.length - 1 && (
                        <div className="absolute left-3 top-3 h-full w-0.5 bg-gray-200"></div>
                      )}
                      
                      {/* Status circle */}
                      <div className={`absolute left-0 top-0 h-6 w-6 rounded-full flex items-center justify-center ${
                        milestone.status === 'Zakończone' 
                          ? 'bg-green-100 text-green-700' 
                          : milestone.status === 'W trakcie'
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-gray-100 text-gray-700'
                      }`}>
                        {milestone.status === 'Zakończone' ? (
                          <CheckCircle2 className="h-4 w-4" />
                        ) : (
                          <span className="text-xs font-bold">{index + 1}</span>
                        )}
                      </div>
                      
                      <div className="mb-1 flex justify-between items-center">
                        <h3 className="font-medium">{milestone.title}</h3>
                        <Badge variant="outline" className={
                          milestone.status === 'Zakończone' 
                            ? 'bg-green-100 text-green-800' 
                            : milestone.status === 'W trakcie'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-gray-100 text-gray-800'
                        }>
                          {milestone.status}
                        </Badge>
                      </div>
                      
                      <p className="text-sm text-gray-500 mb-2">
                        {milestone.completedAt 
                          ? `Zakończono: ${getFormattedDate(milestone.completedAt)}` 
                          : `Planowana data: ${getFormattedDate(milestone.dueDate)}`
                        }
                      </p>
                      
                      <p className="text-gray-600">{milestone.description}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <Flag className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>Brak zdefiniowanych etapów dla tego zamówienia.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}