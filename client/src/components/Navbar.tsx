import React, { useState, useCallback, memo } from 'react';
import { Link, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, User, Globe, Search, Home, CreditCard, Info, BookOpen, BookText, Phone } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './LanguageSwitcher';

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
            
            {/* Search icon - Airbnb style */}
            <Button variant="ghost" size="sm" className="text-gray-700 hover:text-primary rounded-full p-2">
              <Search className="h-4 w-4" />
            </Button>
            
            {/* Client area - Airbnb style profile button */}
            <div className="flex items-center gap-1">
              <Link href="/client/dashboard">
                <Button variant="outline" size="sm" className="rounded-full border border-gray-200 shadow-sm hover:shadow-md pl-3 pr-2 py-1.5 flex items-center gap-2">
                  <span className="text-sm font-medium">{t('navigation.clientPanel')}</span>
                  <span className="bg-primary text-white rounded-full p-1.5">
                    <User className="h-3 w-3" />
                  </span>
                </Button>
              </Link>
            </div>
            
            {/* Language switcher */}
            <LanguageSwitcher />
            
            {/* Admin link (positioned last) */}
            <Link href="/admin">
              <Button variant="ghost" size="sm" className="text-xs text-gray-600 hover:text-primary px-2">
                {t('navigation.adminPanel')}
              </Button>
            </Link>
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
                      
                      <div className="pt-4 space-y-3">
                        <Link href="/client/dashboard">
                          <Button className="w-full btn-primary">
                            {t('navigation.clientPanel')}
                          </Button>
                        </Link>
                        <Link href="/admin">
                          <Button variant="outline" className="w-full border-gray-200">
                            {t('navigation.adminPanel')}
                          </Button>
                        </Link>
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