import React from 'react';
import { Button } from '../../ui/button';

interface FilterOption {
  value: string;
  label: string;
}

interface FilterPillsProps {
  options: FilterOption[];
  value: string;
  onChange: (value: string) => void;
}

const FilterPills: React.FC<FilterPillsProps> = ({ options, value, onChange }) => {
  return (
    <div className="flex flex-wrap gap-2 justify-center">
      {options.map((option) => (
        <Button
          key={option.value}
          variant={value === option.value ? 'default' : 'outline'}
          size="sm"
          onClick={() => onChange(option.value)}
          className={`text-xs sm:text-sm ${value === option.value ? 'shadow-glow' : ''}`}
        >
          {option.label}
        </Button>
      ))}
    </div>
  );
};

export default FilterPills;


