import React from 'react';
import { Link, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';

export default function Navbar() {
  const [location] = useLocation();

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
              <a className={`hover:text-blue-600 transition-colors ${location === '/' ? 'text-blue-600 font-medium' : 'text-gray-700'}`}>
                Strona główna
              </a>
            </Link>
            <Link href="/services">
              <a className={`hover:text-blue-600 transition-colors ${location.startsWith('/service') ? 'text-blue-600 font-medium' : 'text-gray-700'}`}>
                Usługi
              </a>
            </Link>
            <Link href="/admin">
              <Button variant="outline" size="sm">Panel Admin</Button>
            </Link>
          </nav>

          <div className="flex md:hidden">
            <Button variant="ghost" size="sm">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}