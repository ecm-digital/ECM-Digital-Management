import React, { ReactNode } from "react";
import ClientNavigation from "./ClientNavigation";
import OnboardingWrapper from "./OnboardingWrapper";
import { useQuery } from "@tanstack/react-query";

interface ClientLayoutProps {
  children: ReactNode;
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  // Sprawdzamy, czy użytkownik ma uprawnienia do panelu klienta
  const { data: user, isLoading } = useQuery({
    queryKey: ['/api/client/profile'],
    refetchOnWindowFocus: false,
  });

  // Podczas ładowania pokazujemy prosty spinner
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Jeśli nie ma użytkownika, oznacza to błąd autoryzacji
  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center max-w-md p-6">
          <h1 className="text-2xl font-bold mb-4">Brak dostępu</h1>
          <p className="mb-4">Nie masz uprawnień do panelu klienta lub wystąpił błąd autoryzacji.</p>
          <a 
            href="/" 
            className="inline-block bg-primary text-white px-4 py-2 rounded hover:bg-primary/90 transition-colors"
          >
            Wróć do strony głównej
          </a>
        </div>
      </div>
    );
  }

  // Gdy mamy zalogowanego użytkownika, sprawdzamy czy przeszedł onboarding
  const mainContent = (
    <div className="flex flex-col md:flex-row min-h-screen bg-background">
      <ClientNavigation />
      <main className="flex-1 max-w-full overflow-hidden">
        {children}
      </main>
    </div>
  );

  // Owijamy główną treść w OnboardingWrapper, który wyświetli onboarding jeśli potrzeba
  return (
    <OnboardingWrapper>
      {mainContent}
    </OnboardingWrapper>
  );
}