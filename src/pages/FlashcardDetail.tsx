
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, RotateCcw, Book, Trash, ArrowLeft, Home, CheckCircle2, XCircle } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useFlashcardSets } from '@/hooks/use-flashcare-sets';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog";
import DecorativeShapes from '@/components/DecorativeShapes';
import SummaryView from '@/components/SummaryView';

interface Flashcard {
  id: string;
  question: string;
  answer: string;
  mcqOptions?: { id: string; text: string; isCorrect: boolean }[];
}

const FlashcardDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getFlashcardSet, updateFlashcardSet, deleteFlashcardSet } = useFlashcardSets();
  const [flashcardSet, setFlashcardSet] = useState<{
    id: string;
    title: string;
    description: string;
    summary?: string;
    createdAt: string;
    flashcards: Flashcard[];
  } | null>(null);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [animateCard, setAnimateCard] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (id) {
      const set = getFlashcardSet(id);
      if (set) {
        setFlashcardSet(set);
      } else {
        navigate('/flashcards');
      }
    }
  }, [id, getFlashcardSet, navigate]);

  // Reset animation and answer state when changing cards
  useEffect(() => {
    setSelectedAnswer(null);
    setShowAnswer(false);
    setIsCorrect(null);
    setAnimateCard(false);
  }, [currentCardIndex]);

  // Vibration feedback function
  const triggerVibration = (pattern: number | number[]) => {
    if (navigator.vibrate) {
      navigator.vibrate(pattern);
    }
  };

  const handleNextCard = () => {
    setSelectedAnswer(null);
    setShowAnswer(false);
    if (flashcardSet) {
      setCurrentCardIndex((prevIndex) => (prevIndex + 1) % flashcardSet.flashcards.length);
    }
  };

  const handlePreviousCard = () => {
    setSelectedAnswer(null);
    setShowAnswer(false);
    if (flashcardSet) {
      setCurrentCardIndex((prevIndex) =>
        prevIndex === 0 ? flashcardSet.flashcards.length - 1 : prevIndex - 1
      );
    }
  };

  const handleAnswerSelection = (optionId: string) => {
    setSelectedAnswer(optionId);
    
    if (!flashcardSet) return;
    
    const currentCard = flashcardSet.flashcards[currentCardIndex];
    if (!currentCard.mcqOptions) return;
    
    const correctAnswer = currentCard.mcqOptions.find(opt => opt.isCorrect);
    const isAnswerCorrect = correctAnswer?.id === optionId;
    
    setAnimateCard(true);
    setIsCorrect(isAnswerCorrect);
    
    if (isAnswerCorrect) {
      // Provide positive feedback
      toast.success("Correct answer!");
      triggerVibration(100); // Short vibration for correct answer
    } else {
      // Provide feedback for incorrect answer
      toast.error("Incorrect. Try again!");
      triggerVibration([100, 50, 100]); // Pattern vibration for incorrect
    }
    
    // Reset animation after a delay
    setTimeout(() => {
      setAnimateCard(false);
    }, 1000);
  };

  const isCorrectAnswerSelected = () => {
    if (!flashcardSet || !flashcardSet.flashcards[currentCardIndex].mcqOptions) return false;
    const correctAnswer = flashcardSet.flashcards[currentCardIndex].mcqOptions?.find(opt => opt.isCorrect);
    return correctAnswer?.id === selectedAnswer;
  };

  const handleFlipCard = () => {
    setShowAnswer(!showAnswer);
    // Provide subtle feedback when flipping
    triggerVibration(50);
  };

  const handleDeleteSet = () => {
    if (id) {
      deleteFlashcardSet(id);
      toast.success('Flashcard set deleted successfully!');
      navigate('/flashcards');
    }
  };

  if (!flashcardSet) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="text-center">
            <p className="text-muted-foreground">Loading flashcard set...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentCard = flashcardSet.flashcards[currentCardIndex];
  const hasMCQOptions = currentCard.mcqOptions && currentCard.mcqOptions.length > 0;
  
  // Determine card animation class
  const cardAnimationClass = animateCard
    ? isCorrect
      ? "animate-[pulse_0.5s_ease-in-out] border-green-500 border-2"
      : "animate-[shake_0.5s_ease-in-out] border-red-500 border-2"
    : "";

  return (
    <div className="min-h-screen bg-background bg-study-pattern flex flex-col relative">
      <DecorativeShapes />
      <header className="w-full py-4 px-6 border-b bg-card relative z-10">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <Link to="/flashcards" className="flex items-center space-x-2 text-sm">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Flashcard Sets</span>
          </Link>
          <Link to="/" className="flex items-center space-x-2 text-sm">
            <Home className="h-4 w-4" />
            <span>Home</span>
          </Link>
        </div>
      </header>

      <main className="flex-1 py-8 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto">
          <Card className="overflow-hidden border-primary/10 shadow-lg shadow-primary/5">
            <div className="absolute inset-0 bg-gradient-study rounded-t-lg h-6"></div>
            <CardHeader className="pt-10">
              <CardTitle className="text-2xl font-bold flex items-center justify-between">
                {flashcardSet.title}
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="icon">
                      <Trash className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete this flashcard set from your
                        collection.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleDeleteSet}>Delete</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Tabs defaultValue="flashcards" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="flashcards">Flashcards</TabsTrigger>
                  <TabsTrigger value="summary" disabled={!flashcardSet.summary}>Summary</TabsTrigger>
                </TabsList>
                <TabsContent value="flashcards" className="mt-2">
                  <div className="mb-4 text-sm text-muted-foreground">
                    Card {currentCardIndex + 1} of {flashcardSet.flashcards.length}
                  </div>
                  <Card
                    ref={cardRef}
                    className={`w-full min-h-[200px] cursor-pointer relative transition-all duration-300 transform hover:-translate-y-1 ${cardAnimationClass}`}
                    onClick={handleFlipCard}
                  >
                    <CardContent className="flex flex-col items-center justify-center p-6">
                      {!showAnswer ? (
                        <>
                          <h3 className="text-lg font-medium mb-2">Question</h3>
                          <p className="text-xl text-center">{currentCard.question}</p>
                        </>
                      ) : (
                        <>
                          <h3 className="text-lg font-medium mb-2">Answer</h3>
                          <p className="text-xl text-center">{currentCard.answer}</p>
                        </>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="absolute bottom-3 right-3"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleFlipCard();
                        }}
                      >
                        <RotateCcw className="h-4 w-4 mr-2" />
                        Flip Card
                      </Button>
                    </CardContent>
                  </Card>
                  {hasMCQOptions && (
                    <div className="w-full mt-4 space-y-2">
                      {currentCard.mcqOptions?.map((option) => (
                        <Button
                          key={option.id}
                          variant="outline"
                          className={`w-full justify-start ${
                            selectedAnswer === option.id
                              ? isCorrect
                                ? "bg-green-100 border-green-500 text-green-700"
                                : "bg-red-100 border-red-500 text-red-700"
                              : ""
                          }`}
                          onClick={() => handleAnswerSelection(option.id)}
                        >
                          {selectedAnswer === option.id && (
                            isCorrect ? (
                              <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" />
                            ) : (
                              <XCircle className="mr-2 h-4 w-4 text-red-500" />
                            )
                          )}
                          {option.text}
                        </Button>
                      ))}
                    </div>
                  )}
                  {hasMCQOptions && selectedAnswer && (
                    <div className={`mt-4 p-3 rounded-md ${isCorrect ? 'bg-green-100 text-green-800 animate-fade-in' : 'bg-red-100 text-red-800 animate-fade-in'}`}>
                      {isCorrect ? "Correct!" : "Incorrect. Try again."}
                    </div>
                  )}
                  <div className="flex justify-between mt-4">
                    <Button variant="outline" size="icon" onClick={handlePreviousCard} aria-label="Previous card">
                      <ChevronLeft className="h-5 w-5" />
                    </Button>
                    <Button variant="outline" size="icon" onClick={handleNextCard} aria-label="Next card">
                      <ChevronRight className="h-5 w-5" />
                    </Button>
                  </div>
                </TabsContent>
                <TabsContent value="summary" className="mt-2">
                  {flashcardSet.summary ? (
                    <SummaryView summary={flashcardSet.summary} />
                  ) : (
                    <div className="rounded-md p-4 border border-muted bg-muted/10 text-center">
                      <p className="text-muted-foreground">No summary available for this flashcard set.</p>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
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
// This file is part of the StudyMe project, a web application designed to assist users in studying and understanding documents using AI technology. The code above defines a React component that displays flashcard details, including the ability to navigate between flashcards, view summaries, and delete flashcard sets.
// The component utilizes various UI components and hooks to manage state and provide a smooth user experience. The design is responsive and includes features such as animations, feedback on user actions, and a clean layout.

