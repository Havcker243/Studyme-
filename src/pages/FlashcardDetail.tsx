
import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { ChevronLeft, ChevronRight, RotateCcw, Save, Home, List, Check, X, Edit, Trash2, Plus } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useFlashcardSets, Flashcard, MCQOption } from '@/hooks/use-flashcare-sets';
import { Checkbox } from "@/components/ui/checkbox";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useIsMobile } from '@/hooks/use-mobile';

const FlashcardDetail = () => {
  const { id = "demo" } = useParams();
  const navigate = useNavigate();
  const { getFlashcardSet, updateFlashcardSet, deleteFlashcardSet } = useFlashcardSets();
  const flashcardSet = getFlashcardSet(id);
  const isMobile = useIsMobile();
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [mode, setMode] = useState<'flashcard' | 'mcq'>('flashcard');
  const [selectedOptionIds, setSelectedOptionIds] = useState<{[key: string]: string}>({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  
  if (!flashcardSet) {
    return (
      <div className="container py-10 text-center">
        <h2 className="text-2xl mb-4">Flashcard set not found</h2>
        <Button asChild>
          <Link to="/flashcards"><Home className="mr-2 h-4 w-4" />Go to Flashcard Library</Link>
        </Button>
      </div>
    );
  }

  const flashcards = flashcardSet.flashcards;
  const currentFlashcard = flashcards[currentIndex];

  const goToPrevious = () => {
    setShowAnswer(false);
    setShowResults(false);
    setCurrentIndex((prev) => (prev === 0 ? flashcards.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setShowAnswer(false);
    setShowResults(false);
    setCurrentIndex((prev) => (prev === flashcards.length - 1 ? 0 : prev + 1));
  };

  const flipCard = () => {
    setShowAnswer((prev) => !prev);
  };

  const handleOptionSelect = (flashcardId: string, optionId: string) => {
    setSelectedOptionIds({
      ...selectedOptionIds,
      [flashcardId]: optionId
    });
  };

  const checkAnswers = () => {
    let correctCount = 0;
    const total = flashcards.length;
    
    flashcards.forEach(card => {
      if (card.mcqOptions) {
        const selectedOptionId = selectedOptionIds[card.id];
        const correctOption = card.mcqOptions.find(option => option.isCorrect);
        
        if (selectedOptionId && correctOption && selectedOptionId === correctOption.id) {
          correctCount++;
        }
      }
    });
    
    setScore({ correct: correctCount, total });
    setShowResults(true);
    
    toast.success(`You scored ${correctCount} out of ${total}!`);
  };

  const resetQuiz = () => {
    setSelectedOptionIds({});
    setShowResults(false);
    setCurrentIndex(0);
  };

  const isOptionCorrect = (flashcardId: string, optionId: string): boolean | null => {
    if (!showResults) return null;
    
    const flashcard = flashcards.find(card => card.id === flashcardId);
    if (!flashcard || !flashcard.mcqOptions) return null;
    
    const selectedOption = flashcard.mcqOptions.find(option => option.id === optionId);
    if (!selectedOption) return null;
    
    return selectedOption.isCorrect;
  };

  const deleteSet = () => {
    if (window.confirm('Are you sure you want to delete this flashcard set? This action cannot be undone.')) {
      deleteFlashcardSet(id);
      toast.success('Flashcard set deleted successfully');
      navigate('/flashcards');
    }
  };

  return (
    <div className="min-h-screen bg-background bg-study-pattern flex flex-col relative">
      <header className="w-full py-4 px-6 border-b bg-card relative z-10">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <Link to="/" className="flex items-center">
            <Home className="h-5 w-5 text-primary mr-2" />
            <span className="font-medium">StudyMe</span>
          </Link>
          
          <div className="flex items-center space-x-4">
            <Button variant="ghost" asChild className="flex items-center">
              <Link to="/flashcards">
                <List className="h-5 w-5 mr-2" />
                {isMobile ? '' : 'All Flashcards'}
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 py-8 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6 flex justify-between items-center">
            <div>
              <Button variant="outline" asChild size="sm" className="mb-4">
                <Link to="/flashcards">
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Back to Library
                </Link>
              </Button>
              <h1 className="text-2xl font-bold">{flashcardSet.title}</h1>
              <p className="text-muted-foreground">{flashcardSet.description}</p>
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline" size="icon" onClick={deleteSet} title="Delete set">
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <Tabs defaultValue="flashcard" className="w-full mb-6" onValueChange={(value) => setMode(value as 'flashcard' | 'mcq')}>
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="flashcard">Flashcard Mode</TabsTrigger>
              <TabsTrigger value="mcq">Multiple Choice Quiz</TabsTrigger>
            </TabsList>
            
            <TabsContent value="flashcard" className="mt-0">
              <Card 
                className="w-full min-h-[300px] cursor-pointer relative transition-all duration-300 transform hover:-translate-y-1"
                onClick={flipCard}
              >
                <CardContent className="p-6 flex flex-col items-center justify-center min-h-[300px]">
                  <div className="absolute top-3 right-3 text-xs text-muted-foreground">
                    {currentIndex + 1} / {flashcards.length}
                  </div>
                  
                  <div className="text-center">
                    {!showAnswer ? (
                      <>
                        <h3 className="text-lg font-medium mb-2">Question</h3>
                        <p className="text-xl">{currentFlashcard.question}</p>
                      </>
                    ) : (
                      <>
                        <h3 className="text-lg font-medium mb-2">Answer</h3>
                        <p className="text-xl">{currentFlashcard.answer}</p>
                      </>
                    )}
                  </div>
                  
                  <div className="absolute bottom-3 right-3">
                    <Button variant="ghost" size="sm" onClick={(e) => {
                      e.stopPropagation();
                      flipCard();
                    }}>
                      <RotateCcw className="h-4 w-4 mr-1" />
                      Flip
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              <div className="flex justify-between mt-4">
                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={goToPrevious}
                    aria-label="Previous flashcard"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={goToNext}
                    aria-label="Next flashcard"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="mcq" className="mt-0">
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="text-xl">Multiple Choice Quiz</CardTitle>
                  <CardDescription>Select the correct answer for each question</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {flashcards.map((flashcard, index) => (
                    <div key={flashcard.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <h3 className="text-lg font-medium mb-2">{index + 1}. {flashcard.question}</h3>
                        {showResults && (
                          <div className="ml-2">
                            {selectedOptionIds[flashcard.id] && 
                             isOptionCorrect(flashcard.id, selectedOptionIds[flashcard.id]) ? (
                              <Check className="h-5 w-5 text-green-500" />
                            ) : (
                              <X className="h-5 w-5 text-red-500" />
                            )}
                          </div>
                        )}
                      </div>
                      
                      {flashcard.mcqOptions && (
                        <div className="mt-2 space-y-2">
                          {flashcard.mcqOptions.map((option) => {
                            const isSelected = selectedOptionIds[flashcard.id] === option.id;
                            const isCorrect = isOptionCorrect(flashcard.id, option.id);
                            let optionClassName = "flex items-start space-x-2 p-2 rounded";
                            
                            if (showResults) {
                              if (isCorrect) {
                                optionClassName += " bg-green-50 border border-green-200";
                              } else if (isSelected) {
                                optionClassName += " bg-red-50 border border-red-200";
                              }
                            } else if (isSelected) {
                              optionClassName += " bg-gray-100 border border-gray-200";
                            }
                            
                            return (
                              <label key={option.id} className={optionClassName}>
                                <Checkbox
                                  checked={isSelected}
                                  onCheckedChange={() => {
                                    if (!showResults) {
                                      handleOptionSelect(flashcard.id, option.id);
                                    }
                                  }}
                                  disabled={showResults}
                                  className="mt-1"
                                />
                                <span>{option.text}</span>
                              </label>
                            );
                          })}
                        </div>
                      )}
                      
                      {showResults && (
                        <Collapsible className="mt-4">
                          <CollapsibleTrigger asChild>
                            <Button variant="outline" size="sm">Show Answer</Button>
                          </CollapsibleTrigger>
                          <CollapsibleContent className="mt-2 p-3 bg-gray-50 rounded-md">
                            <p className="text-sm">{flashcard.answer}</p>
                          </CollapsibleContent>
                        </Collapsible>
                      )}
                    </div>
                  ))}
                </CardContent>
                <CardFooter className="flex justify-between">
                  {!showResults ? (
                    <Button 
                      onClick={checkAnswers} 
                      className="w-full"
                    >
                      Check Answers
                    </Button>
                  ) : (
                    <div className="w-full space-y-4">
                      <div className="p-4 bg-gray-50 rounded-md text-center">
                        <p className="text-lg font-medium">Your Score: {score.correct} / {score.total}</p>
                        <p className="text-sm text-muted-foreground">
                          {score.correct === score.total 
                            ? "Perfect score! Well done!" 
                            : "Keep practicing to improve your score!"}
                        </p>
                      </div>
                      <Button 
                        onClick={resetQuiz} 
                        variant="outline" 
                        className="w-full"
                      >
                        <RotateCcw className="h-4 w-4 mr-2" />
                        Retry Quiz
                      </Button>
                    </div>
                  )}
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
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

export default FlashcardDetail;
