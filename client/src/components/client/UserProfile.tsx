import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'wouter';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { 
  ArrowLeft, 
  User, 
  Mail, 
  Phone, 
  Building, 
  MapPin, 
  AlertCircle, 
  Save
} from 'lucide-react';
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

const formSchema = z.object({
  username: z.string().min(2, {
    message: "Nazwa użytkownika musi mieć co najmniej 2 znaki",
  }),
  email: z.string().email({
    message: "Niepoprawny adres e-mail",
  }),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  company: z.string().optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  postalCode: z.string().optional(),
  country: z.string().optional(),
  bio: z.string().optional(),
})

interface UserData {
  id: number;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  company?: string;
  phone?: string;
  address?: string;
  city?: string;
  postalCode?: string;
  country?: string;
  bio?: string;
  profileImageUrl?: string;
  role: string;
  createdAt: string;
}

export default function UserProfile() {
  const userId = 1; // Tymczasowo używamy id=1, później będzie z autentykacji
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: user, isLoading, error } = useQuery<UserData>({
    queryKey: ['/api/client/profile', { userId }],
    queryFn: async () => {
      const response = await fetch(`/api/client/profile?userId=${userId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch user profile');
      }
      return response.json();
    },
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: user?.username || '',
      email: user?.email || '',
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      company: user?.company || '',
      phone: user?.phone || '',
      address: user?.address || '',
      city: user?.city || '',
      postalCode: user?.postalCode || '',
      country: user?.country || '',
      bio: user?.bio || '',
    },
  });

  // Update form values when user data is loaded
  React.useEffect(() => {
    if (user) {
      form.reset({
        username: user.username,
        email: user.email,
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        company: user.company || '',
        phone: user.phone || '',
        address: user.address || '',
        city: user.city || '',
        postalCode: user.postalCode || '',
        country: user.country || '',
        bio: user.bio || '',
      });
    }
  }, [user, form]);

  const updateProfileMutation = useMutation({
    mutationFn: async (userData: z.infer<typeof formSchema>) => {
      const response = await fetch(`/api/client/profile?userId=${userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update profile');
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/client/profile', { userId }] });
      toast({
        title: "Profil zaktualizowany",
        description: "Twoje dane zostały pomyślnie zaktualizowane",
      });
    },
    onError: (error) => {
      toast({
        title: "Błąd",
        description: error instanceof Error ? error.message : "Nie udało się zaktualizować profilu",
        variant: "destructive",
      });
    }
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    updateProfileMutation.mutate(values);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-40 bg-gray-200 rounded-lg"></div>
          <div className="h-60 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center text-red-700">
          <AlertCircle className="h-5 w-5 mr-2" />
          <p>Nie udało się pobrać danych profilu. Spróbuj odświeżyć stronę.</p>
        </div>
        <Link href="/client/dashboard">
          <Button variant="outline" className="mt-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Powrót do panelu
          </Button>
        </Link>
      </div>
    );
  }

  const getInitials = () => {
    if (user.firstName && user.lastName) {
      return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
    } else if (user.username) {
      return user.username.substring(0, 2).toUpperCase();
    }
    return 'U';
  };

  const getFormattedDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pl-PL');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-8">
        <Link href="/client/dashboard">
          <Button variant="ghost" size="sm" className="mr-4 p-0">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">Profil użytkownika</h1>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* User Info Card */}
        <Card>
          <CardHeader>
            <div className="flex flex-col items-center">
              <Avatar className="h-24 w-24 mb-4">
                {user.profileImageUrl ? (
                  <AvatarImage src={user.profileImageUrl} alt={user.username} />
                ) : (
                  <AvatarFallback className="text-lg">
                    {getInitials()}
                  </AvatarFallback>
                )}
              </Avatar>
              <CardTitle className="text-xl text-center">{user.firstName || user.username}</CardTitle>
              <CardDescription className="text-center">
                Klient od {getFormattedDate(user.createdAt)}
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start">
                <User className="h-5 w-5 mr-3 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Nazwa użytkownika</p>
                  <p>{user.username}</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <Mail className="h-5 w-5 mr-3 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p>{user.email}</p>
                </div>
              </div>
              
              {user.phone && (
                <div className="flex items-start">
                  <Phone className="h-5 w-5 mr-3 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Telefon</p>
                    <p>{user.phone}</p>
                  </div>
                </div>
              )}
              
              {user.company && (
                <div className="flex items-start">
                  <Building className="h-5 w-5 mr-3 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Firma</p>
                    <p>{user.company}</p>
                  </div>
                </div>
              )}
              
              {(user.address || user.city) && (
                <div className="flex items-start">
                  <MapPin className="h-5 w-5 mr-3 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Adres</p>
                    <p>
                      {user.address && <span>{user.address}, </span>}
                      {user.postalCode && <span>{user.postalCode} </span>}
                      {user.city && <span>{user.city}, </span>}
                      {user.country && <span>{user.country}</span>}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        
        {/* Edit Profile Form */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Edytuj profil</CardTitle>
            <CardDescription>
              Zaktualizuj swoje dane osobowe i informacje kontaktowe
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Imię</FormLabel>
                        <FormControl>
                          <Input placeholder="Imię" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nazwisko</FormLabel>
                        <FormControl>
                          <Input placeholder="Nazwisko" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nazwa użytkownika</FormLabel>
                        <FormControl>
                          <Input placeholder="Nazwa użytkownika" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="Email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="company"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Firma</FormLabel>
                      <FormControl>
                        <Input placeholder="Nazwa firmy" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Telefon</FormLabel>
                      <FormControl>
                        <Input placeholder="Numer telefonu" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Adres</FormLabel>
                      <FormControl>
                        <Input placeholder="Ulica i numer" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Miasto</FormLabel>
                        <FormControl>
                          <Input placeholder="Miasto" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="postalCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Kod pocztowy</FormLabel>
                        <FormControl>
                          <Input placeholder="Kod pocztowy" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="country"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Kraj</FormLabel>
                        <FormControl>
                          <Input placeholder="Kraj" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="bio"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>O sobie</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Krótki opis..." 
                          className="resize-none" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button 
                  type="submit" 
                  className="w-full md:w-auto"
                  disabled={updateProfileMutation.isPending}
                >
                  <Save className="h-4 w-4 mr-2" />
                  {updateProfileMutation.isPending ? 'Zapisywanie...' : 'Zapisz zmiany'}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}