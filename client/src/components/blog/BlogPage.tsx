import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import { useTranslation } from 'react-i18next';
import { BlogPost } from '@shared/schema';
import BlogPostCard from './BlogPostCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Search,
  Tag,
  Calendar,
  BookOpen, 
  ChevronRight,
  ArrowRight
} from 'lucide-react';

const BlogPage: React.FC = () => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  // Pobieranie postów z API
  const { data: posts, isLoading, isError } = useQuery<BlogPost[]>({
    queryKey: ['/api/blog/posts', selectedCategory, selectedTag],
    queryFn: async () => {
      let url = '/api/blog/posts';
      const params = new URLSearchParams();
      
      if (selectedCategory) {
        params.append('category', selectedCategory);
      }
      
      if (selectedTag) {
        params.append('tag', selectedTag);
      }
      
      if (params.toString()) {
        url += `?${params.toString()}`;
      }
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch blog posts');
      }
      return response.json();
    }
  });

  // Pobieranie wszystkich kategorii z postów
  const categories = posts 
    ? [...new Set(posts.filter(post => post.category).map(post => post.category))]
    : [];

  // Pobieranie wszystkich tagów z postów
  const tags = posts
    ? [...new Set(posts.flatMap(post => post.tags || []))]
    : [];

  // Funkcja do obsługi wyszukiwania
  const handleSearch = () => {
    if (searchQuery.trim().length >= 3) {
      window.location.href = `/blog/search?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  // Obsługa naciśnięcia Enter w polu wyszukiwania
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // Filtrowanie postów na podstawie wyszukiwania (frontend)
  const filteredPosts = posts?.filter(post => 
    post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-12 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-500 to-cyan-400 bg-clip-text text-transparent">
          {t('blog.title', 'Blog ECM Digital')}
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          {t('blog.description', 'Najnowsze trendy, porady i inspiracje ze świata UX/UI, web designu i marketingu cyfrowego.')}
        </p>
        <div className="mt-8 max-w-md mx-auto flex">
          <Input
            type="text"
            placeholder={t('blog.searchPlaceholder', 'Szukaj artykułów...')}
            className="mr-2"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <Button onClick={handleSearch} disabled={searchQuery.trim().length < 3}>
            <Search className="h-4 w-4 mr-2" />
            {t('blog.search', 'Szukaj')}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="rounded-lg border p-4 mb-6 sticky top-20">
            <h3 className="font-medium text-lg mb-4 flex items-center">
              <BookOpen className="h-5 w-5 mr-2 text-blue-500" />
              {t('blog.categories', 'Kategorie')}
            </h3>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => setSelectedCategory(null)}
                  className={`w-full text-left px-2 py-1 rounded transition ${
                    selectedCategory === null ? 'bg-blue-50 text-blue-600 font-medium' : 'hover:bg-gray-100'
                  }`}
                >
                  {t('blog.allCategories', 'Wszystkie kategorie')}
                </button>
              </li>
              {categories.map(category => (
                <li key={category}>
                  <button
                    onClick={() => setSelectedCategory(category)}
                    className={`w-full text-left px-2 py-1 rounded transition flex items-center ${
                      selectedCategory === category ? 'bg-blue-50 text-blue-600 font-medium' : 'hover:bg-gray-100'
                    }`}
                  >
                    <ChevronRight className={`h-4 w-4 mr-1 transition-transform ${
                      selectedCategory === category ? 'transform rotate-90' : ''
                    }`} />
                    {category}
                  </button>
                </li>
              ))}
            </ul>

            {tags.length > 0 && (
              <>
                <h3 className="font-medium text-lg mt-8 mb-4 flex items-center">
                  <Tag className="h-5 w-5 mr-2 text-blue-500" />
                  {t('blog.popularTags', 'Popularne tagi')}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {tags.map(tag => (
                    <button
                      key={tag}
                      onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                      className={`text-sm px-3 py-1 rounded-full transition ${
                        selectedTag === tag 
                          ? 'bg-blue-100 text-blue-600 border border-blue-300' 
                          : 'bg-gray-100 hover:bg-gray-200 border border-gray-200'
                      }`}
                    >
                      #{tag}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          {isLoading ? (
            // Skeleton loader
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[...Array(4)].map((_, i) => (
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
            <div className="text-center py-12">
              <h3 className="text-xl font-semibold text-red-500 mb-2">
                {t('blog.errorTitle', 'Ups! Coś poszło nie tak')}
              </h3>
              <p className="text-gray-600 mb-6">
                {t('blog.errorDescription', 'Nie udało się załadować wpisów z bloga. Spróbuj odświeżyć stronę.')}
              </p>
              <Button onClick={() => window.location.reload()}>
                {t('blog.refresh', 'Odśwież stronę')}
              </Button>
            </div>
          ) : filteredPosts && filteredPosts.length > 0 ? (
            // Posts grid
            <>
              {selectedCategory && (
                <div className="mb-6 flex items-center">
                  <h2 className="text-2xl font-semibold">
                    {t('blog.categoryTitle', 'Kategoria')}: {selectedCategory}
                  </h2>
                  <button
                    onClick={() => setSelectedCategory(null)}
                    className="ml-4 text-sm text-blue-500 hover:text-blue-700 flex items-center"
                  >
                    {t('blog.clearFilter', 'Wyczyść filtr')}
                  </button>
                </div>
              )}
              
              {selectedTag && (
                <div className="mb-6 flex items-center">
                  <h2 className="text-2xl font-semibold">
                    {t('blog.tagTitle', 'Tag')}: #{selectedTag}
                  </h2>
                  <button
                    onClick={() => setSelectedTag(null)}
                    className="ml-4 text-sm text-blue-500 hover:text-blue-700 flex items-center"
                  >
                    {t('blog.clearFilter', 'Wyczyść filtr')}
                  </button>
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredPosts.map(post => (
                  <BlogPostCard key={post.id} post={post} />
                ))}
              </div>
            </>
          ) : (
            // No posts found
            <div className="text-center py-12 border border-dashed rounded-lg">
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                {t('blog.noPostsTitle', 'Brak wpisów')}
              </h3>
              <p className="text-gray-500 mb-6">
                {searchQuery 
                  ? t('blog.noSearchResults', 'Nie znaleziono wpisów pasujących do zapytania.')
                  : selectedCategory 
                    ? t('blog.noCategoryPosts', 'Nie ma jeszcze wpisów w tej kategorii.')
                    : selectedTag
                      ? t('blog.noTagPosts', 'Nie ma jeszcze wpisów z tym tagiem.')
                      : t('blog.noPostsDescription', 'Nie dodano jeszcze żadnych wpisów.')
                }
              </p>
              <Button variant="outline" onClick={() => {
                setSelectedCategory(null);
                setSelectedTag(null);
                setSearchQuery('');
              }}>
                {t('blog.viewAll', 'Zobacz wszystkie wpisy')}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BlogPage;