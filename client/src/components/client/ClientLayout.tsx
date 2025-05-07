import React, { ReactNode } from "react";
import ClientNavigation from "./ClientNavigation";
import OnboardingWrapper from "./OnboardingWrapper";
import { useAuth } from "../../hooks/useAuth";

interface ClientLayoutProps {
  children: ReactNode;
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  // Sprawdzamy, czy użytkownik jest zalogowany używając hooka useAuth
  const { user, isLoading, isAuthenticated } = useAuth();

  // Podczas ładowania pokazujemy prosty spinner
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Jeśli użytkownik nie jest zalogowany, pokazujemy przycisk logowania
  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center max-w-md p-6">
          <h1 className="text-2xl font-bold mb-4">Zaloguj się do panelu klienta</h1>
          <p className="mb-4">Aby uzyskać dostęp do panelu klienta, musisz się zalogować.</p>
          <a 
            href="/api/login" 
            className="inline-block bg-primary text-white px-4 py-2 rounded hover:bg-primary/90 transition-colors"
          >
            Zaloguj się
          </a>
          <div className="mt-4">
            <a 
              href="/" 
              className="text-primary hover:underline"
            >
              Wróć do strony głównej
            </a>
          </div>
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