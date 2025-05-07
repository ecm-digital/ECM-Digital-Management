import React from 'react';
import { Link } from 'wouter';
import { KnowledgeBase } from '@shared/schema';
import { useTranslation } from 'react-i18next';
import { FileText, ChevronRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface KnowledgeArticleCardProps {
  article: KnowledgeBase;
}

const KnowledgeArticleCard: React.FC<KnowledgeArticleCardProps> = ({ article }) => {
  const { t } = useTranslation();

  return (
    <Card className="h-full hover:shadow-md transition-shadow duration-300">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-semibold line-clamp-2">
            <Link 
              href={`/knowledge/${article.slug}`} 
              className="hover:text-blue-600 transition-colors"
            >
              {article.title}
            </Link>
          </CardTitle>
          <Badge variant="outline" className="ml-2 shrink-0">
            {article.category}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600 mb-4 line-clamp-3 text-sm">
          {article.excerpt}
        </p>
        <div className="flex justify-between items-center mt-auto">
          <div className="text-xs text-gray-500">
            {t('knowledge.views', 'Wyświetlenia')}: {article.viewCount}
          </div>
          <Link 
            href={`/knowledge/${article.slug}`}
            className="text-sm font-medium text-blue-600 hover:text-blue-800 flex items-center"
          >
            {t('knowledge.readMore', 'Czytaj dalej')}
            <ChevronRight className="h-4 w-4 ml-1" />
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default KnowledgeArticleCard;