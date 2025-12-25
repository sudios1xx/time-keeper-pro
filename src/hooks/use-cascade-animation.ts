import { useState, useEffect } from 'react';

interface UseCascadeAnimationProps {
  delay?: number;
  stagger?: number;
  duration?: number;
}

export const useCascadeAnimation = ({ 
  delay = 0, 
  stagger = 50, 
  duration = 300 
}: UseCascadeAnimationProps = {}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  const getAnimationStyle = (index: number) => ({
    animationDelay: `${delay + (index * stagger)}ms`,
    animationDuration: `${duration}ms`,
    animationFillMode: 'both' as const,
    animationName: isVisible ? 'slideInFromTop' : 'none',
    opacity: isVisible ? 1 : 0,
    transform: isVisible ? 'translateY(0)' : 'translateY(-20px)',
  });

  return { isVisible, getAnimationStyle };
}; 