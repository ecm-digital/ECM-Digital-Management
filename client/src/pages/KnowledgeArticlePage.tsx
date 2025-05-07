import React from 'react';
import { useRoute } from 'wouter';
import KnowledgeArticleDetail from '../components/knowledge/KnowledgeArticleDetail';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';

export default function KnowledgeArticlePage() {
  const [, params] = useRoute('/knowledge/:slug');
  const slug = params?.slug || '';

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <KnowledgeArticleDetail slug={slug} />
      </main>
      <Footer />
    </div>
  );
}