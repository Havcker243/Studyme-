
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, RotateCcw, ExternalLink } from 'lucide-react';

interface Flashcard {
  question: string;
  answer: string;
}

interface FlashcardViewProps {
  flashcards: Flashcard[];
  isLoading?: boolean;
}

const FlashcardView: React.FC<FlashcardViewProps> = ({ 
  flashcards, 
  isLoading = false 
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  
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

  if (flashcards.length === 0) {
    return (
      <Card className="w-full h-60 flex items-center justify-center">
        <CardContent className="text-center p-6">
          <p className="text-muted-foreground">No flashcards available.</p>
        </CardContent>
      </Card>
    );
  }

  const currentFlashcard = flashcards[currentIndex];

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
  };

  return (
    <div className="w-full">
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
