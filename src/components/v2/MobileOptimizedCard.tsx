import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { ReactNode } from 'react';

interface MobileOptimizedCardProps {
  title?: string;
  children: ReactNode;
  className?: string;
  action?: ReactNode;
  noPadding?: boolean;
}

export function MobileOptimizedCard({ 
  title, 
  children, 
  className = '', 
  action,
  noPadding = false 
}: MobileOptimizedCardProps) {
  return (
    <Card className={`dark:bg-gray-800 dark:border-gray-700 touch-manipulation ${className}`}>
      {title && (
        <CardHeader className={`${noPadding ? 'pb-0' : ''}`}>
          <div className="flex items-center justify-between">
            <CardTitle className="dark:text-white text-base md:text-lg">{title}</CardTitle>
            {action}
          </div>
        </CardHeader>
      )}
      <CardContent className={`${noPadding ? 'p-0' : ''} ${!title && noPadding ? 'p-0' : ''}`}>
        {children}
      </CardContent>
    </Card>
  );
}
