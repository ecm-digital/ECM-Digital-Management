import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { apiRequest } from '@/lib/queryClient';
import { Link } from 'wouter';
import { Search, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import BlogPostCard from './BlogPostCard';
import LoadingSpinner from '../ui/loading-spinner';

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

export default function BlogPage() {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');

  // Pobierz wszystkie wpisy na blogu
  const { data: blogPosts, isLoading, error } = useQuery<BlogPost[]>({
    queryKey: ['/api/blog/posts'],
    queryFn: () => apiRequest('/api/blog/posts'),
  });

  // Obsługa wyszukiwania
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/blog/search?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  // Pogrupuj posty według kategorii
  const groupedPosts = blogPosts?.reduce((acc, post) => {
    if (!acc[post.category]) {
      acc[post.category] = [];
    }
    acc[post.category].push(post);
    return acc;
  }, {} as Record<string, BlogPost[]>) || {};

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
          <h2 className="text-xl font-bold text-red-700 mb-2">{t('blog.errorTitle', 'Wystąpił błąd')}</h2>
          <p className="text-red-600">{t('blog.errorMessage', 'Nie udało się załadować wpisów na blogu. Spróbuj odświeżyć stronę.')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12">
      <div className="container max-w-6xl mx-auto px-4">
        {/* Nagłówek sekcji */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-500">
            {t('blog.title', 'Blog ECM Digital')}
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {t('blog.description', 'Najnowsze trendy, porady i case studies z zakresu marketingu, UX/UI i rozwoju biznesu.')}
          </p>
          
          {/* Wyszukiwarka */}
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

        {/* Wyświetl najnowszy wpis jako wyróżniony */}
        {blogPosts && blogPosts.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6 text-center">{t('blog.featuredPost', 'Wyróżniony wpis')}</h2>
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="md:flex">
                <div className="md:w-1/2">
                  <img 
                    src={blogPosts[0].thumbnailUrl || '/images/placeholder-blog.jpg'}
                    alt={blogPosts[0].title}
                    className="h-64 w-full object-cover md:h-full"
                    onError={(e) => {
                      e.currentTarget.src = '/images/placeholder-blog.jpg';
                      e.currentTarget.onerror = null; // prevents looping
                    }}
                  />
                </div>
                <div className="p-8 md:w-1/2">
                  <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold">
                    {blogPosts[0].category}
                  </div>
                  <Link href={`/blog/${blogPosts[0].slug}`}>
                    <span className="block mt-1 text-2xl font-medium text-black hover:text-blue-600 transition cursor-pointer">
                      {blogPosts[0].title}
                    </span>
                  </Link>
                  <p className="mt-3 text-gray-600">
                    {blogPosts[0].excerpt}
                  </p>
                  <div className="mt-4 flex items-center">
                    <div className="text-sm text-gray-500">
                      {new Date(blogPosts[0].publishedAt).toLocaleDateString()}
                    </div>
                    <span className="mx-2 text-gray-300">•</span>
                    <div className="text-sm text-gray-500">
                      {blogPosts[0].authorName}
                    </div>
                  </div>
                  <div className="mt-6">
                    <Link href={`/blog/${blogPosts[0].slug}`}>
                      <Button variant="outline" size="sm" className="group">
                        {t('blog.readMore', 'Czytaj więcej')}
                        <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Wyświetl posty według kategorii */}
        {Object.keys(groupedPosts).length > 0 ? (
          Object.keys(groupedPosts).map((category) => (
            <div key={category} className="mb-12">
              <h2 className="text-2xl font-bold mb-6 text-center">{category}</h2>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {groupedPosts[category].map((post) => (
                  <BlogPostCard key={post.id} post={post} />
                ))}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center p-12 bg-gray-50 rounded-lg">
            <h2 className="text-xl font-bold text-gray-700 mb-2">{t('blog.noPostsTitle', 'Brak wpisów')}</h2>
            <p className="text-gray-600">{t('blog.noPostsMessage', 'Aktualnie nie ma żadnych wpisów na blogu. Zajrzyj do nas później.')}</p>
          </div>
        )}
      </div>
    </div>
  );
}