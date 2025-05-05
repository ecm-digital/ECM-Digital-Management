import React, { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './LanguageSwitcher';

export default function Navbar() {
  const { t } = useTranslation();
  const [location] = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <Link href="/">
            <div className="flex items-center cursor-pointer">
              <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
                ECM Digital
              </h1>
            </div>
          </Link>

          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/">
              <span className={`hover:text-blue-600 transition-colors cursor-pointer ${location === '/' ? 'text-blue-600 font-medium' : 'text-gray-700'}`}>
                {t('navigation.home')}
              </span>
            </Link>
            <a href={location === '/' ? "#services" : "/#services"} className="hover:text-blue-600 transition-colors text-gray-700">
              {t('navigation.services')}
            </a>
            <a href={location === '/' ? "#case-studies" : "/#case-studies"} className="hover:text-blue-600 transition-colors text-gray-700">
              {t('navigation.caseStudies')}
            </a>
            <a href={location === '/' ? "#contact-form" : "/#contact-form"} className="hover:text-blue-600 transition-colors text-gray-700">
              {t('navigation.contact')}
            </a>
            <Link href="/client/dashboard">
              <Button variant="default" size="sm" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                {t('navigation.clientPanel')}
              </Button>
            </Link>
            <Link href="/admin">
              <Button variant="outline" size="sm">{t('navigation.adminPanel')}</Button>
            </Link>
            <LanguageSwitcher />
          </nav>

          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] p-0">
                <div className="flex flex-col h-full">
                  <div className="p-4 border-b">
                    <div className="flex items-center justify-between">
                      <h2 className="text-xl font-bold">ECM Digital</h2>
                    </div>
                  </div>
                  
                  <div className="flex-1 p-4">
                    <nav className="flex flex-col space-y-4">
                      <Link href="/">
                        <span className={`block py-2 hover:text-blue-600 transition-colors ${location === '/' ? 'text-blue-600 font-medium' : 'text-gray-700'}`}>
                          {t('navigation.home')}
                        </span>
                      </Link>
                      <a href={location === '/' ? "#services" : "/#services"} className="block py-2 hover:text-blue-600 transition-colors text-gray-700">
                        {t('navigation.services')}
                      </a>
                      <a href={location === '/' ? "#case-studies" : "/#case-studies"} className="block py-2 hover:text-blue-600 transition-colors text-gray-700">
                        {t('navigation.caseStudies')}
                      </a>
                      <a href={location === '/' ? "#contact-form" : "/#contact-form"} className="block py-2 hover:text-blue-600 transition-colors text-gray-700">
                        {t('navigation.contact')}
                      </a>
                      <div className="py-2">
                        <LanguageSwitcher />
                      </div>
                      <div className="pt-4 space-y-2">
                        <Link href="/client/dashboard">
                          <Button variant="default" className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                            {t('navigation.clientPanel')}
                          </Button>
                        </Link>
                        <Link href="/admin">
                          <Button variant="outline" className="w-full">{t('navigation.adminPanel')}</Button>
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