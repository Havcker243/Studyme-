// File: TabsView.tsx (acts as the central hub)

import { useState } from "react";
import SummaryView from "./SummaryView";
import FlashcardView from "./FlashcardView";
import  FileUploader  from "./FileUploader";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { toast } from "sonner";
import { uploadFile } from "@/lib/utils";

  interface TabsViewProps {
    summaryContent: string;
    explanation?: string;
    flashcards: { question: string; answer: string }[];
    isLoading: boolean;
    links: { title: string; url: string }[];
  }

  const TabsView: React.FC<TabsViewProps> = ({ summaryContent, flashcards, isLoading, links, explanation }) => {

  return (
    <div className="space-y-6">
      <Tabs defaultValue="summary" className="w-full">
        <TabsList className="w-full grid grid-cols-2">
          <TabsTrigger value="summary">Summary</TabsTrigger>
          <TabsTrigger value="flashcards">Flashcards</TabsTrigger>
        </TabsList>
        <TabsContent value="summary">
          <SummaryView
            summary={summaryContent}
            explanation={explanation}
            isLoading={isLoading}
            links={links}
          />
        </TabsContent>
        <TabsContent value="flashcards">
          <FlashcardView
            flashcards={flashcards}
            isLoading={isLoading}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TabsView;
