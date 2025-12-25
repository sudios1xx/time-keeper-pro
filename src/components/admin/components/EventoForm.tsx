import React from 'react';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';

export interface EventoFormState {
  nome: string;
  descricao: string;
  data: string;
  horario: string;
  local: string;
  tipo: 'social' | 'treino' | 'reuniao';
}

interface EventoFormProps {
  value: EventoFormState;
  onChange: (value: EventoFormState) => void;
}

const EventoForm: React.FC<EventoFormProps> = ({ value, onChange }) => {
  return (
    <div className="space-y-2 sm:space-y-3 md:space-y-4">
      <div className="space-y-2 sm:space-y-3 md:space-y-4">
        <div className="space-y-1 sm:space-y-2">
          <Label htmlFor="nome" className="text-xs sm:text-sm font-semibold text-gray-700">
            Nome do Evento
          </Label>
          <Input
            id="nome"
            placeholder="Nome do evento"
            value={value.nome}
            onChange={(e) => onChange({ ...value, nome: e.target.value })}
            className="h-8 sm:h-9 md:h-10 lg:h-11 xl:h-12 text-xs sm:text-sm md:text-base border-gray-200 focus:border-purple-500 focus:ring-purple-500/20 transition-all duration-200"
          />
        </div>
        <div className="space-y-1 sm:space-y-2">
          <Label htmlFor="descricao" className="text-xs sm:text-sm font-semibold text-gray-700">
            Descrição
          </Label>
          <Input
            id="descricao"
            placeholder="Descrição do evento (opcional)"
            value={value.descricao}
            onChange={(e) => onChange({ ...value, descricao: e.target.value })}
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

      <div className="space-y-1 sm:space-y-2">
        <Label htmlFor="local" className="text-xs sm:text-sm font-semibold text-gray-700">
          Local
        </Label>
        <Input
          id="local"
          placeholder="Local do evento"
          value={value.local}
          onChange={(e) => onChange({ ...value, local: e.target.value })}
          className="h-8 sm:h-9 md:h-10 lg:h-11 xl:h-12 text-xs sm:text-sm md:text-base border-gray-200 focus:border-purple-500 focus:ring-purple-500/20 transition-all duration-200"
        />
      </div>

      <div className="space-y-1 sm:space-y-2">
        <Label htmlFor="tipo" className="text-xs sm:text-sm font-semibold text-gray-700">
          Tipo de Evento
        </Label>
        <select
          id="tipo"
          value={value.tipo}
          onChange={(e) => onChange({ ...value, tipo: e.target.value as EventoFormState['tipo'] })}
          className="w-full h-8 sm:h-9 md:h-10 lg:h-11 xl:h-12 text-xs sm:text-sm md:text-base px-2 sm:px-3 py-1 sm:py-2 border border-gray-200 rounded-md focus:border-purple-500 focus:ring-purple-500/20 transition-all duration-200"
        >
          <option value="social">Social</option>
          <option value="treino">Treino</option>
          <option value="reuniao">Reunião</option>
        </select>
      </div>
    </div>
  );
};

export default EventoForm;


