import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';

interface RateLimitState {
  messageCount: number;
  canSendMessage: boolean;
  resetTime: number | null;
}

export const useRateLimit = (maxMessages: number = 10, windowMs: number = 3600000) => {
  const { user } = useAuth();
  const [rateLimitState, setRateLimitState] = useState<RateLimitState>({
    messageCount: 0,
    canSendMessage: true,
    resetTime: null
  });

  useEffect(() => {
    if (!user) {
      // Reset rate limit state when user logs out
      setRateLimitState({
        messageCount: 0,
        canSendMessage: true,
        resetTime: null
      });
      return;
    }

    const checkRateLimit = () => {
      // Use user-specific keys for rate limiting
      const userKey = `messageCount_${user.uid}`;
      const timeKey = `rateLimitStartTime_${user.uid}`;
      
      const storedCount = parseInt(localStorage.getItem(userKey) || '0');
      const storedStartTime = parseInt(localStorage.getItem(timeKey) || '0');
      const currentTime = Date.now();

      // Only reset if the window has actually expired OR if there's no stored start time
      if (storedStartTime === 0 || (currentTime - storedStartTime > windowMs)) {
        // Reset the rate limit window
        localStorage.setItem(userKey, '0');
        localStorage.setItem(timeKey, currentTime.toString());
        setRateLimitState({
          messageCount: 0,
          canSendMessage: true,
          resetTime: null
        });
      } else {
        // Use existing rate limit data - don't reset the timer
        const canSend = storedCount < maxMessages;
        const resetTime = canSend ? null : storedStartTime + windowMs;
        setRateLimitState({
          messageCount: storedCount,
          canSendMessage: canSend,
          resetTime
        });
      }
    };

    checkRateLimit();
    const interval = setInterval(checkRateLimit, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [maxMessages, windowMs, user]);

  const incrementMessageCount = () => {
    if (!user) return;

    const userKey = `messageCount_${user.uid}`;
    const timeKey = `rateLimitStartTime_${user.uid}`;
    
    const newCount = rateLimitState.messageCount + 1;
    let startTime = localStorage.getItem(timeKey);
    
    // Only set start time if it doesn't exist
    if (!startTime) {
      startTime = Date.now().toString();
      localStorage.setItem(timeKey, startTime);
    }
    
    localStorage.setItem(userKey, newCount.toString());

    const canSend = newCount < maxMessages;
    const resetTime = canSend ? null : parseInt(startTime) + windowMs;

    setRateLimitState({
      messageCount: newCount,
      canSendMessage: canSend,
      resetTime
    });
  };

  const getTimeUntilReset = (): string => {
    if (!rateLimitState.resetTime) return '';
    
    const timeLeft = rateLimitState.resetTime - Date.now();
    if (timeLeft <= 0) return '';
    
    const minutes = Math.ceil(timeLeft / 60000);
    return `${minutes} minute${minutes !== 1 ? 's' : ''}`;
  };

  return {
    ...rateLimitState,
    incrementMessageCount,
    getTimeUntilReset
  };
};