import React, { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, User, Globe, Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './LanguageSwitcher';

export default function Navbar() {
  const { t } = useTranslation();
  const [location] = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
            <Link href="/">
              <span className={`hover:text-primary transition-colors cursor-pointer font-medium ${location === '/' ? 'text-primary border-b-2 border-primary pb-1' : 'text-gray-700'}`}>
                {t('navigation.home')}
              </span>
            </Link>
            <Link href="/about">
              <span className={`hover:text-primary transition-colors cursor-pointer font-medium ${location === '/about' ? 'text-primary border-b-2 border-primary pb-1' : 'text-gray-700'}`}>
                {t('navigation.about')}
              </span>
            </Link>
            <a href={location === '/' ? "#services" : "/#services"} className="hover:text-primary transition-colors text-gray-700 font-medium">
              {t('navigation.services')}
            </a>
            <a href={location === '/' ? "#case-studies" : "/#case-studies"} className="hover:text-primary transition-colors text-gray-700 font-medium">
              {t('navigation.caseStudies')}
            </a>
            <Link href="/blog">
              <span className={`hover:text-primary transition-colors cursor-pointer font-medium ${location === '/blog' ? 'text-primary border-b-2 border-primary pb-1' : 'text-gray-700'}`}>
                {t('navigation.blog', 'Blog')}
              </span>
            </Link>
            <Link href="/knowledge">
              <span className={`hover:text-primary transition-colors cursor-pointer font-medium ${location === '/knowledge' ? 'text-primary border-b-2 border-primary pb-1' : 'text-gray-700'}`}>
                {t('navigation.knowledge', 'Baza Wiedzy')}
              </span>
            </Link>
            
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
                  
                  <div className="flex-1 p-5">
                    <nav className="flex flex-col space-y-4">
                      <Link href="/">
                        <span className={`block py-2 hover:text-primary transition-colors font-medium ${location === '/' ? 'text-primary' : 'text-gray-700'}`}>
                          {t('navigation.home')}
                        </span>
                      </Link>
                      <Link href="/about">
                        <span className={`block py-2 hover:text-primary transition-colors font-medium ${location === '/about' ? 'text-primary' : 'text-gray-700'}`}>
                          {t('navigation.about')}
                        </span>
                      </Link>
                      <a href={location === '/' ? "#services" : "/#services"} className="block py-2 hover:text-primary transition-colors text-gray-700 font-medium">
                        {t('navigation.services')}
                      </a>
                      <a href={location === '/' ? "#case-studies" : "/#case-studies"} className="block py-2 hover:text-primary transition-colors text-gray-700 font-medium">
                        {t('navigation.caseStudies')}
                      </a>
                      <Link href="/blog">
                        <span className={`block py-2 hover:text-primary transition-colors font-medium ${location === '/blog' ? 'text-primary' : 'text-gray-700'}`}>
                          {t('navigation.blog', 'Blog')}
                        </span>
                      </Link>
                      <Link href="/knowledge">
                        <span className={`block py-2 hover:text-primary transition-colors font-medium ${location === '/knowledge' ? 'text-primary' : 'text-gray-700'}`}>
                          {t('navigation.knowledge', 'Baza Wiedzy')}
                        </span>
                      </Link>
                      <a href={location === '/' ? "#contact-form" : "/#contact-form"} className="block py-2 hover:text-primary transition-colors text-gray-700 font-medium">
                        {t('navigation.contact')}
                      </a>
                      
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
}