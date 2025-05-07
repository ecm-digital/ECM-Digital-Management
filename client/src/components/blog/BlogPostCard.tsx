import React from 'react';
import { Link } from 'wouter';
import { useTranslation } from 'react-i18next';
import { Badge } from '@/components/ui/badge';
import { Calendar, User } from 'lucide-react';

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

interface BlogPostCardProps {
  post: BlogPost;
}

export default function BlogPostCard({ post }: BlogPostCardProps) {
  const { t } = useTranslation();
  const { title, slug, excerpt, imageUrl, authorName, publishedAt, category, tags } = post;
  
  // Konwersja daty publikacji na lokalny format
  const formattedDate = new Date(publishedAt).toLocaleDateString();

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="relative h-48">
        <img 
          src={imageUrl || '/images/placeholder-blog.jpg'} 
          alt={title}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-4 left-4">
          <Badge className="bg-blue-600 hover:bg-blue-700">{category}</Badge>
        </div>
      </div>
      
      <div className="p-6">
        <Link href={`/blog/${slug}`}>
          <h3 className="text-xl font-semibold text-gray-900 hover:text-blue-600 transition-colors cursor-pointer">
            {title}
          </h3>
        </Link>
        
        <p className="mt-2 text-gray-600 line-clamp-3">
          {excerpt}
        </p>
        
        <div className="mt-4 flex items-center text-sm text-gray-500">
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-1" />
            {formattedDate}
          </div>
          <span className="mx-2">•</span>
          <div className="flex items-center">
            <User className="h-4 w-4 mr-1" />
            {authorName}
          </div>
        </div>
        
        {tags && tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {tags.slice(0, 3).map((tag, index) => (
              <Badge key={index} variant="outline" className="text-xs bg-gray-50">
                {tag}
              </Badge>
            ))}
            {tags.length > 3 && (
              <Badge variant="outline" className="text-xs bg-gray-50">
                +{tags.length - 3}
              </Badge>
            )}
          </div>
        )}
        
        <div className="mt-4">
          <Link href={`/blog/${slug}`}>
            <span className="text-blue-600 hover:text-blue-800 font-medium cursor-pointer inline-flex items-center">
              {t('blog.readMore', 'Czytaj więcej')}
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}