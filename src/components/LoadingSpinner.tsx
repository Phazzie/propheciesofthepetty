import React, { useEffect, useState, useCallback } from 'react';
import { Loader } from 'lucide-react';
import { SkeletonLoader } from './SkeletonLoader';

interface Props {
  size?: number;
  message?: string;
  center?: boolean;
  context?: 'reading' | 'auth' | 'profile' | 'general';
  variant?: 'spinner' | 'skeleton';
  skeletonProps?: {
    width?: string | number;
    height?: string | number;
    repeat?: number;
    animated?: boolean;
    className?: string;
  };
}

const contextMessages = {
  reading: [
    "Consulting the cosmic sass database...",
    "Channeling your inner drama...",
    "Brewing some celestial tea...",
    "Gathering the receipts from beyond...",
    "Calculating your shade level..."
  ],
  auth: [
    "Validating your cosmic credentials...",
    "Checking your astrological clearance...",
    "Consulting the stars about you...",
    "Verifying your karmic balance..."
  ],
  profile: [
    "Loading your spiritual receipts...",
    "Gathering your cosmic journey data...",
    "Calculating your shade progression...",
    "Analyzing your celestial drama metrics..."
  ],
  general: [
    "Still waiting... like that text you never replied to",
    "Loading at the speed of your last life-changing decision",
    "Taking a moment to process, much like your career trajectory",
    "Oh, you're still here? How wonderfully patient of you",
    "Manifesting your results with the same energy as your gym routine"
  ]
};

export const LoadingSpinner: React.FC<Props> = ({ 
  size = 24, 
  message, 
  center = true,
  context = 'general',
  variant = 'spinner',
  skeletonProps
}) => {
  const [messageIndex, setMessageIndex] = useState(0);
  const [currentMessage, setCurrentMessage] = useState(message || contextMessages[context][0]);

  const rotateMessage = useCallback(() => {
    const messages = contextMessages[context];
    setMessageIndex(prevIndex => {
      const nextIndex = (prevIndex + 1) % messages.length;
      setCurrentMessage(messages[nextIndex]);
      return nextIndex;
    });
  }, [context]);

  useEffect(() => {
    if (!message) {
      setMessageIndex(0);
      setCurrentMessage(contextMessages[context][0]);
      
      const interval = setInterval(rotateMessage, 3000);
      return () => clearInterval(interval);
    } else {
      setCurrentMessage(message);
    }
  }, [message, context, rotateMessage]);

  if (variant === 'skeleton') {
    return (
      <SkeletonLoader
        {...skeletonProps}
        className={`${skeletonProps?.className || ''} ${center ? 'mx-auto' : ''}`}
      />
    );
  }

  return (
    <div 
      className={`flex items-center ${center ? 'justify-center' : ''}`}
      role="status"
      aria-live="polite"
      data-testid="loading-spinner"
      data-context={context}
    ></div>
      <Loader 
        className="animate-spin text-purple-600" 
        style={{ width: size, height: size }}
        aria-hidden="true"
      />
      <span 
        className="ml-2 text-gray-600 italic"
        data-testid="loading-message"
      >
        {currentMessage}
      </span>
    </div>
  );
};