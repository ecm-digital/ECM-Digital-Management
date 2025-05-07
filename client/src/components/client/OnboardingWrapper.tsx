import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";

// Definiujemy typy dla danych z API
interface OnboardingStatusResponse {
  step: number;
  completed: boolean;
  industry?: string;
  projectType?: string;
  preferences?: {
    goal?: string;
    [key: string]: any;
  };
}

// Default empty response dla TypeScript
const emptyResponse: OnboardingStatusResponse = {
  step: 0,
  completed: false,
  industry: "",
  projectType: "",
  preferences: { goal: "" }
};

// Definiujemy schemat do walidacji formularza
const onboardingSchema = z.object({
  industry: z.string().min(1, { message: "Wybierz branżę" }),
  projectType: z.string().min(1, { message: "Wybierz typ projektu" }),
  goal: z.string().min(5, { message: "Opisz swój cel biznesowy" }),
});

type OnboardingFormValues = z.infer<typeof onboardingSchema>;

interface OnboardingProps {
  children: React.ReactNode;
}

export default function OnboardingWrapper({ children }: OnboardingProps) {
  const { t } = useTranslation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [step, setStep] = useState(0);
  
  // Pobieramy aktualny status onboardingu
  const { data: onboardingStatus, isLoading } = useQuery<OnboardingStatusResponse>({
    queryKey: ['/api/client/onboarding/status'],
    refetchOnWindowFocus: false,
  });

  // Aktualizacja kroku onboardingu
  const updateStepMutation = useMutation({
    mutationFn: async (newStep: number) => {
      const response = await fetch('/api/client/onboarding/step', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ step: newStep }),
      });
      
      if (!response.ok) {
        throw new Error('Nie udało się zaktualizować kroku onboardingu');
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/client/onboarding/status'] });
    },
    onError: (error) => {
      toast({
        title: "Błąd",
        description: `Nie udało się zaktualizować kroku: ${error.message}`,
        variant: "destructive",
      });
    },
  });
  
  // Zakończenie onboardingu
  const completeOnboardingMutation = useMutation({
    mutationFn: async (data: OnboardingFormValues) => {
      const response = await fetch('/api/client/onboarding/complete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          preferences: { goal: data.goal },
          industry: data.industry,
          projectType: data.projectType,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Nie udało się zakończyć onboardingu');
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/client/onboarding/status'] });
      toast({
        title: "Gotowe!",
        description: "Twój panel klienta jest gotowy do użycia",
      });
    },
    onError: (error) => {
      toast({
        title: "Błąd",
        description: `Nie udało się zakończyć onboardingu: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  // Bezpieczny dostęp do danych
  const safeOnboardingStatus = onboardingStatus || emptyResponse;
  
  // Ustawiamy krok z danych z API
  useEffect(() => {
    if (safeOnboardingStatus) {
      setStep(safeOnboardingStatus.step);
    }
  }, [safeOnboardingStatus]);

  // Formularz dla kroku 3 (informacje o projekcie)
  const form = useForm<OnboardingFormValues>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      industry: safeOnboardingStatus.industry || "",
      projectType: safeOnboardingStatus.projectType || "",
      goal: safeOnboardingStatus.preferences?.goal || "",
    },
  });

  // Jeśli onboarding jest już zakończony, renderujemy dzieci (normalny widok panelu klienta)
  if (safeOnboardingStatus.completed) {
    return <>{children}</>;
  }

  // Jeśli wciąż ładujemy dane, pokazujemy loader
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Przejście do następnego kroku
  const nextStep = () => {
    const newStep = step + 1;
    setStep(newStep);
    updateStepMutation.mutate(newStep);
  };

  // Przejście do poprzedniego kroku
  const prevStep = () => {
    const newStep = Math.max(0, step - 1);
    setStep(newStep);
    updateStepMutation.mutate(newStep);
  };

  // Przesyłanie formularza (krok 3)
  const onSubmit = (data: OnboardingFormValues) => {
    completeOnboardingMutation.mutate(data);
  };

  // Pomijanie onboardingu
  const skipOnboarding = () => {
    completeOnboardingMutation.mutate({
      industry: "unknown",
      projectType: "unknown",
      goal: "Not specified",
    });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-background to-secondary/10 p-4">
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-3xl"
        >
          {step === 0 && (
            <Card className="border-primary/20 shadow-lg">
              <CardHeader className="space-y-1 text-center">
                <CardTitle className="text-3xl">{t('clientPanel.onboarding.title')}</CardTitle>
                <CardDescription className="text-lg">
                  {t('clientPanel.onboarding.subtitle')}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 text-center">
                <p className="text-lg">
                  {t('clientPanel.onboarding.step1.content')}
                </p>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={skipOnboarding}>
                  {t('clientPanel.onboarding.skip')}
                </Button>
                <Button onClick={nextStep}>
                  {t('clientPanel.onboarding.next')}
                </Button>
              </CardFooter>
            </Card>
          )}

          {step === 1 && (
            <Card className="border-primary/20 shadow-lg">
              <CardHeader className="space-y-1">
                <CardTitle>{t('clientPanel.onboarding.step2.title')}</CardTitle>
                <CardDescription>
                  {t('clientPanel.onboarding.step2.content')}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-primary/5 rounded-lg p-4 text-center hover:bg-primary/10 transition-colors">
                    <div className="text-3xl mb-2">📊</div>
                    <h3 className="font-medium">{t('clientPanel.dashboard')}</h3>
                    <p className="text-sm text-muted-foreground">
                      Przegląd wszystkich Twoich projektów, wiadomości i terminów
                    </p>
                  </div>
                  <div className="bg-primary/5 rounded-lg p-4 text-center hover:bg-primary/10 transition-colors">
                    <div className="text-3xl mb-2">📂</div>
                    <h3 className="font-medium">{t('clientPanel.orders')}</h3>
                    <p className="text-sm text-muted-foreground">
                      Szczegóły zamówień, pliki i komunikacja z zespołem
                    </p>
                  </div>
                  <div className="bg-primary/5 rounded-lg p-4 text-center hover:bg-primary/10 transition-colors">
                    <div className="text-3xl mb-2">👤</div>
                    <h3 className="font-medium">{t('clientPanel.profile')}</h3>
                    <p className="text-sm text-muted-foreground">
                      Zarządzanie profilem i preferencjami
                    </p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={prevStep}>
                  {t('clientPanel.onboarding.previous')}
                </Button>
                <Button onClick={nextStep}>
                  {t('clientPanel.onboarding.next')}
                </Button>
              </CardFooter>
            </Card>
          )}

          {step === 2 && (
            <Card className="border-primary/20 shadow-lg">
              <CardHeader className="space-y-1">
                <CardTitle>{t('clientPanel.onboarding.step3.title')}</CardTitle>
                <CardDescription>
                  {t('clientPanel.onboarding.step3.content')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                      control={form.control}
                      name="industry"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('clientPanel.onboarding.step3.industry')}</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Wybierz branżę" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="ecommerce">E-commerce</SelectItem>
                              <SelectItem value="services">Usługi</SelectItem>
                              <SelectItem value="manufacturing">Produkcja</SelectItem>
                              <SelectItem value="healthcare">Ochrona zdrowia</SelectItem>
                              <SelectItem value="education">Edukacja</SelectItem>
                              <SelectItem value="finance">Finanse</SelectItem>
                              <SelectItem value="tech">Technologia</SelectItem>
                              <SelectItem value="other">Inna</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="projectType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('clientPanel.onboarding.step3.projectType')}</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Wybierz typ projektu" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="website">Strona internetowa</SelectItem>
                              <SelectItem value="eshop">Sklep internetowy</SelectItem>
                              <SelectItem value="app">Aplikacja webowa</SelectItem>
                              <SelectItem value="redesign">Redesign UX/UI</SelectItem>
                              <SelectItem value="marketing">Kampanie marketingowe</SelectItem>
                              <SelectItem value="automation">Automatyzacja procesów</SelectItem>
                              <SelectItem value="ai">Integracja AI</SelectItem>
                              <SelectItem value="other">Inny</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="goal"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('clientPanel.onboarding.step3.goal')}</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Opisz główny cel biznesowy Twojego projektu..."
                              className="min-h-[100px]"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Na przykład: zwiększenie sprzedaży, pozyskanie nowych klientów, automatyzacja procesów...
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="flex justify-between pt-4">
                      <Button type="button" variant="outline" onClick={prevStep}>
                        {t('clientPanel.onboarding.previous')}
                      </Button>
                      <Button 
                        type="submit" 
                        disabled={completeOnboardingMutation.isPending}
                      >
                        {completeOnboardingMutation.isPending ? (
                          <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full mr-2" />
                        ) : null}
                        {t('clientPanel.onboarding.finish')}
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}