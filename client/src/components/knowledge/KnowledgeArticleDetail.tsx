import React, { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { Link, useRoute } from 'wouter';
import { KnowledgeBase } from '@shared/schema';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  Copy, 
  ThumbsUp, 
  ThumbsDown, 
  HelpCircle, 
  FileText,
  AlertCircle,
  BookOpen,
  Tag
} from 'lucide-react';

const KnowledgeArticleDetail: React.FC = () => {
  const { t } = useTranslation();
  const [, params] = useRoute('/knowledge/:slug');
  const slug = params?.slug;

  // Pobieranie szczegółów artykułu z API
  const { data: article, isLoading, isError } = useQuery<KnowledgeBase>({
    queryKey: [`/api/kb/articles/${slug}`],
    queryFn: async () => {
      const response = await fetch(`/api/kb/articles/${slug}`);
      if (!response.ok) {
        throw new Error('Failed to fetch knowledge base article');
      }
      return response.json();
    },
    enabled: !!slug
  });

  // Ustawienie tytułu strony
  useEffect(() => {
    if (article) {
      document.title = `${article.title} | ECM Digital - Baza Wiedzy`;
    }
    return () => {
      document.title = 'ECM Digital';
    };
  }, [article]);

  // Ikona kategorii
  const getCategoryIcon = (category?: string) => {
    if (!category) return <FileText className="h-5 w-5" />;
    
    switch (category.toLowerCase()) {
      case 'faq':
      case 'frequently asked questions':
        return <HelpCircle className="h-5 w-5" />;
      case 'guides':
      case 'przewodniki':
        return <BookOpen className="h-5 w-5" />;
      case 'tutorials':
      case 'poradniki':
        return <FileText className="h-5 w-5" />;
      case 'troubleshooting':
      case 'rozwiązywanie problemów':
        return <AlertCircle className="h-5 w-5" />;
      default:
        return <FileText className="h-5 w-5" />;
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <Skeleton className="h-6 w-40 mb-8" />
          <Skeleton className="h-10 w-3/4 mb-4" />
          <div className="flex items-center mb-8">
            <Skeleton className="h-6 w-32 mr-4" />
            <Skeleton className="h-6 w-24" />
          </div>
          <div className="space-y-4">
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-5/6" />
          </div>
        </div>
      </div>
    );
  }

  if (isError || !article) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-3xl font-bold mb-4 text-red-500">
            {t('knowledge.articleNotFound', 'Nie znaleziono artykułu')}
          </h1>
          <p className="text-gray-600 mb-8">
            {t('knowledge.articleNotFoundDescription', 'Przepraszamy, ale szukany przez Ciebie artykuł nie istnieje lub został usunięty.')}
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
      <div className="max-w-3xl mx-auto">
        <Link href="/knowledge" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          {t('knowledge.backToKnowledgeBase', 'Wróć do bazy wiedzy')}
        </Link>

        <div className="mb-8">
          <div className="flex items-center mb-4">
            <Badge className="mr-2">
              <div className="flex items-center">
                {getCategoryIcon(article.category)}
                <span className="ml-1">{article.category}</span>
              </div>
            </Badge>
            <span className="text-sm text-gray-500">
              {t('knowledge.views', 'Wyświetlenia')}: {article.viewCount}
            </span>
          </div>
          
          <h1 className="text-3xl font-bold mb-4">
            {article.title}
          </h1>
          
          <p className="text-lg text-gray-600 italic">
            {article.excerpt}
          </p>
        </div>

        {article.thumbnailUrl && (
          <div className="mb-8 rounded-lg overflow-hidden">
            <img 
              src={article.thumbnailUrl} 
              alt={article.title} 
              className="w-full h-auto"
            />
          </div>
        )}

        <div 
          className="prose prose-lg max-w-none mb-12"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />

        {article.tags && article.tags.length > 0 && (
          <div className="border-t pt-6 mb-8">
            <div className="flex flex-wrap items-center">
              <Tag className="h-5 w-5 mr-3 text-blue-500" />
              {article.tags.map(tag => (
                <Link key={tag} href={`/knowledge/search?tag=${tag}`}>
                  <Badge variant="outline" className="mr-2 hover:bg-blue-50">
                    #{tag}
                  </Badge>
                </Link>
              ))}
            </div>
          </div>
        )}

        <div className="border-t border-b py-6 my-8">
          <h3 className="font-medium mb-4">
            {t('knowledge.articleHelpful', 'Czy ten artykuł był pomocny?')}
          </h3>
          <div className="flex space-x-4">
            <Button variant="outline" size="sm">
              <ThumbsUp className="h-4 w-4 mr-2" />
              {t('knowledge.yes', 'Tak')}
            </Button>
            <Button variant="outline" size="sm">
              <ThumbsDown className="h-4 w-4 mr-2" />
              {t('knowledge.no', 'Nie')}
            </Button>
            <Button variant="outline" size="sm" className="ml-auto" onClick={() => {
              navigator.clipboard.writeText(window.location.href);
              alert(t('knowledge.linkCopied', 'Link skopiowany do schowka!'));
            }}>
              <Copy className="h-4 w-4 mr-2" />
              {t('knowledge.copyLink', 'Kopiuj link')}
            </Button>
          </div>
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-600 mb-6">
            {t('knowledge.needMoreHelp', 'Potrzebujesz dalszej pomocy?')}
          </p>
          <Button asChild>
            <Link href="/contact">
              {t('knowledge.contactUs', 'Skontaktuj się z nami')}
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default KnowledgeArticleDetail;