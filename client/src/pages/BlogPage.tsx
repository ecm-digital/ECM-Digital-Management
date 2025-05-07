import React from 'react';
import BlogPageComponent from '../components/blog/BlogPage';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';

export default function BlogPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <BlogPageComponent />
      </main>
      <Footer />
    </div>
  );
}