
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { ChevronRight, ExternalLink } from 'lucide-react';
import TypingEffect from './TypingEffect';
interface Link {
  title: string;
  url: string;
}

interface SummaryViewProps {
  summary: string;
  links?: Link[];
  isLoading?: boolean;
  error?: string;
}

const SummaryView: React.FC<SummaryViewProps> = ({ 
  summary, 
  links = [],
  isLoading = false,
  error
}) => {
  if (isLoading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center">
            <div className="h-6 w-40 bg-muted rounded animate-pulse"></div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="h-4 bg-muted rounded w-full animate-pulse"></div>
            <div className="h-4 bg-muted rounded w-full animate-pulse"></div>
            <div className="h-4 bg-muted rounded w-5/6 animate-pulse"></div>
            <div className="h-4 bg-muted rounded w-4/6 animate-pulse"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Document Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="max-h-[400px] overflow-y-auto mb-4 pr-2">
          <TypingEffect text={summary} className="text-md leading-relaxed" />
        </div>
        
        {links.length > 0 && (
          <div className="mt-6">
            <h3 className="text-sm font-medium mb-2">Related Resources</h3>
            <ul className="space-y-2">
              {links.map((link, index) => (
                <li key={index}>
                  <a 
                    href={link.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center text-sm text-primary hover:underline"
                  >
                    <ExternalLink className="h-3.5 w-3.5 mr-1.5" />
                    {link.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SummaryView;
