import React from 'react';
import { useLocation } from 'wouter';
import KnowledgeSearchComponent from '../components/knowledge/KnowledgeSearchPage';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';

export default function KnowledgeSearchPage() {
  const [location] = useLocation();
  // Wyodrębnienie parametru wyszukiwania z adresu URL
  const searchParams = new URLSearchParams(location.split('?')[1]);
  const query = searchParams.get('q') || '';

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <KnowledgeSearchComponent initialQuery={query} />
      </main>
      <Footer />
    </div>
  );
}