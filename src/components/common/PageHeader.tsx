import React from 'react';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';


interface StatCard {
  title: string;
  value: string | number;
  icon: React.ComponentType<{ className?: string; size?: string | number }>;
  color: string;
  description?: string | React.ReactNode;
}

interface PageHeaderProps {
  title: string;
  description?: string;
  stats?: StatCard[];
  actionButton?: {
    label: string;
    onClick: () => void;
    icon?: React.ComponentType<{ className?: string; size?: string | number }>;
  };
  breadcrumbs?: Array<{
    label: string;
    href?: string;
  }>;
}

const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  description,
  stats,
  actionButton,
  breadcrumbs
}) => {
  return (
    <div className="space-y-6">
      {/* Breadcrumbs */}
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav className="flex items-center space-x-2 text-sm text-muted-foreground">
          {breadcrumbs.map((crumb, index) => (
            <React.Fragment key={index}>
              {index > 0 && <span>/</span>}
              <span className={crumb.href ? 'hover:text-primary cursor-pointer' : ''}>
                {crumb.label}
              </span>
            </React.Fragment>
          ))}
        </nav>
      )}

      {/* Header Principal */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="text-center sm:text-left">
          <h1 className="text-2xl font-bold text-[#1E293B]">{title}</h1>
          {description && (
            <p className="text-sm text-[#1E293B]/70">{description}</p>
          )}
        </div>
        
        {actionButton && (
          <Button 
            onClick={actionButton.onClick}
            className="bg-gradient-to-r from-[#4C1D95] to-[#3B82F6] text-white shadow-lg hover:shadow-xl transition-all duration-300"
          >
            {actionButton.icon && <actionButton.icon className="w-4 h-4 mr-2" />}
            {actionButton.label}
          </Button>
        )}
      </div>

      {/* Estatísticas */}
      {stats && stats.length > 0 && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            const getIconBgColor = (color: string) => {
              const colors: Record<string, string> = {
                'blue': 'bg-[#3B82F6]/10 text-[#3B82F6]',
                'green': 'bg-[#22C55E]/10 text-[#22C55E]',
                'yellow': 'bg-[#F59E0B]/10 text-[#F59E0B]',
                'purple': 'bg-[#A855F7]/10 text-[#A855F7]',
                'red': 'bg-[#EF4444]/10 text-[#EF4444]',
                'warning': 'bg-[#F59E0B]/10 text-[#F59E0B]',
                'success': 'bg-[#22C55E]/10 text-[#22C55E]',
                'info': 'bg-[#3B82F6]/10 text-[#3B82F6]',
              };
              return colors[color] || 'bg-gray-100/50 text-gray-600';
            };
            return (
              <Card key={index} className="bg-gradient-to-br from-white to-gray-50/50 shadow-lg hover:shadow-xl border border-gray-100/50 hover:border-gray-200 transition-all duration-300 hover:scale-105 group">
                <CardContent className="p-3 sm:p-4 relative overflow-hidden">
                  <div className="flex items-center space-x-2 sm:space-x-3 relative z-10">
                    <div className={`p-1.5 sm:p-2 rounded-lg shadow-sm group-hover:shadow-md transition-all duration-300 ${getIconBgColor(stat.color)}`}>
                      <IconComponent className="w-4 h-4 sm:w-5 sm:h-5 group-hover:scale-110 transition-transform duration-300" />
                    </div>
                    <div>
                      <p className="text-lg sm:text-2xl font-bold text-[#1E293B]">{stat.value}</p>
                      <p className="text-xs text-[#1E293B]/70">{stat.title}</p>
                      {stat.description && (
                        <div className="text-xs text-gray-500 mt-1">{stat.description}</div>
                      )}
                    </div>
                  </div>
                  {/* Decoração de fundo */}
                  <div className="absolute top-0 right-0 w-16 h-16 opacity-5 group-hover:opacity-10 transition-opacity duration-300">
                    <IconComponent className="w-full h-full" />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default PageHeader; 