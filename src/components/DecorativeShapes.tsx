
import React from 'react';

interface DecorativeShapesProps {
  className?: string;
  variant?: 'corner' | 'scattered' | 'minimal';
}

const DecorativeShapes: React.FC<DecorativeShapesProps> = ({
  className = '',
  variant = 'scattered'
}) => {
  if (variant === 'corner') {
    return (
      <div className={`absolute pointer-events-none ${className}`}>
        <div className="absolute top-12 right-12 w-24 h-24 bg-primary/10 rounded-full blur-xl" />
        <div className="absolute top-4 right-24 w-16 h-16 bg-study-400/20 rounded-full animate-float" />
        <div className="absolute top-20 right-16 w-12 h-12 bg-primary/30 rounded-xl rotate-12 animate-float" style={{ animationDelay: '1s' }} />
      </div>
    );
  }
  
  if (variant === 'minimal') {
    return (
      <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
        <div className="absolute -top-16 -right-16 w-64 h-64 bg-primary/5 rounded-full blur-xl" />
        <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-primary/5 to-transparent" />
      </div>
    );
  }

  // Default: scattered
  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      <div className="absolute top-1/4 left-8 w-12 h-12 bg-study-300/30 rounded-full animate-float" />
      <div className="absolute top-1/3 right-12 w-20 h-20 bg-primary/20 rounded-full blur-md animate-float" style={{ animationDelay: '0.5s' }} />
      <div className="absolute bottom-1/4 left-1/4 w-16 h-16 bg-study-500/20 rounded-lg rotate-45 animate-float" style={{ animationDelay: '1s' }} />
      <div className="absolute top-1/2 right-1/3 w-10 h-10 bg-study-400/15 rounded-lg -rotate-12 animate-float" style={{ animationDelay: '1.5s' }} />
      <div className="absolute bottom-16 right-16 w-14 h-14 bg-primary/10 rounded-full blur-sm animate-float" style={{ animationDelay: '2s' }} />
    </div>
  );
};

export default DecorativeShapes;