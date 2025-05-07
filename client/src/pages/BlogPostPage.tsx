import React from 'react';
import { useRoute } from 'wouter';
import BlogPostDetail from '../components/blog/BlogPostDetail';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';

export default function BlogPostPage() {
  const [, params] = useRoute('/blog/:slug');
  const slug = params?.slug || '';

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <BlogPostDetail slug={slug} />
      </main>
      <Footer />
    </div>
  );
}