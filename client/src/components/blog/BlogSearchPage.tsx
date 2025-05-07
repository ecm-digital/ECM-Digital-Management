import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { apiRequest } from '@/lib/queryClient';
import { Link } from 'wouter';
import { ChevronLeft, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import BlogPostCard from './BlogPostCard';
import LoadingSpinner from '../ui/loading-spinner';

interface BlogSearchPageProps {
  initialQuery: string;
}

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  imageUrl: string;
  authorId: string;
  authorName: string;
  publishedAt: string;
  category: string;
  tags: string[];
}

export default function BlogSearchPage({ initialQuery }: BlogSearchPageProps) {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [debouncedQuery, setDebouncedQuery] = useState(initialQuery);

  // Debounce mechanizm do opóźnienia wyszukiwania podczas wpisywania
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery]);

  // Pobierz wyniki wyszukiwania
  const { data: searchResults, isLoading, error } = useQuery<BlogPost[]>({
    queryKey: ['/api/blog/search', debouncedQuery],
    queryFn: () => apiRequest(`/api/blog/search?q=${encodeURIComponent(debouncedQuery)}`),
    enabled: debouncedQuery.length > 0,
  });

  // Obsługa wyszukiwania
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery !== debouncedQuery) {
      setDebouncedQuery(searchQuery);
    }
  };

  return (
    <div className="py-12">
      <div className="container">
        {/* Przycisk powrotu */}
        <Link href="/blog">
          <Button variant="ghost" size="sm" className="group mb-8">
            <ChevronLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
            {t('blog.backToList', 'Wróć do listy wpisów')}
          </Button>
        </Link>

        {/* Nagłówek sekcji */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-500">
            {t('blog.searchTitle', 'Wyszukiwanie wpisów')}
          </h1>
          
          {/* Formularz wyszukiwania */}
          <form onSubmit={handleSearch} className="mt-8 flex max-w-md mx-auto">
            <Input
              type="text"
              placeholder={t('blog.searchPlaceholder', 'Szukaj artykułów...')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="rounded-r-none"
            />
            <Button type="submit" className="rounded-l-none">
              <Search className="h-4 w-4 mr-2" />
              {t('blog.search', 'Szukaj')}
            </Button>
          </form>
        </div>

        {/* Wyświetl wyniki wyszukiwania */}
        {isLoading ? (
          <div className="flex justify-center">
            <LoadingSpinner size="lg" />
          </div>
        ) : error ? (
          <div className="text-center p-8 bg-red-50 rounded-lg">
            <h2 className="text-xl font-bold text-red-700 mb-2">{t('blog.errorTitle', 'Wystąpił błąd')}</h2>
            <p className="text-red-600">{t('blog.searchError', 'Nie udało się wykonać wyszukiwania. Spróbuj ponownie później.')}</p>
          </div>
        ) : (
          <>
            {searchResults && searchResults.length > 0 ? (
              <div>
                <h2 className="text-2xl font-bold mb-6">
                  {t('blog.searchResults', 'Wyniki wyszukiwania')} ({searchResults.length})
                </h2>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {searchResults.map((post) => (
                    <BlogPostCard key={post.id} post={post} />
                  ))}
                </div>
              </div>
            ) : debouncedQuery ? (
              <div className="text-center p-12 bg-gray-50 rounded-lg">
                <h2 className="text-xl font-bold text-gray-700 mb-2">{t('blog.noSearchResults', 'Brak wyników')}</h2>
                <p className="text-gray-600">
                  {t('blog.noSearchResultsMessage', 'Nie znaleziono wpisów pasujących do zapytania: ')}
                  <span className="font-semibold">"{debouncedQuery}"</span>
                </p>
                <p className="mt-2 text-gray-600">{t('blog.tryDifferentSearch', 'Spróbuj użyć innych słów kluczowych lub przeglądaj wszystkie wpisy.')}</p>
                <Link href="/blog">
                  <Button className="mt-4">
                    {t('blog.browseAllPosts', 'Przeglądaj wszystkie wpisy')}
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="text-center p-12 bg-gray-50 rounded-lg">
                <h2 className="text-xl font-bold text-gray-700 mb-2">{t('blog.enterSearchTerms', 'Wprowadź zapytanie')}</h2>
                <p className="text-gray-600">{t('blog.enterSearchTermsMessage', 'Wpisz słowa kluczowe, aby znaleźć interesujące Cię wpisy.')}</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}