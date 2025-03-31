
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SummaryView from './SummaryView';
import FlashcardView from './FlashcardView';

interface TabsViewProps {
  summaryContent?: string;
  flashcards: Array<{ question: string; answer: string }>;
  isLoading: boolean;
  error?: string;
}

const TabsView: React.FC<TabsViewProps> = ({ 
  summaryContent = "", 
  flashcards = [],
  isLoading,
  error
}) => {
  // Default to flashcards tab if no summary is available
  const defaultTab = summaryContent ? "summary" : "flashcards";

  return (
    <Tabs defaultValue={defaultTab} className="w-full">
      <TabsList className="grid w-full grid-cols-2 mb-8">
        <TabsTrigger value="summary" disabled={!summaryContent && !error}>Summary</TabsTrigger>
        <TabsTrigger value="flashcards" disabled={flashcards.length === 0 && !error}>Flashcards</TabsTrigger>
      </TabsList>
      
      {summaryContent ? (
        <TabsContent value="summary" className="mt-0">
          <SummaryView 
            summary={summaryContent} 
            isLoading={isLoading} 
            links={[]}
            error={error}
          />
        </TabsContent>
      ) : (
        <TabsContent value="summary" className="mt-0">
          <div className="rounded-md p-4 border border-muted bg-muted/10 text-center">
            <p className="text-muted-foreground">
              {error ? error : "No summary available for this document."}
            </p>
          </div>
        </TabsContent>
      )}
      
      <TabsContent value="flashcards" className="mt-0">
        <FlashcardView 
          flashcards={flashcards} 
          isLoading={isLoading} 
          error={error}
        />
      </TabsContent>
    </Tabs>
  );
};

export default TabsView;