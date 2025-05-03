import React from "react";
import Layout from "../components/Layout";
import OrdersList from "../components/client/OrdersList";

export default function ClientOrdersPage() {
  return (
    <Layout>
      <OrdersList />
    </Layout>
  );
}