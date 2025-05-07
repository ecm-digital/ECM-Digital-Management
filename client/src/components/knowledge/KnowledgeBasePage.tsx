import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { KnowledgeBase } from '@shared/schema';
import KnowledgeArticleCard from './KnowledgeArticleCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Search, 
  HelpCircle, 
  FileQuestion,
  BookOpen, 
  Lightbulb,
  AlertCircle, 
  FileText
} from 'lucide-react';

const KnowledgeBasePage: React.FC = () => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');

  // Pobieranie wszystkich artykułów z API
  const { data: articles, isLoading, isError } = useQuery<KnowledgeBase[]>({
    queryKey: ['/api/kb/articles'],
    queryFn: async () => {
      const response = await fetch('/api/kb/articles');
      if (!response.ok) {
        throw new Error('Failed to fetch knowledge base articles');
      }
      return response.json();
    }
  });

  // Pobranie wszystkich kategorii z artykułów
  const allCategories = articles 
    ? [...new Set(articles.map(article => article.category))]
    : [];

  // Ikony dla różnych kategorii
  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'faq':
      case 'frequently asked questions':
        return <HelpCircle className="h-5 w-5" />;
      case 'guides':
      case 'przewodniki':
        return <BookOpen className="h-5 w-5" />;
      case 'tutorials':
      case 'poradniki':
        return <Lightbulb className="h-5 w-5" />;
      case 'troubleshooting':
      case 'rozwiązywanie problemów':
        return <AlertCircle className="h-5 w-5" />;
      default:
        return <FileText className="h-5 w-5" />;
    }
  };

  // Filtrowanie artykułów na podstawie wyszukiwania (frontend)
  const filteredArticles = articles?.filter(article => 
    article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    article.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Funkcja obsługująca wyszukiwanie
  const handleSearch = () => {
    if (searchQuery.trim().length >= 3) {
      window.location.href = `/knowledge/search?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  // Obsługa naciśnięcia Enter w polu wyszukiwania
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-12 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-500 to-cyan-400 bg-clip-text text-transparent">
          {t('knowledge.title', 'Baza Wiedzy')}
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          {t('knowledge.description', 'Znajdź odpowiedzi na najczęściej zadawane pytania, przewodniki i porady dotyczące naszych usług.')}
        </p>
        <div className="mt-8 max-w-md mx-auto flex">
          <Input
            type="text"
            placeholder={t('knowledge.searchPlaceholder', 'Szukaj w bazie wiedzy...')}
            className="mr-2"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <Button onClick={handleSearch} disabled={searchQuery.trim().length < 3}>
            <Search className="h-4 w-4 mr-2" />
            {t('knowledge.search', 'Szukaj')}
          </Button>
        </div>
      </div>

      {isLoading ? (
        // Skeleton loader
        <div className="space-y-8">
          <div className="flex justify-center mb-8">
            <Skeleton className="h-10 w-64" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="border rounded-lg p-4">
                <div className="flex justify-between mb-4">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-6 w-16" />
                </div>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-3/4 mb-4" />
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : isError ? (
        // Error state
        <div className="text-center py-12 border rounded-lg">
          <FileQuestion className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-red-500 mb-2">
            {t('knowledge.errorTitle', 'Ups! Coś poszło nie tak')}
          </h3>
          <p className="text-gray-600 mb-6">
            {t('knowledge.errorDescription', 'Nie udało się załadować artykułów z bazy wiedzy. Spróbuj odświeżyć stronę.')}
          </p>
          <Button onClick={() => window.location.reload()}>
            {t('knowledge.refresh', 'Odśwież stronę')}
          </Button>
        </div>
      ) : articles && articles.length > 0 ? (
        // Knowledge base content
        <div className="space-y-8">
          <Tabs defaultValue="all">
            <div className="flex justify-center mb-8">
              <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5">
                <TabsTrigger value="all">
                  <FileText className="h-4 w-4 mr-2" />
                  {t('knowledge.allCategories', 'Wszystkie')}
                </TabsTrigger>
                {allCategories.map(category => (
                  <TabsTrigger key={category} value={category}>
                    {getCategoryIcon(category)}
                    <span className="ml-2">{category}</span>
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>

            <TabsContent value="all" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredArticles?.map(article => (
                  <KnowledgeArticleCard key={article.id} article={article} />
                ))}
              </div>
            </TabsContent>

            {allCategories.map(category => (
              <TabsContent key={category} value={category} className="mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredArticles
                    ?.filter(article => article.category === category)
                    .map(article => (
                      <KnowledgeArticleCard key={article.id} article={article} />
                    ))
                  }
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      ) : (
        // No articles found
        <div className="text-center py-12 border border-dashed rounded-lg">
          <FileQuestion className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">
            {t('knowledge.noArticlesTitle', 'Brak artykułów')}
          </h3>
          <p className="text-gray-500 mb-6">
            {searchQuery 
              ? t('knowledge.noSearchResults', 'Nie znaleziono artykułów pasujących do zapytania.') 
              : t('knowledge.noArticlesDescription', 'Nie dodano jeszcze żadnych artykułów do bazy wiedzy.')
            }
          </p>
          <Button variant="outline" onClick={() => setSearchQuery('')}>
            {t('knowledge.clearSearch', 'Wyczyść wyszukiwanie')}
          </Button>
        </div>
      )}
    </div>
  );
};

export default KnowledgeBasePage;