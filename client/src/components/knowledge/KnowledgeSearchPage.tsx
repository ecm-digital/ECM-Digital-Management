import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { apiRequest } from '@/lib/queryClient';
import { Link } from 'wouter';
import { ChevronLeft, Search, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import KnowledgeArticleCard from './KnowledgeArticleCard';
import LoadingSpinner from '../ui/loading-spinner';

interface KnowledgeSearchPageProps {
  initialQuery: string;
}

interface KnowledgeArticle {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  authorId: string;
  authorName: string;
  publishedAt: string;
  category: string;
  tags: string[];
}

export default function KnowledgeSearchPage({ initialQuery }: KnowledgeSearchPageProps) {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [debouncedQuery, setDebouncedQuery] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  // Pobierz wszystkie dostępne kategorie i tagi
  const { data: categories } = useQuery<string[]>({
    queryKey: ['/api/kb/categories'],
    queryFn: () => apiRequest('/api/kb/categories'),
  });

  const { data: tags } = useQuery<string[]>({
    queryKey: ['/api/kb/tags'],
    queryFn: () => apiRequest('/api/kb/tags'),
  });

  // Debounce mechanizm do opóźnienia wyszukiwania podczas wpisywania
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery]);

  // Pobierz wyniki wyszukiwania z uwzględnieniem filtrów
  const { data: searchResults, isLoading, error } = useQuery<KnowledgeArticle[]>({
    queryKey: ['/api/kb/search', debouncedQuery, selectedCategory, selectedTag],
    queryFn: () => {
      let url = `/api/kb/search?q=${encodeURIComponent(debouncedQuery)}`;
      if (selectedCategory) url += `&category=${encodeURIComponent(selectedCategory)}`;
      if (selectedTag) url += `&tag=${encodeURIComponent(selectedTag)}`;
      return apiRequest(url);
    },
    enabled: debouncedQuery.length > 0 || !!selectedCategory || !!selectedTag,
  });

  // Obsługa wyszukiwania
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery !== debouncedQuery) {
      setDebouncedQuery(searchQuery);
    }
  };

  // Obsługa filtrowania po kategorii
  const handleCategoryFilter = (category: string | null) => {
    setSelectedCategory(category === selectedCategory ? null : category);
  };

  // Obsługa filtrowania po tagu
  const handleTagFilter = (tag: string | null) => {
    setSelectedTag(tag === selectedTag ? null : tag);
  };

  // Wyczyść wszystkie filtry
  const clearFilters = () => {
    setSelectedCategory(null);
    setSelectedTag(null);
    setSearchQuery('');
    setDebouncedQuery('');
  };

  // Czy jakiekolwiek filtry są aktywne
  const hasActiveFilters = !!selectedCategory || !!selectedTag || !!debouncedQuery;

  return (
    <div className="py-12">
      <div className="container">
        {/* Przycisk powrotu */}
        <Link href="/knowledge">
          <Button variant="ghost" size="sm" className="group mb-8">
            <ChevronLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
            {t('knowledge.backToList', 'Wróć do bazy wiedzy')}
          </Button>
        </Link>

        {/* Nagłówek sekcji */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-violet-500">
            {t('knowledge.searchTitle', 'Wyszukiwanie w bazie wiedzy')}
          </h1>
          
          {/* Formularz wyszukiwania */}
          <form onSubmit={handleSearch} className="mt-6 flex max-w-md mx-auto">
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

        {/* Filtry wyszukiwania */}
        <div className="mb-8">
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="font-medium text-gray-700">{t('knowledge.filterByCategory', 'Filtruj po kategorii:')}</span>
            {categories?.map((category) => (
              <Badge
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                className={`cursor-pointer ${selectedCategory === category ? 'bg-blue-600' : 'hover:bg-blue-100'}`}
                onClick={() => handleCategoryFilter(category)}
              >
                {category}
              </Badge>
            ))}
          </div>

          {tags && tags.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="font-medium text-gray-700 flex items-center">
                <Tag className="h-4 w-4 mr-1" />
                {t('knowledge.filterByTag', 'Filtruj po tagu:')}
              </span>
              {tags.slice(0, 10).map((tag) => (
                <Badge
                  key={tag}
                  variant={selectedTag === tag ? "default" : "outline"}
                  className={`cursor-pointer ${selectedTag === tag ? 'bg-blue-600' : 'hover:bg-blue-100'}`}
                  onClick={() => handleTagFilter(tag)}
                >
                  {tag}
                </Badge>
              ))}
            </div>
          )}

          {hasActiveFilters && (
            <div className="mt-4">
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                {t('knowledge.clearFilters', 'Wyczyść wszystkie filtry')}
              </Button>
            </div>
          )}
        </div>

        {/* Wyświetl wyniki wyszukiwania */}
        {isLoading ? (
          <div className="flex justify-center">
            <LoadingSpinner size="lg" />
          </div>
        ) : error ? (
          <div className="text-center p-8 bg-red-50 rounded-lg">
            <h2 className="text-xl font-bold text-red-700 mb-2">{t('knowledge.errorTitle', 'Wystąpił błąd')}</h2>
            <p className="text-red-600">{t('knowledge.searchError', 'Nie udało się wykonać wyszukiwania. Spróbuj ponownie później.')}</p>
          </div>
        ) : (
          <>
            {searchResults && searchResults.length > 0 ? (
              <div>
                <h2 className="text-2xl font-bold mb-6">
                  {t('knowledge.searchResults', 'Wyniki wyszukiwania')} ({searchResults.length})
                </h2>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {searchResults.map((article) => (
                    <KnowledgeArticleCard key={article.id} article={article} />
                  ))}
                </div>
              </div>
            ) : hasActiveFilters ? (
              <div className="text-center p-12 bg-gray-50 rounded-lg">
                <h2 className="text-xl font-bold text-gray-700 mb-2">{t('knowledge.noSearchResults', 'Brak wyników')}</h2>
                <p className="text-gray-600">
                  {t('knowledge.noSearchResultsMessage', 'Nie znaleziono artykułów pasujących do podanych kryteriów.')}
                </p>
                <Button onClick={clearFilters} className="mt-4">
                  {t('knowledge.clearFilters', 'Wyczyść filtry')}
                </Button>
              </div>
            ) : (
              <div className="text-center p-12 bg-gray-50 rounded-lg">
                <h2 className="text-xl font-bold text-gray-700 mb-2">{t('knowledge.enterSearchTerms', 'Wprowadź zapytanie')}</h2>
                <p className="text-gray-600">{t('knowledge.enterSearchTermsMessage', 'Wpisz słowa kluczowe lub wybierz kategorię, aby znaleźć interesujące Cię artykuły.')}</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}