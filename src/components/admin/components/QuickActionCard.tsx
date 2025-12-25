import React from 'react';
import { Card, CardContent } from '../../ui/card';

interface QuickActionCardProps {
  title: string;
  subtitle?: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  bgClassName: string; // classes de fundo do ícone
  onClick?: () => void;
  disabled?: boolean;
}

const QuickActionCard: React.FC<QuickActionCardProps> = ({
  title,
  subtitle,
  icon: Icon,
  bgClassName,
  onClick,
  disabled = false,
}) => {
  const baseCardClasses = disabled
    ? 'bg-gray-100/50 shadow-md border border-gray-200/50 transition-all duration-300 group cursor-not-allowed opacity-60'
    : 'bg-gradient-to-br from-white to-gray-50/50 shadow-lg hover:shadow-xl border border-gray-100/50 hover:border-gray-200 transition-all duration-300 hover:scale-105 group cursor-pointer';

  return (
    <Card className={baseCardClasses} onClick={disabled ? undefined : onClick}>
      <CardContent className="p-3 sm:p-4 relative overflow-hidden">
        {!disabled && (
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
        )}
        <div className="flex items-center space-x-2 sm:space-x-3 relative z-10">
          <div className={`p-1.5 sm:p-2 rounded-lg shadow-sm group-hover:shadow-md transition-all duration-300 ${bgClassName}`}>
            <Icon className="w-4 h-4 sm:w-5 sm:h-5 group-hover:scale-110 transition-transform duration-300" />
          </div>
          <div>
            <p className="text-lg sm:text-2xl font-bold text-[#1E293B] group-hover:text-[#4C1D95] transition-colors duration-300">{title}</p>
            {subtitle && (
              <p className="text-xs text-[#1E293B]/70 group-hover:text-[#1E293B] transition-colors duration-300">{subtitle}</p>
            )}
          </div>
        </div>
        <div className="absolute top-0 right-0 w-16 h-16 opacity-5 group-hover:opacity-10 transition-opacity duration-300">
          <Icon className="w-full h-full" />
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickActionCard;


