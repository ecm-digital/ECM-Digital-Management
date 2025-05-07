import React from 'react';
import { useLocation } from 'wouter';
import BlogSearchComponent from '../components/blog/BlogSearchPage';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';

export default function BlogSearchPage() {
  const [location] = useLocation();
  // Wyodrębnienie parametru wyszukiwania z adresu URL
  const searchParams = new URLSearchParams(location.split('?')[1]);
  const query = searchParams.get('q') || '';

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <BlogSearchComponent initialQuery={query} />
      </main>
      <Footer />
    </div>
  );
}