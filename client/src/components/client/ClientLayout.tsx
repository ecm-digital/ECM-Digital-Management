import React, { ReactNode } from "react";
import ClientNavigation from "./ClientNavigation";

interface ClientLayoutProps {
  children: ReactNode;
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-background">
      <ClientNavigation />
      <main className="flex-1 max-w-full overflow-hidden">
        {children}
      </main>
    </div>
  );
}