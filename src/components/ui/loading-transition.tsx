import React from 'react';
import { SpinnerGap, SoccerBall } from 'phosphor-react';

interface LoadingTransitionProps {
  text?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  variant?: 'default' | 'soccer' | 'minimal';
}

const LoadingTransition: React.FC<LoadingTransitionProps> = ({ 
  text = "Carregando...", 
  size = 'md',
  className = "",
  variant = 'default'
}) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  const textSizes = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  };

  const renderSpinner = () => {
    switch (variant) {
      case 'soccer':
        return (
          <div className="relative">
            <SoccerBall 
              className={`${sizeClasses[size]} text-blue-600 animate-bounce`} 
              weight="fill" 
            />
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full opacity-20 animate-pulse" />
          </div>
        );
      case 'minimal':
        return (
          <div className="flex space-x-1">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className={`w-2 h-2 bg-blue-600 rounded-full animate-bounce`}
                style={{
                  animationDelay: `${i * 0.1}s`,
                  animationDuration: '0.6s'
                }}
              />
            ))}
          </div>
        );
      default:
        return (
          <SpinnerGap 
            className={`${sizeClasses[size]} text-blue-600 animate-spin`} 
            weight="bold" 
          />
        );
    }
  };

  return (
    <div className={`flex flex-col items-center justify-center space-y-4 ${className}`}>
      <div className="relative">
        {renderSpinner()}
        {/* Efeito de brilho */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 animate-pulse rounded-full" />
      </div>
      
      {text && (
        <div className="text-center">
          <p className={`${textSizes[size]} text-slate-600 font-medium animate-pulse`}>
            {text}
          </p>
          {/* Pontos animados */}
          <div className="flex justify-center space-x-1 mt-2">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-1 h-1 bg-blue-400 rounded-full animate-pulse"
                style={{
                  animationDelay: `${i * 0.2}s`,
                  animationDuration: '1s'
                }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LoadingTransition; 