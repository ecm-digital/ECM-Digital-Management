import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { apiRequest } from '@/lib/queryClient';
import { Link } from 'wouter';
import { ChevronLeft, Calendar, Tag, Clock, BookOpen, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import LoadingSpinner from '../ui/loading-spinner';

interface KnowledgeArticleDetailProps {
  slug: string;
}

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

export default function KnowledgeArticleDetail({ slug }: KnowledgeArticleDetailProps) {
  const { t } = useTranslation();

  // Pobierz szczegóły artykułu na podstawie sluga
  const { data: article, isLoading, error } = useQuery<KnowledgeArticle>({
    queryKey: ['/api/kb/articles', slug],
    queryFn: () => apiRequest(`/api/kb/articles/${slug}`),
  });

  function calculateReadingTime(content: string): number {
    const wordsPerMinute = 200; // Średnia prędkość czytania
    const words = content.trim().split(/\s+/).length;
    return Math.ceil(words / wordsPerMinute);
  }

  // Obsługa udostępniania artykułu
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: article?.title,
        text: article?.excerpt,
        url: window.location.href,
      }).catch((error) => console.error('Błąd podczas udostępniania:', error));
    } else {
      navigator.clipboard.writeText(window.location.href)
        .then(() => alert(t('knowledge.linkCopied', 'Link skopiowany do schowka')))
        .catch((error) => console.error('Błąd podczas kopiowania:', error));
    }
  };

  if (isLoading) {
    return (
      <div className="container py-12 flex justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="container py-12">
        <div className="text-center p-8 bg-red-50 rounded-lg">
          <h2 className="text-xl font-bold text-red-700 mb-2">{t('knowledge.errorTitle', 'Wystąpił błąd')}</h2>
          <p className="text-red-600">{t('knowledge.articleNotFound', 'Nie znaleziono artykułu. Sprawdź adres URL lub wróć do bazy wiedzy.')}</p>
          <Link href="/knowledge">
            <Button variant="outline" className="mt-4">
              <ChevronLeft className="mr-2 h-4 w-4" />
              {t('knowledge.backToList', 'Wróć do bazy wiedzy')}
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const { title, content, publishedAt, category, tags, thumbnailUrl, authorName } = article;
  const formattedDate = new Date(publishedAt).toLocaleDateString();
  const readingTime = calculateReadingTime(content);

  // Podziel zawartość na sekcje według nagłówków
  const contentSections = content.split(/#{2,3}\s+/).filter(Boolean);
  
  // Wyodrębnij nagłówki z sekcji (zakładając, że każda sekcja zaczyna się od nagłówka)
  const headings = contentSections.map(section => {
    const firstLine = section.split('\n')[0].trim();
    return firstLine;
  });

  return (
    <div className="py-12">
      <div className="container max-w-4xl mx-auto px-4">
        <div className="mb-8">
          <Link href="/knowledge">
            <Button variant="ghost" size="sm" className="group mb-4">
              <ChevronLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
              {t('knowledge.backToList', 'Wróć do bazy wiedzy')}
            </Button>
          </Link>
          
          <div className="mb-6">
            <div className="flex flex-wrap gap-2 mb-4">
              <Badge className="bg-blue-600 hover:bg-blue-700">{category}</Badge>
              <div className="flex items-center text-sm text-gray-500">
                <Calendar className="h-4 w-4 mr-1" />
                {formattedDate}
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <Clock className="h-4 w-4 mr-1" />
                {readingTime} {t('knowledge.minuteRead', 'min czytania')}
              </div>
            </div>
            
            <h1 className="text-4xl font-bold mb-4">{title}</h1>
            
            {authorName && (
              <div className="flex items-center mb-6">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                    {authorName.substring(0, 1)}
                  </div>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">{authorName}</p>
                  <p className="text-xs text-gray-500">{t('knowledge.author', 'Autor')}</p>
                </div>
              </div>
            )}
            
            {thumbnailUrl && (
              <div className="mb-8 mt-4 rounded-xl overflow-hidden">
                <img 
                  src={thumbnailUrl} 
                  alt={title}
                  className="w-full h-auto max-h-96 object-cover"
                  onError={(e) => {
                    e.currentTarget.src = '/images/placeholder-knowledge.jpg';
                    e.currentTarget.onerror = null; // prevents looping
                  }}
                />
              </div>
            )}
          </div>
          
          {/* Spis treści (jeśli artykuł ma więcej niż 1 sekcję) */}
          {contentSections.length > 1 && (
            <div className="mb-8 bg-blue-50 p-6 rounded-xl">
              <h3 className="text-lg font-semibold mb-3 flex items-center">
                <BookOpen className="h-5 w-5 mr-2 text-blue-700" />
                {t('knowledge.tableOfContents', 'Spis treści')}
              </h3>
              <ul className="list-disc list-inside space-y-1">
                {headings.map((heading, index) => (
                  <li key={index} className="text-blue-700 hover:text-blue-900">
                    <a href={`#section-${index + 1}`} className="hover:underline">
                      {heading}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {/* Treść artykułu podzielona na sekcje */}
          <div className="prose prose-lg max-w-none">
            {contentSections.length > 1 ? (
              contentSections.map((section, index) => {
                const lines = section.split('\n');
                const heading = lines.shift();
                const content = lines.join('\n');
                
                return (
                  <div key={index} id={`section-${index + 1}`} className="mb-8">
                    <h2 className="text-2xl font-bold mb-4">{heading}</h2>
                    {content.split('\n\n').map((paragraph, pIndex) => (
                      <p key={pIndex}>{paragraph}</p>
                    ))}
                  </div>
                );
              })
            ) : (
              content.split('\n\n').map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))
            )}
          </div>
          
          {/* Tagi i akcje */}
          <div className="mt-12 pt-6 border-t flex flex-wrap justify-between items-center">
            <div className="flex items-center flex-wrap gap-2 mb-4 md:mb-0">
              <Tag className="h-5 w-5 text-gray-600" />
              {tags && tags.length > 0 ? (
                tags.map((tag, index) => (
                  <Badge key={index} variant="outline" className="text-sm">
                    {tag}
                  </Badge>
                ))
              ) : (
                <span className="text-gray-500">{t('knowledge.noTags', 'Brak tagów')}</span>
              )}
            </div>
            
            <Button variant="outline" size="sm" onClick={handleShare} className="gap-2">
              <Share2 className="h-4 w-4" />
              {t('knowledge.shareArticle', 'Udostępnij')}
            </Button>
          </div>
          
          {/* Przycisk powrotu */}
          <div className="mt-8">
            <Link href="/knowledge">
              <Button variant="outline">
                <ChevronLeft className="mr-2 h-4 w-4" />
                {t('knowledge.backToList', 'Wróć do bazy wiedzy')}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}