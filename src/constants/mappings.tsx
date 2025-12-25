import React from 'react';
import {
  Calendar,
  CheckCircle,
  Clock,
  Lightning,
  WarningCircle,
} from 'phosphor-react';

// Cores utilitárias para ícones em cards
export const getIconColor = (color: string) => {
  const colors = {
    blue: 'bg-primary/10 text-primary',
    info: 'bg-info/10 text-info',
    success: 'bg-success/10 text-success',
    green: 'bg-success/10 text-success',
    warning: 'bg-warning/10 text-warning',
    yellow: 'bg-warning/10 text-warning',
    purple: 'bg-purple-100 text-purple-600',
    red: 'bg-red-100 text-red-600',
    gray: 'bg-gray-100 text-gray-600',
  } as const;
  return colors[(color as keyof typeof colors) || 'gray'] || colors.gray;
};

// Ícone por tipo de evento
export const getEventIcon = (tipo: string): React.ReactNode => {
  switch (tipo) {
    case 'social':
    case 'treino':
    case 'reuniao':
      return <Lightning className="w-5 h-5" />;
    default:
      return <Calendar className="w-5 h-5" />;
  }
};

// Cores por tipo de evento
export const getEventColor = (tipo: string): string => {
  switch (tipo) {
    case 'social':
      return 'text-purple-600 bg-purple-100';
    case 'treino':
      return 'text-blue-600 bg-blue-100';
    case 'reuniao':
      return 'text-orange-600 bg-orange-100';
    default:
      return 'text-gray-600 bg-gray-100';
  }
};

// Ícone por status de jogo
export const getStatusIcon = (status: string): React.ReactNode => {
  switch (status) {
    case 'agendado':
      return <Clock className="w-4 h-4" />;
    case 'finalizado':
      return <CheckCircle className="w-4 h-4" />;
    case 'cancelado':
      return <WarningCircle className="w-4 h-4" />;
    default:
      return <Calendar className="w-4 h-4" />;
  }
};


