import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { BookText, Sparkles, BookOpen, Library } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import FileUploader from '@/components/FileUploader';
import SummaryModeSelector from '@/components/SummaryModeSelector';
import TabsView from '@/components/TabsView';
import Spinner from '@/components/Spinner';
import { useIsMobile } from '@/hooks/use-mobile';
import DecorativeShapes from '@/components/DecorativeShapes';
import { useFlashcardSets } from '@/hooks/use-flashcare-sets';

const Index = () => {
  const [file, setFile] = useState<File | null>(null);
  const [summaryMode, setSummaryMode] = useState<string>('brief');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isResultReady, setIsResultReady] = useState<boolean>(false);
  const [summaryContent, setSummaryContent] = useState<string>('');
  const [flashcards, setFlashcards] = useState<Array<{ question: string; answer: string }>>([]);
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const { addFlashcardSet } = useFlashcardSets();

  const processDocument = async () => {
    if (!file) {
      toast.error('Please upload a document first');
      return;
    }

    setIsProcessing(true);
    setIsResultReady(false);

    try {
      await new Promise(resolve => setTimeout(resolve, 3000));

      if (summaryMode === 'brief') {
        setSummaryContent("This is a concise summary of your document. The key points include the main thesis, supporting evidence, and conclusions drawn by the author. The document explores themes of innovation and creativity in modern business practices.");
      } else {
        setSummaryContent("This in-depth analysis provides a comprehensive examination of your document's content.\n\nThe document begins by establishing a theoretical framework for understanding complex systems in organizational structures. It then provides extensive evidence from case studies across multiple industries, demonstrating how these principles apply in real-world scenarios.\n\nThe author presents a compelling argument for adopting adaptive management strategies, drawing on both quantitative data and qualitative assessments from industry leaders. Statistical analysis supports the correlation between implementation of these strategies and improved business outcomes.\n\nFurthermore, the document explores potential challenges in implementation and offers detailed mitigation strategies. The conclusion synthesizes these findings and presents a roadmap for practical application.");
      }

      const generatedFlashcards = [
        {
          question: "What is the main thesis of the document?",
          answer: "Adaptive management strategies lead to improved business outcomes in complex organizational systems."
        },
        {
          question: "What evidence does the author use to support their arguments?",
          answer: "Case studies across multiple industries, statistical analysis, and qualitative assessments from industry leaders."
        },
        {
          question: "What are the key challenges identified in implementing the proposed strategies?",
          answer: "Resistance to change, resource constraints, and lack of organizational alignment."
        },
        {
          question: "How does the document recommend addressing implementation challenges?",
          answer: "Through stakeholder engagement, phased implementation, and continuous monitoring with feedback loops."
        },
        {
          question: "What metrics are suggested for measuring success?",
          answer: "Operational efficiency, employee engagement, innovation output, and financial performance indicators."
        }
      ];

      setFlashcards(generatedFlashcards);
      setIsResultReady(true);
      toast.success('Document processed successfully!');
    } catch (error) {
      toast.error('An error occurred while processing the document');
      console.error('Error processing document:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileSelect = (selectedFile: File) => {
    setFile(selectedFile);
    setIsResultReady(false);
  };

  const handleSummaryModeChange = (mode: string) => {
    setSummaryMode(mode);
  };

  const saveFlashcardSet = () => {
    if (!file || !isResultReady) return;
    
    const enhancedFlashcards = flashcards.map((card, index) => ({
      id: `card-${index + 1}`,
      question: card.question,
      answer: card.answer,
      mcqOptions: [
        { id: `opt-1-${index}`, text: card.answer, isCorrect: true },
        { id: `opt-2-${index}`, text: "Incorrect option 1", isCorrect: false },
        { id: `opt-3-${index}`, text: "Incorrect option 2", isCorrect: false },
        { id: `opt-4-${index}`, text: "Incorrect option 3", isCorrect: false },
      ]
    }));
    
    const newSet = addFlashcardSet({
      title: file.name.replace(/\.[^/.]+$/, ""),
      description: `Summary: ${summaryContent.substring(0, 100)}...`,
      flashcards: enhancedFlashcards
    });
    
    toast.success('Flashcard set saved successfully!');
    navigate(`/flashcards/${newSet.id}`);
  };

  return (
    <div className="min-h-screen bg-background bg-study-pattern flex flex-col relative">
      <DecorativeShapes variant="minimal" />
      
      <header className="w-full py-4 px-6 border-b bg-card relative z-10">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <BookOpen className="h-7 w-7 text-primary mr-2" />
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-study-700">StudyMe</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <Link to="/flashcards">
              <Button variant="ghost" className="flex items-center">
                <Library className="h-5 w-5 mr-2" />
                My Flashcards
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 py-8 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-bold tracking-tight mb-2">Document Summarizer & Flashcard Creator</h2>
            <p className="text-muted-foreground">Transform your documents into concise summaries and effective study cards</p>
          </div>

          <div className={`grid ${isResultReady ? 'grid-cols-1 lg:grid-cols-2 gap-8' : 'grid-cols-1'}`}>
            <div className={`space-y-6 ${isResultReady && !isMobile ? 'lg:border-r lg:pr-6' : ''}`}>
              <Card className="overflow-hidden border-primary/10 shadow-lg shadow-primary/5">
                <div className="absolute inset-0 bg-gradient-study rounded-t-lg h-6"></div>
                <CardContent className="pt-10">
                  <div className="relative">
                    <h3 className="text-lg font-medium mb-4 flex items-center">
                      <BookText className="h-5 w-5 text-primary mr-2" />
                      Upload Your Study Material
                    </h3>
                    <FileUploader onFileSelect={handleFileSelect} />
                    
                    {file && (
                      <div className="mt-6">
                        <SummaryModeSelector 
                          mode={summaryMode} 
                          onChange={handleSummaryModeChange} 
                        />
                        
                        <Button 
                          onClick={processDocument} 
                          disabled={isProcessing} 
                          className="w-full mt-4 bg-primary hover:bg-primary/90"
                        >
                          {isProcessing ? (
                            <>
                              <Spinner size="sm" className="mr-2" />
                              Processing...
                            </>
                          ) : (
                            <>
                              <Sparkles className="h-4 w-4 mr-2" />
                              Generate Summary & Flashcards
                            </>
                          )}
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
              
              {isResultReady && isMobile && (
                <div className="pt-4">
                  <TabsView 
                    summaryContent={summaryContent}
                    flashcards={flashcards}
                    isLoading={isProcessing}
                  />
                  
                  <div className="mt-6 text-center">
                    <Button onClick={saveFlashcardSet} className="w-full mb-3">
                      <BookOpen className="mr-2 h-4 w-4" />
                      Save as Flashcard Set
                    </Button>
                  </div>
                </div>
              )}
            </div>
            
            {isResultReady && !isMobile && (
              <div>
                <TabsView 
                  summaryContent={summaryContent}
                  flashcards={flashcards}
                  isLoading={isProcessing}
                />
                
                <div className="mt-6 text-center">
                  <Button onClick={saveFlashcardSet} className="w-full">
                    <BookOpen className="mr-2 h-4 w-4" />
                    Save as Flashcard Set
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className="w-full py-4 px-6 border-t relative z-10">
        <div className="max-w-6xl mx-auto text-center text-sm text-muted-foreground">
          <p>StudyMe © {new Date().getFullYear()} - AI-powered document assistant</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
