import React, { useEffect, useState } from 'react';
import { Loader } from 'lucide-react';

interface Props {
  size?: number;
  message?: string;
  center?: boolean;
}

const shadeMessages = [
  "Still waiting... like that text you never replied to",
  "Loading at the speed of your last life-changing decision",
  "Taking a moment to process, much like your career trajectory",
  "Oh, you're still here? How wonderfully patient of you",
  "Manifesting your results with the same energy as your gym routine",
  "Processing with the depth of your dating history",
  "Loading... almost as long as your self-improvement phase",
  "Taking its time, like your journey to emotional maturity",
  "This might take a while, but not as long as your 'temporary' phase",
  "Just breathe... like you do when someone mentions their achievements"
];

export const LoadingSpinner: React.FC<Props> = ({ 
  size = 24, 
  message, 
  center = true 
}) => {
  const [messageIndex, setMessageIndex] = useState(0);
  const [currentMessage, setCurrentMessage] = useState(message || shadeMessages[0]);

  useEffect(() => {
    if (!message) {
      setMessageIndex(0);
      
      const interval = setInterval(() => {
        setMessageIndex(prevIndex => {
          const nextIndex = (prevIndex + 1) % shadeMessages.length;
          setCurrentMessage(shadeMessages[nextIndex]);
          return nextIndex;
        });
      }, 2000);

      return () => clearInterval(interval);
    } else {
      setCurrentMessage(message);
    }
  }, [message]);

  return (
    <div 
      className={`flex items-center ${center ? 'justify-center' : ''}`}
      role="status"
      aria-live="polite"
      data-testid="loading-spinner"
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