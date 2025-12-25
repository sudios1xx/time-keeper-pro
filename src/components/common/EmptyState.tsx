import React from 'react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { MagnifyingGlass, Plus, Users } from 'phosphor-react';

interface EmptyStateProps {
  icon?: React.ComponentType<{ className?: string; size?: string | number }>;
  title: string;
  description: string;
  actionButton?: {
    label: string;
    onClick: () => void;
    icon?: React.ComponentType<{ className?: string; size?: string | number }>;
  };
  suggestions?: string[];
  type?: 'search' | 'create' | 'default';
}

const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionButton,
  suggestions = [],
  type = 'default'
}) => {
  const getDefaultIcon = () => {
    switch (type) {
      case 'search':
        return MagnifyingGlass;
      case 'create':
        return Plus;
      default:
        return Users;
    }
  };

  const IconComponent = icon || getDefaultIcon();

  return (
    <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
      <CardContent className="p-12 text-center">
        <div className="space-y-4">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
            <IconComponent className="w-8 h-8 text-gray-400" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{title}</h3>
            <p className="text-gray-600 mt-1">{description}</p>
          </div>
          
          {actionButton && (
            <Button 
              onClick={actionButton.onClick}
              className="gradient-primary shadow-lg hover:shadow-xl transition-all duration-300"
            >
              {actionButton.icon && <actionButton.icon className="w-4 h-4 mr-2" />}
              {actionButton.label}
            </Button>
          )}
          
          {suggestions.length > 0 && (
            <div className="mt-6">
              <p className="text-sm text-gray-500 mb-3">Sugestões:</p>
              <ul className="space-y-1 text-sm text-gray-600">
                {suggestions.map((suggestion, index) => (
                  <li key={index} className="flex items-center justify-center">
                    <span className="w-1.5 h-1.5 bg-primary rounded-full mr-2" />
                    {suggestion}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default EmptyState; 