import React from 'react';
import { Card, CardContent } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { Button } from '../../ui/button';
import { Clock, MapPin, Users, PencilSimple, Trash, WarningCircle } from 'phosphor-react';
import { getEventColor, getEventIcon } from '../../../constants/mappings';
import { Evento } from '../../../types';

interface EventoCardProps {
  evento: Evento;
  index: number;
  onEdit: (evento: Evento) => void;
  onDelete: (evento: Evento) => void;
  onConfirmations: (evento: Evento) => void;
  onReminder?: (evento: Evento) => void;
}

const EventoCard: React.FC<EventoCardProps> = React.memo(({
  evento,
  index,
  onEdit,
  onDelete,
  onConfirmations,
  onReminder,
}) => {
  const confirmacoes = evento.presencas.filter(p => p.confirmou).length;
  const totalJogadores = evento.presencas.length;
  const percentualConfirmacoes = totalJogadores > 0 ? (confirmacoes / totalJogadores) * 100 : 0;
  const isPendente = new Date(evento.data) > new Date();

  return (
    <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-card md:hover:shadow-xl transition-all duration-300 animate-scale-in overflow-hidden" style={{ animationDelay: `${index * 50}ms` }}>
      <CardContent className="p-0">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-3 text-gray-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className={`p-1.5 bg-white/20 rounded-lg ${getEventColor(evento.tipo)}`}>
                {getEventIcon(evento.tipo)}
              </div>
              <div>
                <h3 className="text-lg font-bold">{evento.nome}</h3>
                <p className="text-gray-600 text-sm">
                  {new Date(evento.data).toLocaleDateString('pt-BR', {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long',
                  })}
                </p>
              </div>
            </div>
            <div className="flex flex-col items-center space-y-1">
              <div className="flex space-x-2">
                <Button variant="ghost" size="sm" className="p-1.5 h-7 w-7 hover:bg-blue-50" onClick={() => onEdit(evento)}>
                  <PencilSimple className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="p-1.5 h-7 w-7 text-red-600 hover:text-red-700 hover:bg-red-50"
                  onClick={() => onDelete(evento)}
                >
                  <Trash className="w-4 h-4" />
                </Button>
              </div>
              <Badge variant="secondary" className="bg-blue-100 text-blue-700 border-0">
                {evento.tipo}
              </Badge>
            </div>
          </div>
        </div>

        <div className="p-4 space-y-4">
          <p className="text-sm text-gray-600">{evento.descricao}</p>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="flex flex-col items-center space-y-1">
              <Clock className="w-5 h-5 text-blue-500" />
              <p className="text-sm font-medium text-gray-900">{evento.horario}</p>
              <p className="text-xs text-gray-500">Horário</p>
            </div>
            <div className="flex flex-col items-center space-y-1">
              <MapPin className="w-5 h-5 text-green-500" />
              <p className="text-sm font-medium text-gray-900 truncate w-full">{evento.local}</p>
              <p className="text-xs text-gray-500">Local</p>
            </div>
            <div className="flex flex-col items-center space-y-1">
              <Users className="w-5 h-5 text-indigo-500" />
              <p className="text-sm font-medium text-gray-900">
                {confirmacoes}/{totalJogadores}
              </p>
              <p className="text-xs text-gray-500">Confirmados</p>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Confirmações</span>
              <span className="text-gray-900 font-medium">{Math.round(percentualConfirmacoes)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${percentualConfirmacoes}%` }}
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="flex-1 hover:bg-blue-50 hover:border-blue-300"
              onClick={() => onConfirmations(evento)}
            >
              <Users className="w-4 h-4 mr-2" />
              Ver Confirmações
            </Button>
            {isPendente && onReminder && (
              <Button
                size="sm"
                className="flex-1 bg-orange-600 hover:bg-orange-700 shadow-md hover:shadow-lg transition-all duration-200"
                onClick={() => onReminder(evento)}
              >
                <WarningCircle className="w-4 h-4 mr-2" />
                Enviar Lembrete
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
});

EventoCard.displayName = 'EventoCard';

export default EventoCard;


