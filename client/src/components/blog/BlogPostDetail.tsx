import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { apiRequest } from '@/lib/queryClient';
import { Link } from 'wouter';
import { ChevronLeft, Calendar, User, Tag, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import LoadingSpinner from '../ui/loading-spinner';

interface BlogPostDetailProps {
  slug: string;
}

interface BlogPost {
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

export default function BlogPostDetail({ slug }: BlogPostDetailProps) {
  const { t } = useTranslation();

  // Pobierz szczegóły wpisu na blogu na podstawie sluga
  const { data: post, isLoading, error } = useQuery<BlogPost>({
    queryKey: ['/api/blog/posts', slug],
    queryFn: () => apiRequest(`/api/blog/posts/${slug}`),
  });

  function calculateReadingTime(content: string): number {
    const wordsPerMinute = 200; // Średnia prędkość czytania
    const words = content.trim().split(/\s+/).length;
    return Math.ceil(words / wordsPerMinute);
  }

  if (isLoading) {
    return (
      <div className="container py-12 flex justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="container py-12">
        <div className="text-center p-8 bg-red-50 rounded-lg">
          <h2 className="text-xl font-bold text-red-700 mb-2">{t('blog.errorTitle', 'Wystąpił błąd')}</h2>
          <p className="text-red-600">{t('blog.postNotFound', 'Nie znaleziono wpisu na blogu. Sprawdź adres URL lub wróć do listy wpisów.')}</p>
          <Link href="/blog">
            <Button variant="outline" className="mt-4">
              <ChevronLeft className="mr-2 h-4 w-4" />
              {t('blog.backToList', 'Wróć do listy wpisów')}
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const { title, content, thumbnailUrl, authorName, publishedAt, category, tags } = post;
  const formattedDate = new Date(publishedAt).toLocaleDateString();
  const readingTime = calculateReadingTime(content);

  return (
    <div className="py-12">
      <div className="container max-w-4xl mx-auto px-4">
        <div className="mb-8">
          <Link href="/blog">
            <Button variant="ghost" size="sm" className="group mb-4">
              <ChevronLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
              {t('blog.backToList', 'Wróć do listy wpisów')}
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
                <User className="h-4 w-4 mr-1" />
                {authorName}
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <Clock className="h-4 w-4 mr-1" />
                {readingTime} {t('blog.minuteRead', 'min czytania')}
              </div>
            </div>
            
            <h1 className="text-4xl font-bold mb-4">{title}</h1>
          </div>
          
          {thumbnailUrl && (
            <div className="mb-8">
              <img 
                src={thumbnailUrl} 
                alt={title}
                className="w-full h-auto rounded-xl shadow-md"
                onError={(e) => {
                  e.currentTarget.src = '/images/placeholders/placeholder-blog.jpg';
                  e.currentTarget.onerror = null; // prevents looping
                }}
              />
            </div>
          )}
          
          <div className="prose prose-lg max-w-none">
            {content.split('\n').map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
          
          {tags && tags.length > 0 && (
            <div className="mt-12 pt-6 border-t">
              <div className="flex items-center flex-wrap gap-2">
                <Tag className="h-5 w-5 text-gray-600" />
                {tags.map((tag, index) => (
                  <Badge key={index} variant="outline" className="text-sm">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}
          
          <div className="mt-12 bg-blue-50 rounded-xl p-8">
            <h3 className="text-xl font-semibold mb-4">{t('blog.aboutAuthor', 'O autorze')}</h3>
            <div className="flex items-start">
              <div className="mr-4">
                {/* Avatar placeholder - możesz zastąpić rzeczywistym zdjęciem */}
                <div className="h-16 w-16 rounded-full bg-blue-200 flex items-center justify-center">
                  <User className="h-8 w-8 text-blue-600" />
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-lg">{authorName}</h4>
                <p className="text-gray-600 mt-1">
                  {t('blog.authorBio', 'Ekspert w dziedzinie UX/UI i marketingu cyfrowego z wieloletnim doświadczeniem w budowaniu skutecznych strategii cyfrowych.')}
                </p>
              </div>
            </div>
          </div>
          
          <div className="mt-12 flex justify-between items-center">
            <Link href="/blog">
              <Button variant="outline">
                <ChevronLeft className="mr-2 h-4 w-4" />
                {t('blog.backToList', 'Wróć do listy wpisów')}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}