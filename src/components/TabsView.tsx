
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SummaryView from './SummaryView';
import FlashcardView from './FlashcardView';

interface TabsViewProps {
  summaryContent: string;
  flashcards: Array<{ question: string; answer: string }>;
  isLoading: boolean;
}

const TabsView: React.FC<TabsViewProps> = ({ 
  summaryContent, 
  flashcards,
  isLoading
}) => {
  return (
    <Tabs defaultValue="summary" className="w-full">
      <TabsList className="grid w-full grid-cols-2 mb-8">
        <TabsTrigger value="summary">Summary</TabsTrigger>
        <TabsTrigger value="flashcards">Flashcards</TabsTrigger>
      </TabsList>
      
      <TabsContent value="summary" className="mt-0">
        <SummaryView 
          summary={summaryContent} 
          isLoading={isLoading} 
          links={[]}
        />
      </TabsContent>
      
      <TabsContent value="flashcards" className="mt-0">
        <FlashcardView 
          flashcards={flashcards} 
          isLoading={isLoading} 
        />
      </TabsContent>
    </Tabs>
  );
};

export default TabsView;