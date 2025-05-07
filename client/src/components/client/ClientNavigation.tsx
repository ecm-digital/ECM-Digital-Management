import React from "react";
import { Link, useLocation } from "wouter";
import { 
  LayoutDashboard, 
  ShoppingCart, 
  User, 
  LogOut, 
  Menu, 
  X 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useTranslation } from "react-i18next";

export default function ClientNavigation() {
  const { t } = useTranslation();
  const [location] = useLocation();

  const navItems = [
    {
      href: "/client/dashboard",
      label: t('clientPanel.dashboard'),
      icon: <LayoutDashboard className="h-5 w-5" />,
    },
    {
      href: "/client/orders",
      label: t('clientPanel.orders'),
      icon: <ShoppingCart className="h-5 w-5" />,
    },
    {
      href: "/client/profile",
      label: t('clientPanel.profile'),
      icon: <User className="h-5 w-5" />,
    },
  ];

  // Funkcja do sprawdzenia, czy podana ścieżka jest aktywna
  const isActive = (path: string) => {
    if (path === "/client/dashboard") {
      return location === path;
    }
    // Dla pozostałych sekcji sprawdzamy, czy ścieżka zaczyna się od podanej
    return location.startsWith(path);
  };

  return (
    <>
      {/* Nawigacja na desktop */}
      <div className="hidden md:flex flex-col w-64 border-r h-screen sticky top-0">
        <div className="p-6 border-b">
          <Link href="/">
            <h2 className="text-2xl font-bold">ECM Digital</h2>
          </Link>
          <p className="text-sm text-muted-foreground mt-1">{t('clientPanel.title')}</p>
        </div>
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link href={item.href}>
                  <Button
                    variant={isActive(item.href) ? "default" : "ghost"}
                    className={cn(
                      "w-full justify-start gap-2 px-3",
                      isActive(item.href)
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-muted"
                    )}
                  >
                    {item.icon}
                    {item.label}
                  </Button>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="p-4 border-t space-y-2">
          <a href="/api/logout">
            <Button variant="default" className="w-full justify-start gap-2">
              <LogOut className="h-5 w-5" />
              {t('clientPanel.logout') || 'Wyloguj się'}
            </Button>
          </a>
          <Link href="/">
            <Button variant="outline" className="w-full justify-start gap-2">
              <LogOut className="h-5 w-5" />
              {t('clientPanel.backToHome')}
            </Button>
          </Link>
        </div>
      </div>

      {/* Nawigacja na mobile */}
      <div className="md:hidden border-b">
        <div className="flex items-center justify-between p-4">
          <Link href="/">
            <h2 className="text-xl font-bold">ECM Digital</h2>
          </Link>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0">
              <div className="p-6 border-b">
                <div className="flex items-center justify-between">
                  <Link href="/">
                    <h2 className="text-xl font-bold">ECM Digital</h2>
                  </Link>
                </div>
                <p className="text-sm text-muted-foreground mt-1">{t('clientPanel.title')}</p>
              </div>
              <nav className="flex-1 p-4">
                <ul className="space-y-2">
                  {navItems.map((item) => (
                    <li key={item.href}>
                      <Link href={item.href}>
                        <Button
                          variant={isActive(item.href) ? "default" : "ghost"}
                          className={cn(
                            "w-full justify-start gap-2 px-3",
                            isActive(item.href)
                              ? "bg-primary text-primary-foreground"
                              : "hover:bg-muted"
                          )}
                        >
                          {item.icon}
                          {item.label}
                        </Button>
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
              <div className="p-4 border-t space-y-2">
                <a href="/api/logout">
                  <Button variant="default" className="w-full justify-start gap-2">
                    <LogOut className="h-5 w-5" />
                    {t('clientPanel.logout') || 'Wyloguj się'}
                  </Button>
                </a>
                <Link href="/">
                  <Button variant="outline" className="w-full justify-start gap-2">
                    <LogOut className="h-5 w-5" />
                    {t('clientPanel.backToHome')}
                  </Button>
                </Link>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </>
  );
}