import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'wouter';
import { KnowledgeBase } from '@shared/schema';
import KnowledgeArticleCard from './KnowledgeArticleCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Search, AlertCircle, FileQuestion } from 'lucide-react';

const KnowledgeSearchPage: React.FC = () => {
  const { t } = useTranslation();
  const [location] = useLocation();
  
  // Pobranie parametrów wyszukiwania z URL
  const searchParams = new URLSearchParams(location.split('?')[1] || '');
  const query = searchParams.get('q') || '';
  const tag = searchParams.get('tag');
  
  // Pobieranie wyników wyszukiwania z API
  const { data: articles, isLoading, isError } = useQuery<KnowledgeBase[]>({
    queryKey: [tag ? `/api/kb/articles?tag=${tag}` : `/api/kb/search?q=${query}`],
    queryFn: async () => {
      if (tag) {
        const response = await fetch(`/api/kb/articles?tag=${encodeURIComponent(tag)}`);
        if (!response.ok) {
          throw new Error('Failed to fetch articles by tag');
        }
        return response.json();
      } else if (!query || query.trim().length < 3) {
        return [];
      } else {
        const response = await fetch(`/api/kb/search?q=${encodeURIComponent(query)}`);
        if (!response.ok) {
          throw new Error('Failed to search knowledge base articles');
        }
        return response.json();
      }
    },
    enabled: (!!tag || query.trim().length >= 3)
  });

  // Sprawdzenie warunku wyszukiwania
  if (!tag && query.trim().length < 3) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto text-center">
          <AlertCircle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold mb-4">
            {t('knowledge.invalidSearchQuery', 'Nieprawidłowe zapytanie')}
          </h1>
          <p className="text-gray-600 mb-8">
            {t('knowledge.searchQueryTooShort', 'Zapytanie musi zawierać co najmniej 3 znaki, aby rozpocząć wyszukiwanie.')}
          </p>
          <Button asChild>
            <Link href="/knowledge">
              <ArrowLeft className="h-4 w-4 mr-2" />
              {t('knowledge.backToKnowledgeBase', 'Wróć do bazy wiedzy')}
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8">
        <Link href="/knowledge" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          {t('knowledge.backToKnowledgeBase', 'Wróć do bazy wiedzy')}
        </Link>
        
        <h1 className="text-3xl font-bold mb-2">
          {tag 
            ? t('knowledge.articlesWithTag', 'Artykuły z tagiem')
            : t('knowledge.searchResults', 'Wyniki wyszukiwania')
          }
        </h1>
        
        <p className="text-gray-600">
          {tag 
            ? <span>Tag: <span className="font-semibold">#{tag}</span></span>
            : <span>{t('knowledge.searchResultsFor', 'Wyniki dla zapytania')}: <span className="font-semibold">"{query}"</span></span>
          }
        </p>
      </div>

      {isLoading ? (
        // Skeleton loader
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
      ) : isError ? (
        // Error state
        <div className="text-center py-12 border rounded-lg">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-red-500 mb-2">
            {t('knowledge.searchErrorTitle', 'Wystąpił błąd podczas wyszukiwania')}
          </h3>
          <p className="text-gray-600 mb-6">
            {t('knowledge.searchErrorDescription', 'Nie udało się przeprowadzić wyszukiwania. Spróbuj ponownie później.')}
          </p>
          <Button onClick={() => window.location.reload()}>
            {t('knowledge.tryAgain', 'Spróbuj ponownie')}
          </Button>
        </div>
      ) : articles && articles.length > 0 ? (
        // Search results
        <>
          <p className="mb-6 text-gray-600">
            {t('knowledge.foundResults', 'Znaleziono {{count}} wyników', { count: articles.length })}
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map(article => (
              <KnowledgeArticleCard key={article.id} article={article} />
            ))}
          </div>
        </>
      ) : (
        // No results found
        <div className="text-center py-12 border border-dashed rounded-lg">
          <FileQuestion className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">
            {t('knowledge.noSearchResultsTitle', 'Brak wyników wyszukiwania')}
          </h3>
          <p className="text-gray-500 mb-6">
            {tag
              ? t('knowledge.noTagResults', 'Nie znaleziono artykułów z tym tagiem.')
              : t('knowledge.noSearchResultsDescription', 'Nie znaleziono artykułów pasujących do podanego zapytania. Spróbuj innych słów kluczowych.')
            }
          </p>
          <Button asChild variant="outline">
            <Link href="/knowledge">
              <ArrowLeft className="h-4 w-4 mr-2" />
              {t('knowledge.backToKnowledgeBase', 'Wróć do bazy wiedzy')}
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
};

export default KnowledgeSearchPage;