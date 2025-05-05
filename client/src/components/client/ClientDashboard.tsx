import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Loader2, AlertCircle, CheckCircle, Clock } from "lucide-react";
import { formatDistance } from "date-fns";
import { pl, de } from "date-fns/locale";
import { useTranslation } from "react-i18next";

export default function ClientDashboard() {
  const { t, i18n } = useTranslation();
  const { data, isLoading, isError } = useQuery({
    queryKey: ["/api/client/dashboard"],
    retry: false,
  });

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="mt-4 text-muted-foreground">{t('clientPanel.loading')}</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <AlertCircle className="h-12 w-12 text-destructive" />
        <p className="mt-4 text-muted-foreground">{t('clientPanel.error')}</p>
        <Button variant="outline" className="mt-4">
          {t('clientPanel.tryAgain')}
        </Button>
      </div>
    );
  }

  // Gdy używamy testowego endpointu (możemy dostosować to później do właściwego API)
  const { recentOrders, unreadMessages, upcomingMilestones } = data || {
    recentOrders: [],
    unreadMessages: 0,
    upcomingMilestones: [],
  };

  return (
    <div className="container px-4 py-8 mx-auto">
      <h1 className="text-3xl font-bold mb-2">{t('clientPanel.title')}</h1>
      <p className="text-muted-foreground mb-8">
        {t('clientPanel.welcome')}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard title={t('clientPanel.orders')} value={recentOrders?.length || 0} description={t('clientPanel.allOrders')} />
        <StatCard title={t('clientPanel.unreadMessages')} value={unreadMessages || 0} description={t('clientPanel.waitingToRead')} />
        <StatCard title={t('clientPanel.upcomingMilestones')} value={upcomingMilestones?.length || 0} description={t('clientPanel.inNext14Days')} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <section>
          <h2 className="text-xl font-semibold mb-4">{t('clientPanel.recentOrders')}</h2>
          <div className="space-y-4">
            {recentOrders && recentOrders.length > 0 ? (
              recentOrders.map((order) => (
                <OrderCard key={order.id} order={order} />
              ))
            ) : (
              <EmptyState message={t('clientPanel.noOrders')} />
            )}
          </div>
          <div className="mt-4">
            <Link href="/client/orders">
              <Button variant="outline" className="w-full">{t('clientPanel.viewAllOrders')}</Button>
            </Link>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">{t('clientPanel.upcomingMilestones')}</h2>
          <div className="space-y-4">
            {upcomingMilestones && upcomingMilestones.length > 0 ? (
              upcomingMilestones.map((milestone) => (
                <MilestoneCard key={milestone.id} milestone={milestone} />
              ))
            ) : (
              <EmptyState message={t('clientPanel.noMilestones')} />
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

function StatCard({ title, value, description }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-xl">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-3xl font-bold">{value}</p>
      </CardContent>
    </Card>
  );
}

function OrderCard({ order }) {
  const { t, i18n } = useTranslation();
  const locale = i18n.language === 'de' ? de : pl;
  
  const statusColors = {
    "Nowe": "bg-blue-500",
    "W realizacji": "bg-amber-500",
    "Zakończone": "bg-green-500",
    "Anulowane": "bg-red-500"
  };

  const getStatusIcon = (status) => {
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
          <Badge className={`${statusColors[order.status] || 'bg-gray-500'} flex items-center gap-1 text-white`}>
            {getStatusIcon(order.status)}
            {order.status}
          </Badge>
        </div>
        <CardDescription>
          {t('clientPanel.orderNumber')} #{order.orderId}
          {order.createdAt && (
            <span className="ml-2">
              • {formatDistance(new Date(order.createdAt), new Date(), { addSuffix: true, locale })}
            </span>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-muted-foreground">{t('clientPanel.orderValue')}</p>
            <p className="font-semibold">{order.totalPrice} zł</p>
          </div>
          <Link href={`/client/orders/${order.id}`}>
            <Button variant="outline" size="sm">{t('clientPanel.details')}</Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

function MilestoneCard({ milestone }) {
  const { t, i18n } = useTranslation();
  const locale = i18n.language === 'de' ? de : pl;
  
  const statusColors = {
    "Oczekujące": "bg-blue-500",
    "W trakcie": "bg-amber-500",
    "Zakończone": "bg-green-500",
    "Opóźnione": "bg-red-500"
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{milestone.title}</CardTitle>
          <Badge className={`${statusColors[milestone.status] || 'bg-gray-500'} text-white`}>
            {milestone.status}
          </Badge>
        </div>
        <CardDescription>
          {t('clientPanel.orderNumber')} #{milestone.orderNumber || milestone.orderId}
          {milestone.dueDate && (
            <span className="ml-2">
              • {formatDistance(new Date(milestone.dueDate), new Date(), { addSuffix: true, locale })}
            </span>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm">{milestone.description}</p>
        <div className="flex justify-end mt-2">
          <Link href={`/client/orders/${milestone.orderId}`}>
            <Button variant="outline" size="sm">{t('clientPanel.viewOrder')}</Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

function EmptyState({ message }) {
  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center p-6">
        <p className="text-muted-foreground text-center">{message}</p>
      </CardContent>
    </Card>
  );
}