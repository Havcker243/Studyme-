
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Book, Home, Plus, BookOpen, Clock, Trash2 } from "lucide-react";
import { useFlashcardSets, FlashcardSet } from '@/hooks/use-flashcare-sets';
import { format } from "date-fns";
import { toast } from "sonner";
import { useIsMobile } from '@/hooks/use-mobile';

const FlashcardSets = () => {
  const { flashcardSets, deleteFlashcardSet } = useFlashcardSets();
  const isMobile = useIsMobile();
  const [sortBy, setSortBy] = useState<'date' | 'name'>('date');
  
  const sortedSets = [...flashcardSets].sort((a, b) => {
    if (sortBy === 'date') {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    } else {
      return a.title.localeCompare(b.title);
    }
  });

  const handleDeleteSet = (e: React.MouseEvent, set: FlashcardSet) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (window.confirm(`Are you sure you want to delete "${set.title}"?`)) {
      deleteFlashcardSet(set.id);
      toast.success('Flashcard set deleted successfully');
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
        </div>
      </header>

      <main className="flex-1 py-8 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">My Flashcard Sets</h1>
              <p className="text-muted-foreground">Review and manage your study materials</p>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" onClick={() => setSortBy('name')} 
                className={sortBy === 'name' ? 'bg-primary/10' : ''}>
                <Book className="h-4 w-4 mr-2" />
                Sort by Name
              </Button>
              <Button variant="outline" onClick={() => setSortBy('date')}
                className={sortBy === 'date' ? 'bg-primary/10' : ''}>
                <Clock className="h-4 w-4 mr-2" />
                Sort by Date
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedSets.map((set) => (
              <Link 
                to={`/flashcards/${set.id}`} 
                key={set.id}
                className="block transition-transform hover:-translate-y-1"
              >
                <Card className="h-full hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-start justify-between group">
                      <span className="line-clamp-1">{set.title}</span>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={(e) => handleDeleteSet(e, set)}
                      >
                        <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                      </Button>
                    </CardTitle>
                    <CardDescription className="line-clamp-2">{set.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <BookOpen className="h-4 w-4 mr-1" />
                      <span>{set.flashcards.length} flashcards</span>
                    </div>
                  </CardContent>
                  <CardFooter className="text-xs text-muted-foreground">
                    Created {format(new Date(set.createdAt), "MMM d, yyyy")}
                  </CardFooter>
                </Card>
              </Link>
            ))}
            
            <Card className="h-full border-dashed flex items-center justify-center">
              <CardContent className="flex flex-col items-center justify-center py-10">
                <Button variant="ghost" asChild className="flex flex-col h-auto p-6">
                  <Link to="/">
                    <Plus className="h-8 w-8 mb-2" />
                    <span className="text-lg font-medium">Create New Set</span>
                    <p className="text-sm text-muted-foreground mt-1">
                      Upload a document to generate flashcards
                    </p>
                  </Link>
                </Button>
              </CardContent>
            </Card>
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

export default FlashcardSets;