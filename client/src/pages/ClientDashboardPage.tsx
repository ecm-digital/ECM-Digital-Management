import React from "react";
import ClientLayout from "../components/client/ClientLayout";
import ClientDashboard from "../components/client/ClientDashboard";

export default function ClientDashboardPage() {
  return (
    <ClientLayout>
      <ClientDashboard />
    </ClientLayout>
  );
}