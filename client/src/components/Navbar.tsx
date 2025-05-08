import React, { useState, useCallback, memo } from 'react';
import { Link, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { 
  Menu, 
  User, 
  ChevronDown, 
  Settings, 
  Home, 
  CreditCard, 
  Info, 
  BookOpen, 
  BookText, 
  Phone,
  LogIn 
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './LanguageSwitcher';
import { useAuth } from '@/hooks/use-auth';

// NavLink component for avoiding re-renders
const NavLink = memo(({ href, label, isActive, isAnchor = false }: { 
  href: string; 
  label: string; 
  isActive: boolean;
  isAnchor?: boolean;
}) => {
  if (isAnchor) {
    return (
      <a 
        href={href} 
        className="hover:text-primary transition-colors text-gray-700 font-medium"
      >
        {label}
      </a>
    );
  }
  
  return (
    <Link href={href}>
      <span className={`hover:text-primary transition-colors cursor-pointer font-medium ${
        isActive ? 'text-primary border-b-2 border-primary pb-1' : 'text-gray-700'
      }`}>
        {label}
      </span>
    </Link>
  );
});

// Mobile NavLink component
const MobileNavLink = memo(({ href, label, isActive, isAnchor = false, icon }: { 
  href: string; 
  label: string; 
  isActive: boolean;
  isAnchor?: boolean;
  icon?: React.ReactNode;
}) => {
  const content = (
    <span className={`block py-2 hover:text-primary transition-colors font-medium ${
      isActive ? 'text-primary' : 'text-gray-700'
    } flex items-center gap-2`}>
      {icon}
      {label}
    </span>
  );
  
  if (isAnchor) {
    return <a href={href} className="block py-2">{content}</a>;
  }
  
  return <Link href={href}>{content}</Link>;
});

const Navbar = () => {
  const { t } = useTranslation();
  const [location] = useLocation();
  const { user, isLoading } = useAuth();
  
  // Definicja linków nawigacyjnych do ponownego użycia
  const navLinks = [
    { 
      href: "/", 
      label: t('navigation.home'),
      isActive: location === '/',
      icon: <Home className="h-4 w-4" />
    },
    { 
      href: "/about", 
      label: t('navigation.about'),
      isActive: location === '/about',
      icon: <Info className="h-4 w-4" /> 
    },
    { 
      href: location === '/' ? "#services" : "/#services", 
      label: t('navigation.services'),
      isActive: false,
      isAnchor: true,
      icon: <CreditCard className="h-4 w-4" />
    },
    { 
      href: location === '/' ? "#case-studies" : "/#case-studies", 
      label: t('navigation.caseStudies'),
      isActive: false,
      isAnchor: true,
      icon: <BookOpen className="h-4 w-4" />
    },
    { 
      href: "/blog", 
      label: t('navigation.blog', 'Blog'),
      isActive: location === '/blog',
      icon: <BookText className="h-4 w-4" />
    },
    { 
      href: "/knowledge", 
      label: t('navigation.knowledge', 'Baza Wiedzy'),
      isActive: location === '/knowledge',
      icon: <BookText className="h-4 w-4" />
    },
    { 
      href: location === '/' ? "#contact-form" : "/#contact-form", 
      label: t('navigation.contact'),
      isActive: false,
      isAnchor: true,
      icon: <Phone className="h-4 w-4" />
    }
  ];

  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-40 shadow-sm">
      <div className="container-tight py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/">
            <div className="flex items-center cursor-pointer">
              <h1 className="text-xl md:text-2xl font-bold text-primary">
                ECM Digital
              </h1>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {navLinks.map((link, index) => (
              <NavLink 
                key={`desktop-${link.href}-${index}`} 
                href={link.href} 
                label={link.label} 
                isActive={link.isActive}
                isAnchor={link.isAnchor} 
              />
            ))}
            
            <div className="border-l border-gray-200 h-6 mx-2"></div>
            
            {/* Language switcher */}
            <LanguageSwitcher />
            
            {/* Panel menu dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="rounded-full border border-gray-200 shadow-sm hover:shadow-md px-3 py-1.5 flex items-center gap-2">
                  <span className="text-sm font-medium">Panel</span>
                  <ChevronDown className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem asChild>
                  <Link href="/client/dashboard" className="flex items-center gap-2 cursor-pointer">
                    <User className="h-4 w-4" />
                    <span>{t('navigation.clientPanel')}</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/admin" className="flex items-center gap-2 cursor-pointer">
                    <Settings className="h-4 w-4" />
                    <span>{t('navigation.adminPanel')}</span>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            {/* Login/Logout Button */}
            {!isLoading && (
              user ? (
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="rounded-full border border-gray-200 shadow-sm hover:shadow-md ml-2"
                  onClick={() => window.location.href = '/api/logout'}
                >
                  <span className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    {t('auth.logout', 'Wyloguj')}
                  </span>
                </Button>
              ) : (
                <Link href="/auth">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="rounded-full border border-gray-200 shadow-sm hover:shadow-md ml-2"
                  >
                    <span className="flex items-center gap-2">
                      <LogIn className="h-4 w-4" />
                      {t('auth.login', 'Zaloguj')}
                    </span>
                  </Button>
                </Link>
              )
            )}
          </nav>

          {/* Mobile Navigation */}
          <div className="md:hidden flex items-center gap-2">
            <LanguageSwitcher />
            
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm" className="rounded-full border border-gray-200 shadow-sm hover:shadow-md pl-3 pr-2 py-1.5 flex items-center gap-2">
                  <Menu className="h-4 w-4" />
                  <span className="bg-primary text-white rounded-full p-1.5">
                    <User className="h-3 w-3" />
                  </span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] p-0">
                <div className="flex flex-col h-full">
                  <div className="p-5 border-b">
                    <div className="flex items-center justify-between">
                      <h2 className="text-xl font-bold text-primary">ECM Digital</h2>
                    </div>
                  </div>
                  
                  <div className="flex-1 p-5 overflow-y-auto">
                    <nav className="flex flex-col space-y-4">
                      {navLinks.map((link, index) => (
                        <MobileNavLink 
                          key={`mobile-${link.href}-${index}`} 
                          href={link.href} 
                          label={link.label} 
                          isActive={link.isActive}
                          isAnchor={link.isAnchor}
                          icon={link.icon}
                        />
                      ))}
                      
                      <div className="pt-4 border-t border-gray-200">
                        <div className="py-2 text-sm font-medium text-gray-500">Panele</div>
                        <div className="space-y-2">
                          <Link href="/client/dashboard" className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-md text-gray-700">
                            <User className="h-4 w-4" />
                            <span>{t('navigation.clientPanel')}</span>
                          </Link>
                          <Link href="/admin" className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-md text-gray-700">
                            <Settings className="h-4 w-4" />
                            <span>{t('navigation.adminPanel')}</span>
                          </Link>
                          
                          {/* Login/Logout Mobile */}
                          {!isLoading && (
                            user ? (
                              <div 
                                className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-md text-gray-700 cursor-pointer"
                                onClick={() => window.location.href = '/api/logout'}
                              >
                                <User className="h-4 w-4" />
                                <span>{t('auth.logout', 'Wyloguj')}</span>
                              </div>
                            ) : (
                              <Link href="/auth" className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-md text-gray-700">
                                <LogIn className="h-4 w-4" />
                                <span>{t('auth.login', 'Zaloguj')}</span>
                              </Link>
                            )
                          )}
                        </div>
                      </div>
                    </nav>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};

export default memo(Navbar);