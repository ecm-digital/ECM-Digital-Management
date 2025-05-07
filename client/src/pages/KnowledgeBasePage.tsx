import React from 'react';
import KnowledgeBaseComponent from '../components/knowledge/KnowledgeBasePage';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';

export default function KnowledgeBasePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <KnowledgeBaseComponent />
      </main>
      <Footer />
    </div>
  );
}