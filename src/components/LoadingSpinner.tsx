import React, { useEffect, useState } from 'react';
import { Loader } from 'lucide-react';

interface Props {
  size?: number;
  message?: string;
  center?: boolean;
  context?: 'reading' | 'auth' | 'profile' | 'general';
}

const contextMessages = {
  reading: [
    "Consulting the cosmic sass database...",
    "Channeling your inner drama...",
    "Brewing some celestial tea...",
    "Gathering the receipts from beyond...",
    "Calculating your shade level...",
  ],
  auth: [
    "Validating your cosmic credentials...",
    "Checking your astrological clearance...",
    "Consulting the stars about you...",
    "Verifying your karmic balance...",
  ],
  profile: [
    "Loading your spiritual receipts...",
    "Gathering your cosmic journey data...",
    "Calculating your shade progression...",
    "Analyzing your celestial drama metrics...",
  ],
  general: [
    "Still waiting... like that text you never replied to",
    "Loading at the speed of your last life-changing decision",
    "Taking a moment to process, much like your career trajectory",
    "Oh, you're still here? How wonderfully patient of you",
  ]
};

export const LoadingSpinner: React.FC<Props> = ({ 
  size = 24, 
  message, 
  center = true,
  context = 'general'
}) => {
  const [messageIndex, setMessageIndex] = useState(0);
  const [currentMessage, setCurrentMessage] = useState(message || contextMessages[context][0]);

  useEffect(() => {
    if (!message) {
      const messages = contextMessages[context];
      setMessageIndex(0);
      
      const interval = setInterval(() => {
        setMessageIndex(prevIndex => {
          const nextIndex = (prevIndex + 1) % messages.length;
          setCurrentMessage(messages[nextIndex]);
          return nextIndex;
        });
      }, 3000);

      return () => clearInterval(interval);
    } else {
      setCurrentMessage(message);
    }
  }, [message, context]);

  return (
    <div 
      className={`flex items-center ${center ? 'justify-center' : ''}`}
      role="status"
      aria-live="polite"
      data-testid="loading-spinner"
      data-context={context}
    >
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