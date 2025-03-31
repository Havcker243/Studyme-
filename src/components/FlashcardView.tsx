
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, RotateCcw, ExternalLink, CheckCircle2, XCircle, AlertTriangle } from 'lucide-react';
import { toast } from "sonner";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface Flashcard {
  question: string;
  answer: string;
  mcqOptions?: { id: string; text: string; isCorrect: boolean }[];
}

interface FlashcardViewProps {
  flashcards: Flashcard[];
  isLoading?: boolean;
  error?: string;
}

const FlashcardView: React.FC<FlashcardViewProps> = ({ 
  flashcards, 
  isLoading = false,
  error = null
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [animateCard, setAnimateCard] = useState(false);
  
  const currentFlashcard = flashcards && flashcards.length > 0 ? flashcards[currentIndex] : null;
  const hasMCQOptions = currentFlashcard?.mcqOptions && currentFlashcard.mcqOptions.length > 0;

  // Reset animation state when changing cards
  useEffect(() => {
    setAnimateCard(false);
    setIsCorrect(null);
    setSelectedAnswer(null);
  }, [currentIndex]);
  
  // Vibration feedback
  const triggerVibration = (duration: number | number[]) => {
    if (navigator.vibrate) {
      try {
        navigator.vibrate(duration);
      } catch (error) {
        console.warn("Vibration API error:", error);
        // Silently fail if vibration is not supported or fails
      }
    }
  };

  if (isLoading) {
    return (
      <Card className="w-full h-80 flex items-center justify-center">
        <CardContent className="flex flex-col items-center space-y-4 p-6">
          <div className="w-full h-32 bg-muted rounded animate-pulse" />
          <div className="flex space-x-2 mt-4">
            <div className="h-9 w-9 rounded-full bg-muted animate-pulse" />
            <div className="h-9 w-24 rounded bg-muted animate-pulse" />
            <div className="h-9 w-9 rounded-full bg-muted animate-pulse" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full h-60">
        <CardContent className="flex flex-col items-center justify-center p-6">
          <Alert variant="destructive" className="mb-4">
            <AlertTriangle className="h-4 w-4 mr-2" />
            <AlertDescription>
              {error}
            </AlertDescription>
          </Alert>
          <Button 
            variant="outline" 
            onClick={() => window.location.reload()}
            className="mt-4"
          >
            Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (!flashcards || flashcards.length === 0) {
    return (
      <Card className="w-full h-60 flex items-center justify-center">
        <CardContent className="text-center p-6">
          <p className="text-muted-foreground">No flashcards available.</p>
        </CardContent>
      </Card>
    );
  }

  const goToPrevious = () => {
    setShowAnswer(false);
    setCurrentIndex((prev) => (prev === 0 ? flashcards.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setShowAnswer(false);
    setCurrentIndex((prev) => (prev === flashcards.length - 1 ? 0 : prev + 1));
  };

  const flipCard = () => {
    setShowAnswer((prev) => !prev);
    triggerVibration(50);
  };

  const checkAnswer = (optionId: string) => {
    if (!hasMCQOptions) return;
    
    setSelectedAnswer(optionId);
    const correctOption = currentFlashcard.mcqOptions?.find(opt => opt.isCorrect);
    const isAnswerCorrect = correctOption?.id === optionId;
    
    setAnimateCard(true);
    setIsCorrect(isAnswerCorrect);
    
    if (isAnswerCorrect) {
      // Provide positive feedback
      toast.success("Correct answer!");
      triggerVibration(100); // Short vibration for correct answer
    } else {
      // Provide feedback for incorrect answer
      toast.error("Try again!");
      triggerVibration([100, 50, 100]); // Pattern vibration for incorrect
    }
    
    // Reset animation after a delay
    setTimeout(() => {
      setAnimateCard(false);
    }, 1000);
  };

  // Determine card animation class
  const cardAnimationClass = animateCard
    ? isCorrect
      ? "animate-[pulse_0.5s_ease-in-out] border-green-500 border-2"
      : "animate-[shake_0.5s_ease-in-out] border-red-500 border-2"
    : "";

  return (
    <div className="w-full">
      <Card 
        className={`w-full min-h-[300px] cursor-pointer relative transition-all duration-300 transform hover:-translate-y-1 ${cardAnimationClass}`}
        onClick={flipCard}
      >
        <CardContent className="p-6 flex flex-col items-center justify-center min-h-[300px] relative">
          <div className="absolute top-3 right-3 text-xs text-muted-foreground">
            {currentIndex + 1} / {flashcards.length}
          </div>
          
          <div className="text-center">
            {!showAnswer ? (
              <>
                <h3 className="text-lg font-medium mb-2">Question</h3>
                <p className="text-xl">{currentFlashcard.question}</p>
                
                {hasMCQOptions && (
                  <div className="mt-4 space-y-2">
                    {currentFlashcard.mcqOptions?.map((option) => (
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
                        onClick={(e) => {
                          e.stopPropagation();
                          checkAnswer(option.id);
                        }}
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
        
        <Link to="/flashcards/demo">
          <Button variant="outline" size="sm">
            Full Mode
            <ExternalLink className="h-4 w-4 ml-1" />
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default FlashcardView;