import React from 'react';
import { Card, CardContent } from '../../ui/card';
import { Badge } from '../../ui/badge';

interface UpcomingItemCardProps {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  title: string;
  dateText: string;
  statusLabel: string;
  statusClassName: string;
  iconGradientClassName: string; // ex: from-[#4C1D95] to-[#3B82F6]
}

const UpcomingItemCard: React.FC<UpcomingItemCardProps> = ({
  icon: Icon,
  title,
  dateText,
  statusLabel,
  statusClassName,
  iconGradientClassName,
}) => {
  return (
    <Card className="bg-white rounded-xl shadow-card p-3 w-full">
      <CardContent className="p-0">
        <div className="flex items-center gap-4">
          <div className="flex-shrink-0">
            <div className={`w-12 h-12 bg-gradient-to-br ${iconGradientClassName} rounded-xl flex items-center justify-center`}>
              <Icon className="w-6 h-6 text-white" />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-[#1E293B] text-base">{title}</span>
              <Badge className={statusClassName}>{statusLabel}</Badge>
            </div>
            <div className="flex items-center gap-1 text-sm text-[#1E293B]/70">
              <span>📅</span>
              <span>{dateText}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UpcomingItemCard;


