import { useState, useEffect } from "react";
import { useLocation, useRoute, Redirect } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2 } from "lucide-react";

const loginSchema = z.object({
  username: z.string().min(3, "Nazwa użytkownika musi mieć co najmniej 3 znaki"),
  password: z.string().min(6, "Hasło musi mieć co najmniej 6 znaków"),
});

const registerSchema = z.object({
  username: z.string().min(3, "Nazwa użytkownika musi mieć co najmniej 3 znaki"),
  email: z.string().email("Wprowadź poprawny adres email"),
  password: z.string().min(6, "Hasło musi mieć co najmniej 6 znaków"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Hasła muszą być identyczne",
  path: ["confirmPassword"],
});

type LoginForm = z.infer<typeof loginSchema>;
type RegisterForm = z.infer<typeof registerSchema>;

export default function AuthPage() {
  const [tab, setTab] = useState<"login" | "register">("login");
  const [location, setLocation] = useLocation();
  const { user, isLoading, loginMutation, registerMutation } = useAuth();
  
  // Jeśli użytkownik jest już zalogowany, przekieruj na stronę główną
  if (user) {
    // Pobierz parametr 'from' z URL, jeśli istnieje
    const params = new URLSearchParams(window.location.search);
    const from = params.get('from') || '/';
    
    return <Redirect to={from} />;
  }
  
  // Formularz logowania
  const loginForm = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });
  
  // Formularz rejestracji
  const registerForm = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });
  
  // Obsługa logowania
  const onLoginSubmit = async (data: LoginForm) => {
    try {
      await loginMutation.mutateAsync(data);
    } catch (error) {
      console.error("Błąd logowania:", error);
    }
  };
  
  // Obsługa rejestracji
  const onRegisterSubmit = async (data: RegisterForm) => {
    try {
      await registerMutation.mutateAsync({
        username: data.username,
        email: data.email,
        password: data.password,
      });
    } catch (error) {
      console.error("Błąd rejestracji:", error);
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Sekcja z formularzami */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold">
              {tab === "login" ? "Zaloguj się" : "Zarejestruj się"}
            </CardTitle>
            <CardDescription>
              {tab === "login" 
                ? "Zaloguj się, aby uzyskać dostęp do panelu klienta" 
                : "Utwórz nowe konto, aby rozpocząć korzystanie z naszych usług"}
            </CardDescription>
          </CardHeader>
          
          <Tabs value={tab} onValueChange={(value) => setTab(value as "login" | "register")}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Logowanie</TabsTrigger>
              <TabsTrigger value="register">Rejestracja</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <CardContent className="pt-6">
                <Form {...loginForm}>
                  <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                    <FormField
                      control={loginForm.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nazwa użytkownika</FormLabel>
                          <FormControl>
                            <Input placeholder="Twoja nazwa użytkownika" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={loginForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Hasło</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="Twoje hasło" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <Button 
                      type="submit" 
                      className="w-full" 
                      disabled={loginMutation.isPending}
                    >
                      {loginMutation.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Logowanie...
                        </>
                      ) : (
                        "Zaloguj się"
                      )}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </TabsContent>
            
            <TabsContent value="register">
              <CardContent className="pt-6">
                <Form {...registerForm}>
                  <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-4">
                    <FormField
                      control={registerForm.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nazwa użytkownika</FormLabel>
                          <FormControl>
                            <Input placeholder="Wybierz nazwę użytkownika" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={registerForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="twoj@email.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={registerForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Hasło</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="Wybierz silne hasło" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={registerForm.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Potwierdź hasło</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="Powtórz hasło" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <Button 
                      type="submit" 
                      className="w-full" 
                      disabled={registerMutation.isPending}
                    >
                      {registerMutation.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Rejestracja...
                        </>
                      ) : (
                        "Zarejestruj się"
                      )}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </TabsContent>
          </Tabs>
          
          <CardFooter className="flex flex-col space-y-4 border-t pt-6">
            <div className="w-full grid grid-cols-2 gap-4">
              <Button
                variant="outline"
                className="flex items-center justify-center"
                onClick={() => setLocation("/")}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
                Powrót do strony głównej
              </Button>
              
              <Button 
                variant="ghost" 
                className="flex items-center justify-center border border-green-200 hover:bg-green-50"
                onClick={() => setTab(tab === "login" ? "register" : "login")}
              >
                {tab === "login" ? "Zarejestruj się" : "Zaloguj się"}
              </Button>
            </div>
            
            <p className="text-sm text-gray-500 text-center pt-2">
              {tab === "login" 
                ? "Nie masz jeszcze konta? Zarejestruj się by uzyskać dostęp do panelu klienta." 
                : "Masz już konto? Zaloguj się by kontynuować."}
            </p>
          </CardFooter>
        </Card>
      </div>
      
      {/* Sekcja Hero z informacjami */}
      <div className="w-full md:w-1/2 bg-gradient-to-br from-green-50 to-green-100 p-8 flex items-center justify-center">
        <div className="max-w-lg">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Panel klienta ECM Digital
          </h1>
          <p className="text-lg text-gray-700 mb-6">
            Zaloguj się, aby uzyskać dostęp do naszej platformy usług cyfrowych. Zarządzaj swoimi projektami,
            komunikuj się z zespołem i monitoruj postępy prac - wszystko w jednym miejscu.
          </p>
          
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="bg-white p-2 rounded-full mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Zarządzanie projektami</h3>
                <p className="text-gray-600">Śledź postępy projektów i przeglądaj historię zamówień</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="bg-white p-2 rounded-full mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Bezpośrednia komunikacja</h3>
                <p className="text-gray-600">Łatwy kontakt z zespołem projektowym i szybkie odpowiedzi</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="bg-white p-2 rounded-full mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Udostępnianie plików</h3>
                <p className="text-gray-600">Łatwe przesyłanie materiałów i pobieranie rezultatów pracy</p>
              </div>
            </div>
            
            <div className="mt-8">
              <Button 
                onClick={() => setLocation("/")}
                className="bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-md text-lg flex items-center gap-2 shadow-md hover:shadow-lg transition-all"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
                Wróć na stronę główną
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}