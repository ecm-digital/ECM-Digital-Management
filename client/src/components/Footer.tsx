import React from 'react';
import { Link } from 'wouter';
import { useTranslation } from 'react-i18next';

export default function Footer() {
  const { t } = useTranslation();
  return (
    <footer className="bg-background border-t border-gray-100 pt-20 pb-12">
      <div className="container-tight">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-x-8 gap-y-12">
          <div className="md:col-span-1">
            <h3 className="text-xl font-bold heading-gradient mb-6">
              ECM Digital
            </h3>
            <p className="text-gray-600 leading-relaxed mb-6">
              {t('footer.companyDescription')}
            </p>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 rounded-full bg-gray-100 hover:bg-primary/10 flex items-center justify-center text-gray-600 hover:text-primary transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-100 hover:bg-primary/10 flex items-center justify-center text-gray-600 hover:text-primary transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-5">{t('footer.services')}</h4>
            <ul className="space-y-3 text-gray-600">
              <li><Link href="/services"><span className="hover:text-primary transition-colors cursor-pointer">{t('services.viewAllServices')}</span></Link></li>
              <li><Link href="/services"><span className="hover:text-primary transition-colors cursor-pointer">{t('footer.serviceCategories.uxui')}</span></Link></li>
              <li><Link href="/services"><span className="hover:text-primary transition-colors cursor-pointer">{t('footer.serviceCategories.webDevelopment')}</span></Link></li>
              <li><Link href="/services"><span className="hover:text-primary transition-colors cursor-pointer">{t('footer.serviceCategories.marketing')}</span></Link></li>
              <li><Link href="/services"><span className="hover:text-primary transition-colors cursor-pointer">{t('footer.serviceCategories.aiAutomation')}</span></Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-5">{t('footer.company')}</h4>
            <ul className="space-y-3 text-gray-600">
              <li><a href="#" className="hover:text-primary transition-colors">{t('navigation.about')}</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">{t('footer.companyLinks.team')}</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">{t('footer.companyLinks.career')}</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">{t('navigation.contact')}</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">{t('footer.companyLinks.blog')}</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-5">{t('footer.contact')}</h4>
            <ul className="space-y-4 text-gray-600">
              <li className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium">Email</p>
                  <a href="mailto:hello@ecm-digital.com" className="hover:text-primary">hello@ecm-digital.com</a>
                </div>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center text-secondary">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium">{t('footer.phone')}</p>
                  <a href={`tel:${t('footer.phoneValue')}`} className="hover:text-secondary">{t('footer.phoneValue')}</a>
                </div>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium">{t('footer.address')}</p>
                  <a href={`https://maps.google.com/?q=${encodeURIComponent(t('footer.addressValue'))}`} target="_blank" rel="noopener noreferrer" className="hover:text-green-600">{t('footer.addressValue')}</a>
                </div>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-200 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} ECM Digital. {t('footer.copyright')}
          </p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <a href="#" className="text-gray-500 hover:text-primary transition-colors">
              {t('footer.privacyPolicy')}
            </a>
            <a href="#" className="text-gray-500 hover:text-primary transition-colors">
              {t('footer.terms')}
            </a>
            <a href="#" className="text-gray-500 hover:text-primary transition-colors">
              {t('footer.cookies')}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}