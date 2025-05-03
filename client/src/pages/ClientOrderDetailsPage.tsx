import React from "react";
import ClientLayout from "../components/client/ClientLayout";
import OrderDetails from "../components/client/OrderDetails";

export default function ClientOrderDetailsPage() {
  return (
    <ClientLayout>
      <OrderDetails />
    </ClientLayout>
  );
}