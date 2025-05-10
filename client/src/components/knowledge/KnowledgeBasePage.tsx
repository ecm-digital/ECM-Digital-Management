import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { apiRequest } from '@/lib/queryClient';
import { Link } from 'wouter';
import { Search, Lightbulb, BookOpen, FileQuestion } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import KnowledgeArticleCard from './KnowledgeArticleCard';
import LoadingSpinner from '../ui/loading-spinner';

interface KnowledgeArticle {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  thumbnailUrl: string;
  authorId: string;
  authorName: string;
  publishedAt: string;
  category: string;
  tags: string[];
}

export default function KnowledgeBasePage() {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');

  // Pobierz wszystkie artykuły bazy wiedzy
  const { data: articles, isLoading, error } = useQuery<KnowledgeArticle[]>({
    queryKey: ['/api/kb/articles'],
    queryFn: () => apiRequest('/api/kb/articles'),
  });

  // Obsługa wyszukiwania
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/knowledge/search?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  // Pogrupuj artykuły według kategorii
  const groupedArticles = articles?.reduce((acc, article) => {
    if (!acc[article.category]) {
      acc[article.category] = [];
    }
    acc[article.category].push(article);
    return acc;
  }, {} as Record<string, KnowledgeArticle[]>) || {};

  // Przygotuj ikony dla głównych kategorii
  const categoryIcons: Record<string, React.ReactNode> = {
    'Poradniki': <BookOpen className="h-8 w-8 text-cyan-500" />,
    'Tutorials': <BookOpen className="h-8 w-8 text-cyan-500" />,
    'FAQ': <FileQuestion className="h-8 w-8 text-violet-500" />,
    'Porady': <Lightbulb className="h-8 w-8 text-amber-500" />,
    'Tips': <Lightbulb className="h-8 w-8 text-amber-500" />
  };
  
  // Funkcja zwracająca ikonę dla danej kategorii
  const getCategoryIcon = (category: string) => {
    return categoryIcons[category] || <BookOpen className="h-8 w-8 text-blue-500" />;
  };

  if (isLoading) {
    return (
      <div className="container py-12 flex justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-12">
        <div className="text-center p-8 bg-red-50 rounded-lg">
          <h2 className="text-xl font-bold text-red-700 mb-2">{t('knowledge.errorTitle', 'Wystąpił błąd')}</h2>
          <p className="text-red-600">{t('knowledge.errorMessage', 'Nie udało się załadować artykułów. Spróbuj odświeżyć stronę.')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12">
      <div className="container">
        {/* Nagłówek sekcji */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-violet-500">
            {t('knowledge.title', 'Baza Wiedzy ECM Digital')}
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {t('knowledge.description', 'Praktyczne poradniki, odpowiedzi na najczęstsze pytania i porady ekspertów z zakresu UX/UI, rozwoju biznesu i marketingu.')}
          </p>
          
          {/* Wyszukiwarka */}
          <form onSubmit={handleSearch} className="mt-8 flex max-w-md mx-auto">
            <Input
              type="text"
              placeholder={t('knowledge.searchPlaceholder', 'Szukaj w bazie wiedzy...')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="rounded-r-none"
            />
            <Button type="submit" className="rounded-l-none">
              <Search className="h-4 w-4 mr-2" />
              {t('knowledge.search', 'Szukaj')}
            </Button>
          </form>
        </div>

        {/* Wyświetl kategorie jako kafelki */}
        {Object.keys(groupedArticles).length > 0 && (
          <div className="mb-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Object.keys(groupedArticles).map((category) => (
              <div key={category} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center mb-4">
                  {getCategoryIcon(category)}
                  <h2 className="text-xl font-bold ml-3">{category}</h2>
                </div>
                <p className="text-gray-600 mb-4">
                  {t(`knowledge.categoryDescription.${category.toLowerCase()}`, `Artykuły z kategorii ${category}`)}
                </p>
                <p className="text-gray-500 mb-4">
                  {t('knowledge.articlesCount', 'Ilość artykułów')}: {groupedArticles[category].length}
                </p>
                <Link href={`/knowledge/search?category=${encodeURIComponent(category)}`}>
                  <Button variant="outline" size="sm" className="w-full">
                    {t('knowledge.browseCategory', 'Przeglądaj kategorię')}
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        )}

        {/* Wyświetl popularne artykuły */}
        {articles && articles.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6">{t('knowledge.popularArticles', 'Popularne artykuły')}</h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {articles.slice(0, 6).map((article) => (
                <KnowledgeArticleCard key={article.id} article={article} />
              ))}
            </div>
          </div>
        )}

        {/* Wyświetl najnowsze artykuły */}
        {articles && articles.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6">{t('knowledge.latestArticles', 'Najnowsze artykuły')}</h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[...articles]
                .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
                .slice(0, 3)
                .map((article) => (
                  <KnowledgeArticleCard key={article.id} article={article} />
                ))}
            </div>
          </div>
        )}

        {/* Komunikat, gdy nie ma artykułów */}
        {(!articles || articles.length === 0) && (
          <div className="text-center p-12 bg-gray-50 rounded-lg">
            <h2 className="text-xl font-bold text-gray-700 mb-2">{t('knowledge.noArticlesTitle', 'Brak artykułów')}</h2>
            <p className="text-gray-600">{t('knowledge.noArticlesMessage', 'Aktualnie baza wiedzy jest pusta. Zajrzyj do nas później.')}</p>
          </div>
        )}
      </div>
    </div>
  );
}