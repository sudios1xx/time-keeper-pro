import React from 'react';

export interface BetaFormData {
  nome: string;
  email: string;
  telefone?: string;
  timeClube: string;
}

export interface Feature {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string; size?: string | number }>;
}

