import React from 'react';
import { Link } from 'wouter';
import { useTranslation } from 'react-i18next';
import { Badge } from '@/components/ui/badge';
import { Calendar, BookOpen, ArrowRight } from 'lucide-react';

interface KnowledgeArticle {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  authorId: string;
  authorName: string;
  publishedAt: string;
  category: string;
  tags: string[];
}

interface KnowledgeArticleCardProps {
  article: KnowledgeArticle;
}

export default function KnowledgeArticleCard({ article }: KnowledgeArticleCardProps) {
  const { t } = useTranslation();
  const { title, slug, excerpt, publishedAt, category, tags } = article;
  
  // Konwersja daty publikacji na lokalny format
  const formattedDate = new Date(publishedAt).toLocaleDateString();

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
      <div className="p-6">
        <div className="flex items-center mb-3 text-sm text-gray-500">
          <Badge className="mr-2 bg-blue-100 text-blue-800 hover:bg-blue-200 border-none">
            {category}
          </Badge>
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-1" />
            {formattedDate}
          </div>
        </div>
        
        <Link href={`/knowledge/${slug}`}>
          <h3 className="text-xl font-semibold text-gray-900 hover:text-blue-600 transition-colors cursor-pointer mb-3">
            {title}
          </h3>
        </Link>
        
        <p className="text-gray-600 line-clamp-3 mb-4">
          {excerpt}
        </p>
        
        {tags && tags.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-1">
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
        
        <Link href={`/knowledge/${slug}`}>
          <div className="flex items-center text-blue-600 hover:text-blue-800 font-medium cursor-pointer group">
            <BookOpen className="h-4 w-4 mr-2" />
            {t('knowledge.readArticle', 'Czytaj artykuł')}
            <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </div>
        </Link>
      </div>
    </div>
  );
}