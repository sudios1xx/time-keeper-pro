import React from 'react';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';

export interface JogoFormState {
  adversario: string;
  data: string;
  horario: string;
  local: string;
}

interface JogoFormProps {
  value: JogoFormState;
  onChange: (value: JogoFormState) => void;
}

const JogoForm: React.FC<JogoFormProps> = ({ value, onChange }) => {
  return (
    <div className="space-y-2 sm:space-y-3 md:space-y-4 lg:space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 md:gap-4">
        <div className="space-y-1 sm:space-y-2">
          <Label htmlFor="adversario" className="text-xs sm:text-sm font-semibold text-gray-700">
            Adversário
          </Label>
          <Input
            id="adversario"
            placeholder="Nome do time adversário"
            value={value.adversario}
            onChange={(e) => onChange({ ...value, adversario: e.target.value })}
            className="h-8 sm:h-9 md:h-10 lg:h-11 xl:h-12 text-xs sm:text-sm md:text-base border-gray-200 focus:border-purple-500 focus:ring-purple-500/20 transition-all duration-200"
          />
        </div>
        <div className="space-y-1 sm:space-y-2">
          <Label htmlFor="local" className="text-xs sm:text-sm font-semibold text-gray-700">
            Local
          </Label>
          <Input
            id="local"
            placeholder="Local do jogo"
            value={value.local}
            onChange={(e) => onChange({ ...value, local: e.target.value })}
            className="h-8 sm:h-9 md:h-10 lg:h-11 xl:h-12 text-xs sm:text-sm md:text-base border-gray-200 focus:border-purple-500 focus:ring-purple-500/20 transition-all duration-200"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 md:gap-4">
        <div className="space-y-1 sm:space-y-2">
          <Label htmlFor="data" className="text-xs sm:text-sm font-semibold text-gray-700">
            Data
          </Label>
          <Input
            id="data"
            type="date"
            value={value.data}
            onChange={(e) => onChange({ ...value, data: e.target.value })}
            className="h-8 sm:h-9 md:h-10 lg:h-11 xl:h-12 text-xs sm:text-sm md:text-base border-gray-200 focus:border-purple-500 focus:ring-purple-500/20 transition-all duration-200"
          />
        </div>
        <div className="space-y-1 sm:space-y-2">
          <Label htmlFor="horario" className="text-xs sm:text-sm font-semibold text-gray-700">
            Horário
          </Label>
          <Input
            id="horario"
            type="time"
            value={value.horario}
            onChange={(e) => onChange({ ...value, horario: e.target.value })}
            className="h-8 sm:h-9 md:h-10 lg:h-11 xl:h-12 text-xs sm:text-sm md:text-base border-gray-200 focus:border-purple-500 focus:ring-purple-500/20 transition-all duration-200"
          />
        </div>
      </div>
    </div>
  );
};

export default JogoForm;


