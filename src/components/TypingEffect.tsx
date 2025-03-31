
import React, { useState, useEffect, useRef } from 'react';

interface TypingEffectProps {
  text: string;
  typingSpeed?: number;
  className?: string;
}

const TypingEffect: React.FC<TypingEffectProps> = ({
  text,
  typingSpeed = 30,
  className = '',
}) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setDisplayedText('');
    setCurrentIndex(0);
    setIsComplete(false);
  }, [text]);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timer = setTimeout(() => {
        setDisplayedText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
        
        // Auto-scroll to bottom when new text is added
        if (containerRef.current) {
          containerRef.current.scrollTop = containerRef.current.scrollHeight;
        }
      }, typingSpeed);
      
      return () => clearTimeout(timer);
    } else {
      setIsComplete(true);
    }
  }, [currentIndex, text, typingSpeed]);

  return (
    <div 
      ref={containerRef}
      className={`relative ${className}`}
    >
      <div className="whitespace-pre-wrap">{displayedText}</div>
      {!isComplete && <span className="typing-effect inline-block h-5 ml-0.5"></span>}
    </div>
  );
};

export default TypingEffect;