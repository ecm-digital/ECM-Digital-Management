import React from 'react';
import { Link } from 'wouter';
import { BlogPost } from '@shared/schema';
import { formatDistanceToNow } from 'date-fns';
import { pl, de } from 'date-fns/locale';
import { useTranslation } from 'react-i18next';
import { Calendar, User, Eye, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface BlogPostCardProps {
  post: BlogPost;
}

const BlogPostCard: React.FC<BlogPostCardProps> = ({ post }) => {
  const { i18n, t } = useTranslation();
  const locale = i18n.language === 'pl' ? pl : de;
  
  // Format date using date-fns
  const formattedDate = post.publishedAt
    ? formatDistanceToNow(new Date(post.publishedAt), {
        addSuffix: true,
        locale,
      })
    : '';

  return (
    <div className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow duration-300 flex flex-col h-full bg-white">
      {post.thumbnailUrl && (
        <div className="h-48 overflow-hidden">
          <img 
            src={post.thumbnailUrl} 
            alt={post.title} 
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          />
        </div>
      )}
      
      <div className="p-5 flex flex-col flex-grow">
        {post.category && (
          <Badge variant="outline" className="mb-2 self-start">
            {post.category}
          </Badge>
        )}
        
        <h3 className="text-xl font-semibold mb-2 line-clamp-2">
          <Link href={`/blog/${post.slug}`} className="hover:text-blue-600 transition-colors">
            {post.title}
          </Link>
        </h3>
        
        <p className="text-gray-600 mb-4 line-clamp-3">
          {post.excerpt}
        </p>
        
        <div className="mt-auto pt-4 border-t text-sm text-gray-500 flex flex-wrap justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-1" />
              <span>{formattedDate}</span>
            </div>
            
            <div className="flex items-center">
              <Eye className="h-4 w-4 mr-1" />
              <span>{post.viewCount}</span>
            </div>
          </div>
          
          <Button variant="ghost" size="sm" asChild className="text-sm font-medium text-blue-600 hover:text-blue-800">
            <Link href={`/blog/${post.slug}`} className="flex items-center">
              {t('blog.readMore', 'Czytaj więcej')}
              <ArrowRight className="h-4 w-4 ml-1" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BlogPostCard;