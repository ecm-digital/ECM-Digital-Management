import React from 'react';
import { Link } from 'wouter';

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <h3 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text mb-4">
              ECM Digital
            </h3>
            <p className="text-gray-600 text-sm mb-4">
              Kompleksowe rozwiązania cyfrowe dla biznesu. Świadczymy usługi marketingowe i technologiczne najwyższej jakości.
            </p>
          </div>
          
          <div>
            <h4 className="font-medium mb-3">Usługi</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><Link href="/services"><span className="hover:text-blue-600 transition-colors cursor-pointer">Wszystkie usługi</span></Link></li>
              <li><Link href="/services"><span className="hover:text-blue-600 transition-colors cursor-pointer">UX/UI Design</span></Link></li>
              <li><Link href="/services"><span className="hover:text-blue-600 transition-colors cursor-pointer">Web Development</span></Link></li>
              <li><Link href="/services"><span className="hover:text-blue-600 transition-colors cursor-pointer">Marketing</span></Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium mb-3">Firma</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><a href="#" className="hover:text-blue-600 transition-colors">O nas</a></li>
              <li><a href="#" className="hover:text-blue-600 transition-colors">Zespół</a></li>
              <li><a href="#" className="hover:text-blue-600 transition-colors">Kariera</a></li>
              <li><a href="#" className="hover:text-blue-600 transition-colors">Kontakt</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium mb-3">Kontakt</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span>kontakt@ecmdigital.pl</span>
              </li>
              <li className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span>+48 123 456 789</span>
              </li>
              <li className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>Warszawa, Polska</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-200 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} ECM Digital. Wszelkie prawa zastrzeżone.
          </p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <a href="#" className="text-gray-500 hover:text-blue-600 transition-colors">
              Polityka prywatności
            </a>
            <a href="#" className="text-gray-500 hover:text-blue-600 transition-colors">
              Warunki korzystania
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}