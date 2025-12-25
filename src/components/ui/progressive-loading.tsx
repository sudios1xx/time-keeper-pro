import React from 'react';
import { motion } from 'framer-motion';
import { SoccerBall } from 'phosphor-react';

interface ProgressiveLoadingProps {
  currentStep: string;
  totalSteps: number;
  currentStepIndex: number;
  className?: string;
}

const ProgressiveLoading: React.FC<ProgressiveLoadingProps> = ({
  currentStep,
  totalSteps,
  currentStepIndex,
  className = ""
}) => {
  const progress = (currentStepIndex / totalSteps) * 100;

  const steps = [
    'Carregando estatísticas...',
    'Preparando filtros...',
    'Carregando jogadores...',
    'Finalizando...'
  ];

  return (
    <div className={`flex flex-col items-center justify-center space-y-6 ${className}`}>
      {/* Spinner animado */}
      <div className="relative">
        <SoccerBall 
          className="w-12 h-12 text-blue-600 animate-bounce" 
          weight="fill" 
        />
        <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full opacity-20 animate-pulse" />
      </div>

      {/* Barra de progresso */}
      <div className="w-64 bg-gray-200 rounded-full h-2 overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </div>

      {/* Texto do passo atual */}
      <div className="text-center space-y-2">
        <motion.p
          key={currentStep}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="text-slate-700 font-medium"
        >
          {currentStep}
        </motion.p>
        
        {/* Indicador de progresso */}
        <p className="text-sm text-slate-500">
          {currentStepIndex} de {totalSteps} etapas
        </p>
      </div>

      {/* Pontos animados */}
      <div className="flex space-x-2">
        {steps.map((_, index) => (
          <motion.div
            key={index}
            className={`w-2 h-2 rounded-full ${
              index <= currentStepIndex ? 'bg-blue-500' : 'bg-gray-300'
            }`}
            animate={{
              scale: index === currentStepIndex ? [1, 1.2, 1] : 1
            }}
            transition={{
              duration: 0.6,
              repeat: index === currentStepIndex ? Infinity : 0
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default ProgressiveLoading; 