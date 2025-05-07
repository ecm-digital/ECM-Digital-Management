import React, { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { Link, useRoute } from 'wouter';
import { format } from 'date-fns';
import { pl, de } from 'date-fns/locale';
import { BlogPost } from '@shared/schema';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar, 
  User, 
  Tag, 
  Eye, 
  ArrowLeft,
  MessageCircle,
  Share2,
  BookOpen
} from 'lucide-react';

const BlogPostDetail: React.FC = () => {
  const { t, i18n } = useTranslation();
  const locale = i18n.language === 'pl' ? pl : de;
  const [, params] = useRoute('/blog/:slug');
  const slug = params?.slug;
  
  // Pobieranie szczegółów wpisu z API
  const { data: post, isLoading, isError } = useQuery<BlogPost>({
    queryKey: [`/api/blog/posts/${slug}`],
    queryFn: async () => {
      const response = await fetch(`/api/blog/posts/${slug}`);
      if (!response.ok) {
        throw new Error('Failed to fetch blog post');
      }
      return response.json();
    },
    enabled: !!slug
  });

  // Formatowanie daty
  const formattedDate = post?.publishedAt 
    ? format(new Date(post.publishedAt), 'PPP', { locale })
    : '';

  // Ustawienie tytułu strony
  useEffect(() => {
    if (post) {
      document.title = `${post.title} | ECM Digital Blog`;
    }
    return () => {
      document.title = 'ECM Digital';
    };
  }, [post]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <Skeleton className="h-10 w-3/4 mb-6" />
          <div className="flex items-center mb-8">
            <Skeleton className="h-6 w-32 mr-6" />
            <Skeleton className="h-6 w-32" />
          </div>
          <Skeleton className="h-64 w-full mb-8" />
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

  if (isError || !post) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-3xl font-bold mb-4 text-red-500">
            {t('blog.postNotFound', 'Nie znaleziono wpisu')}
          </h1>
          <p className="text-gray-600 mb-8">
            {t('blog.postNotFoundDescription', 'Przepraszamy, ale szukany przez Ciebie wpis nie istnieje lub został usunięty.')}
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
      <div className="max-w-4xl mx-auto">
        <Link href="/blog" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          {t('blog.backToBlog', 'Wróć do bloga')}
        </Link>
        
        <h1 className="text-3xl md:text-4xl font-bold mb-4">
          {post.title}
        </h1>
        
        <div className="flex flex-wrap items-center text-gray-600 mb-8 gap-y-2">
          <div className="flex items-center mr-6">
            <Calendar className="h-4 w-4 mr-2 text-blue-500" />
            <span>{formattedDate}</span>
          </div>
          
          <div className="flex items-center mr-6">
            <Eye className="h-4 w-4 mr-2 text-blue-500" />
            <span>{post.viewCount} {t('blog.views', 'wyświetleń')}</span>
          </div>
          
          {post.category && (
            <div className="flex items-center">
              <BookOpen className="h-4 w-4 mr-2 text-blue-500" />
              <Link href={`/blog?category=${post.category}`} className="hover:text-blue-600">
                {post.category}
              </Link>
            </div>
          )}
        </div>

        {post.thumbnailUrl && (
          <div className="mb-8 rounded-lg overflow-hidden">
            <img 
              src={post.thumbnailUrl} 
              alt={post.title} 
              className="w-full h-auto object-cover"
            />
          </div>
        )}
        
        <div 
          className="prose prose-lg max-w-none mb-8"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
        
        {post.tags && post.tags.length > 0 && (
          <div className="border-t border-b py-6 my-8">
            <div className="flex flex-wrap items-center">
              <Tag className="h-5 w-5 mr-3 text-blue-500" />
              {post.tags.map(tag => (
                <Link key={tag} href={`/blog?tag=${tag}`}>
                  <Badge variant="outline" className="mr-2 hover:bg-blue-50">
                    #{tag}
                  </Badge>
                </Link>
              ))}
            </div>
          </div>
        )}
        
        <div className="flex justify-between items-center mt-12">
          <Button asChild variant="outline">
            <Link href="/blog">
              <ArrowLeft className="h-4 w-4 mr-2" />
              {t('blog.backToBlog', 'Wróć do bloga')}
            </Link>
          </Button>
          
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: post.title,
                    text: post.excerpt,
                    url: window.location.href,
                  });
                } else {
                  navigator.clipboard.writeText(window.location.href);
                  alert(t('blog.linkCopied', 'Link skopiowany do schowka!'));
                }
              }}
            >
              <Share2 className="h-4 w-4 mr-2" />
              {t('blog.share', 'Udostępnij')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogPostDetail;