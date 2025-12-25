import React, { useState } from 'react';
import { Input } from '../ui/input';
import { Card, CardContent } from '../ui/card';
import { MagnifyingGlass, CaretDown, Check } from 'phosphor-react';
import { Button } from '../ui/button';

interface FilterOption {
  value: string;
  label: string;
}

interface SortOption {
  value: string;
  label: string;
}

interface SearchFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  placeholder?: string;
  filters?: {
    label: string;
    value: string;
    options: FilterOption[];
    onChange: (value: string) => void;
  }[];
  sortOptions?: {
    value: string;
    options: SortOption[];
    onChange: (value: string) => void;
  };
  extraActions?: React.ReactNode;
}

// Componente de dropdown customizado
const CustomDropdown: React.FC<{
  label: string;
  value: string;
  options: FilterOption[];
  onChange: (value: string) => void;
}> = ({ label, value, options, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectedOption = options.find(option => option.value === value);

  return (
    <div className="relative">
      <Button
        variant="outline"
        onClick={() => setIsOpen(!isOpen)}
        className="h-10 px-4 py-2 bg-white/80 backdrop-blur-sm border-gray-200 hover:bg-white/90 hover:border-blue-300 focus:border-blue-500 focus:ring-blue-500 transition-all duration-200 flex items-center gap-2 min-w-[140px] justify-between"
      >
        <span className="text-sm font-medium text-gray-700 truncate">
          {selectedOption?.label || label}
        </span>
        <CaretDown 
          className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
        />
      </Button>
      
      {isOpen && (
        <>
          {/* Overlay para fechar ao clicar fora */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown */}
          <div className="absolute top-full left-0 mt-1 w-full bg-white rounded-lg shadow-xl border border-gray-200 z-50 py-1 min-w-[140px] overflow-hidden">
            {options.map((option) => (
              <button
                key={option.value}
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={`w-full px-4 py-2 text-left text-sm hover:bg-blue-50 transition-colors duration-150 flex items-center justify-between ${
                  option.value === value 
                    ? 'bg-blue-50 text-blue-700 font-medium' 
                    : 'text-gray-700'
                }`}
              >
                <span>{option.label}</span>
                {option.value === value && (
                  <Check className="w-4 h-4 text-blue-600 flex-shrink-0" />
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

const SearchFilters: React.FC<SearchFiltersProps> = ({
  searchTerm,
  onSearchChange,
  placeholder = "Buscar...",
  filters = [],
  sortOptions,
  extraActions
}) => {
  return (
    <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-card relative z-30">
      <CardContent className="p-4 sm:p-6">
        <div className="space-y-4">
          {/* Busca */}
          <div className="relative">
            <MagnifyingGlass className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder={placeholder}
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 bg-white/50 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          
          {/* Filtros e Controles */}
          <div className="flex flex-col gap-4 items-center">
            <div className="flex flex-wrap gap-2 justify-center">
              {filters.map((filter, index) => (
                <CustomDropdown
                  key={index}
                  label={filter.label}
                  value={filter.value}
                  options={filter.options}
                  onChange={filter.onChange}
                />
              ))}
              
              {sortOptions && (
                <CustomDropdown
                  label="Ordenar por"
                  value={sortOptions.value}
                  options={sortOptions.options}
                  onChange={sortOptions.onChange}
                />
              )}
            </div>
            
            {extraActions && (
              <div className="w-full">
                {extraActions}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SearchFilters; 