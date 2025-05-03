import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2, AlertCircle, Save, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface UserProfile {
  id: string | number;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  bio?: string;
  profileImageUrl?: string;
  company?: string;
  phone?: string;
  address?: string;
}

export default function ClientProfile() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const { data: userData, isLoading, isError } = useQuery({
    queryKey: ["/api/client/profile?userId=1"],
    retry: false,
  });

  const [formData, setFormData] = useState<Partial<UserProfile>>({});
  const [isEditing, setIsEditing] = useState(false);

  React.useEffect(() => {
    if (userData) {
      setFormData(userData);
    }
  }, [userData]);

  const updateProfileMutation = useMutation({
    mutationFn: async (profileData: Partial<UserProfile>) => {
      const response = await fetch("/api/client/profile?userId=1", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(profileData),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Nie udało się zaktualizować profilu");
      }
      
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Profil zaktualizowany",
        description: "Twój profil został pomyślnie zaktualizowany.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/client/profile?userId=1"] });
      setIsEditing(false);
    },
    onError: (error) => {
      toast({
        title: "Błąd aktualizacji profilu",
        description: error.message || "Spróbuj ponownie później.",
        variant: "destructive",
      });
    },
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfileMutation.mutate(formData);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="mt-4 text-muted-foreground">Ładowanie profilu...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <AlertCircle className="h-12 w-12 text-destructive" />
        <p className="mt-4 text-muted-foreground">Wystąpił błąd podczas ładowania profilu.</p>
        <Button variant="outline" className="mt-4">
          Spróbuj ponownie
        </Button>
      </div>
    );
  }

  const user = userData || {};
  const initials = user.firstName && user.lastName
    ? `${user.firstName[0]}${user.lastName[0]}`
    : user.username
      ? user.username[0]
      : 'U';

  return (
    <div className="container px-4 py-8 mx-auto">
      <h1 className="text-3xl font-bold mb-6">Profil użytkownika</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <Card>
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <Avatar className="h-32 w-32">
                  {user.profileImageUrl ? (
                    <AvatarImage src={user.profileImageUrl} alt={user.username} />
                  ) : (
                    <AvatarFallback className="text-3xl">{initials}</AvatarFallback>
                  )}
                </Avatar>
              </div>
              <CardTitle>{user.firstName} {user.lastName}</CardTitle>
              <CardDescription>{user.username}</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-muted-foreground">{user.email}</p>
              {user.bio && <p className="mt-4">{user.bio}</p>}
              {!isEditing && (
                <Button 
                  variant="outline" 
                  className="mt-6 w-full" 
                  onClick={() => setIsEditing(true)}
                >
                  Edytuj profil
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
        
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Informacje osobiste</CardTitle>
              <CardDescription>
                {isEditing 
                  ? "Edytuj swoje dane osobowe poniżej" 
                  : "Twoje dane osobowe i kontaktowe"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">Imię</Label>
                      <Input
                        id="firstName"
                        name="firstName"
                        value={formData.firstName || ""}
                        onChange={handleInputChange}
                        placeholder="Imię"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Nazwisko</Label>
                      <Input
                        id="lastName"
                        name="lastName"
                        value={formData.lastName || ""}
                        onChange={handleInputChange}
                        placeholder="Nazwisko"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email || ""}
                      onChange={handleInputChange}
                      placeholder="Email"
                      disabled
                    />
                    <p className="text-xs text-muted-foreground">
                      Adres email nie może być zmieniony
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phone">Telefon</Label>
                    <Input
                      id="phone"
                      name="phone"
                      value={formData.phone || ""}
                      onChange={handleInputChange}
                      placeholder="Numer telefonu"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="company">Firma</Label>
                    <Input
                      id="company"
                      name="company"
                      value={formData.company || ""}
                      onChange={handleInputChange}
                      placeholder="Nazwa firmy"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="address">Adres</Label>
                    <Textarea
                      id="address"
                      name="address"
                      value={formData.address || ""}
                      onChange={handleInputChange}
                      placeholder="Adres"
                      rows={3}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="bio">O sobie</Label>
                    <Textarea
                      id="bio"
                      name="bio"
                      value={formData.bio || ""}
                      onChange={handleInputChange}
                      placeholder="Kilka słów o sobie..."
                      rows={4}
                    />
                  </div>
                  
                  <div className="flex justify-end space-x-2 pt-4">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => {
                        setIsEditing(false);
                        setFormData(userData);
                      }}
                      disabled={updateProfileMutation.isPending}
                    >
                      Anuluj
                    </Button>
                    <Button 
                      type="submit"
                      disabled={updateProfileMutation.isPending}
                      className="flex items-center gap-2"
                    >
                      {updateProfileMutation.isPending ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Save className="h-4 w-4" />
                      )}
                      {updateProfileMutation.isPending ? "Zapisywanie..." : "Zapisz zmiany"}
                    </Button>
                  </div>
                </form>
              ) : (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InfoItem label="Imię" value={user.firstName} />
                    <InfoItem label="Nazwisko" value={user.lastName} />
                    <InfoItem label="Email" value={user.email} />
                    <InfoItem label="Telefon" value={user.phone} />
                    <InfoItem label="Firma" value={user.company} />
                    <InfoItem label="Konto utworzone" value={user.createdAt ? new Date(user.createdAt).toLocaleDateString('pl-PL') : undefined} />
                  </div>
                  
                  {user.address && (
                    <div className="pt-2">
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">Adres</h3>
                      <p>{user.address}</p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Bezpieczeństwo</CardTitle>
              <CardDescription>
                Ustawienia bezpieczeństwa twojego konta
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-muted-foreground">
                  Aby zmienić hasło, skorzystaj z funkcji resetowania hasła dostępnej na stronie logowania.
                </p>
                <Button variant="outline" disabled>
                  Zresetuj hasło
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

interface InfoItemProps {
  label: string;
  value?: string;
}

function InfoItem({ label, value }: InfoItemProps) {
  return (
    <div>
      <h3 className="text-sm font-medium text-muted-foreground mb-1">{label}</h3>
      <p>{value || "Nie określono"}</p>
    </div>
  );
}