import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'wouter';
import { BlogPost } from '@shared/schema';
import BlogPostCard from './BlogPostCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Search, AlertCircle } from 'lucide-react';

const BlogSearchPage: React.FC = () => {
  const { t } = useTranslation();
  const [location] = useLocation();
  
  // Pobranie parametru wyszukiwania z URL
  const searchParams = new URLSearchParams(location.split('?')[1] || '');
  const query = searchParams.get('q') || '';
  
  // Pobieranie wyników wyszukiwania z API
  const { data: posts, isLoading, isError } = useQuery<BlogPost[]>({
    queryKey: [`/api/blog/search?q=${query}`],
    queryFn: async () => {
      if (!query || query.trim().length < 3) {
        return [];
      }
      
      const response = await fetch(`/api/blog/search?q=${encodeURIComponent(query)}`);
      if (!response.ok) {
        throw new Error('Failed to search blog posts');
      }
      return response.json();
    },
    enabled: query.trim().length >= 3
  });

  if (query.trim().length < 3) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto text-center">
          <AlertCircle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold mb-4">
            {t('blog.invalidSearchQuery', 'Nieprawidłowe zapytanie')}
          </h1>
          <p className="text-gray-600 mb-8">
            {t('blog.searchQueryTooShort', 'Zapytanie musi zawierać co najmniej 3 znaki, aby rozpocząć wyszukiwanie.')}
          </p>
          <Button asChild>
            <Link href="/blog">
              <ArrowLeft className="h-4 w-4 mr-2" />
              {t('blog.backToBlog', 'Wróć do bloga')}
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8">
        <Link href="/blog" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          {t('blog.backToBlog', 'Wróć do bloga')}
        </Link>
        
        <h1 className="text-3xl font-bold mb-2">
          {t('blog.searchResults', 'Wyniki wyszukiwania')}
        </h1>
        
        <p className="text-gray-600">
          {t('blog.searchResultsFor', 'Wyniki dla zapytania')}: <span className="font-semibold">"{query}"</span>
        </p>
      </div>

      {isLoading ? (
        // Skeleton loader
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="border rounded-lg overflow-hidden">
              <Skeleton className="h-48 w-full" />
              <div className="p-4">
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-full mb-1" />
                <Skeleton className="h-4 w-full mb-4" />
                <div className="flex justify-between items-center">
                  <Skeleton className="h-8 w-24" />
                  <Skeleton className="h-6 w-16" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : isError ? (
        // Error state
        <div className="text-center py-12 border rounded-lg">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-red-500 mb-2">
            {t('blog.searchErrorTitle', 'Wystąpił błąd podczas wyszukiwania')}
          </h3>
          <p className="text-gray-600 mb-6">
            {t('blog.searchErrorDescription', 'Nie udało się przeprowadzić wyszukiwania. Spróbuj ponownie później.')}
          </p>
          <Button onClick={() => window.location.reload()}>
            {t('blog.tryAgain', 'Spróbuj ponownie')}
          </Button>
        </div>
      ) : posts && posts.length > 0 ? (
        // Search results
        <>
          <p className="mb-6 text-gray-600">
            {t('blog.foundResults', 'Znaleziono {{count}} wyników', { count: posts.length })}
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map(post => (
              <BlogPostCard key={post.id} post={post} />
            ))}
          </div>
        </>
      ) : (
        // No results found
        <div className="text-center py-12 border border-dashed rounded-lg">
          <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">
            {t('blog.noSearchResultsTitle', 'Brak wyników wyszukiwania')}
          </h3>
          <p className="text-gray-500 mb-6">
            {t('blog.noSearchResultsDescription', 'Nie znaleziono wpisów pasujących do podanego zapytania. Spróbuj innych słów kluczowych.')}
          </p>
          <Button asChild variant="outline">
            <Link href="/blog">
              <ArrowLeft className="h-4 w-4 mr-2" />
              {t('blog.backToBlog', 'Wróć do bloga')}
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
};

export default BlogSearchPage;