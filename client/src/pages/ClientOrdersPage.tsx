import React from "react";
import ClientLayout from "../components/client/ClientLayout";
import OrdersList from "../components/client/OrdersList";

export default function ClientOrdersPage() {
  return (
    <ClientLayout>
      <OrdersList />
    </ClientLayout>
  );
}