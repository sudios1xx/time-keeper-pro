import React from 'react';
import { Card, CardContent } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { Button } from '../../ui/button';
import { Clock, Lightning, MapPin, PencilSimple, Target, Trash, Users } from 'phosphor-react';
import { getStatusIcon } from '../../../constants/mappings';
import { Jogo } from '../../../types';
import { showToast } from '../../../utils/toast-helpers';

interface JogoCardProps {
  jogo: Jogo;
  index: number;
  onEdit: (jogo: Jogo) => void;
  onDelete: (jogo: Jogo) => void;
  onConfirmations: (jogo: Jogo) => void;
  onRegister: (jogo: Jogo) => void;
}

const JogoCard: React.FC<JogoCardProps> = React.memo(({
  jogo,
  index,
  onEdit,
  onDelete,
  onConfirmations,
  onRegister,
}) => {
  return (
    <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-card md:hover:shadow-xl transition-all duration-300 animate-scale-in overflow-hidden" style={{ animationDelay: `${index * 50}ms` }}>
      <CardContent className="p-0">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-3 text-gray-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="p-1.5 bg-white/20 rounded-lg">{getStatusIcon(jogo.status)}</div>
              <div>
                <h3 className="text-lg font-bold">vs {jogo.adversario}</h3>
                <p className="text-gray-600 text-sm">
                  {new Date(jogo.data).toLocaleDateString('pt-BR', {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long',
                  })}
                </p>
              </div>
            </div>
            <div className="flex flex-col items-center space-y-1">
              <div className="flex space-x-2">
                <Button variant="ghost" size="sm" className="p-1.5 h-7 w-7 hover:bg-blue-50" onClick={() => onEdit(jogo)}>
                  <PencilSimple className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="p-1.5 h-7 w-7 text-red-600 hover:text-red-700 hover:bg-red-50"
                  onClick={() => onDelete(jogo)}
                >
                  <Trash className="w-4 h-4" />
                </Button>
              </div>
              <Badge variant="secondary" className="bg-blue-100 text-blue-700 border-0">
                {jogo.status}
              </Badge>
            </div>
          </div>
        </div>

        <div className="p-4 space-y-4">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="flex flex-col items-center space-y-1">
              <Clock className="w-5 h-5 text-blue-500" />
              <p className="text-sm font-medium text-gray-900">{jogo.horario}</p>
              <p className="text-xs text-gray-500">Horário</p>
            </div>
            <div className="flex flex-col items-center space-y-1">
              <MapPin className="w-5 h-5 text-green-500" />
              <p className="text-sm font-medium text-gray-900 truncate w-full">{jogo.local}</p>
              <p className="text-xs text-gray-500">Local</p>
            </div>
            <div className="flex flex-col items-center space-y-1">
              <Users className="w-5 h-5 text-indigo-500" />
              <p className="text-sm font-medium text-gray-900">
                {jogo.presencas.filter(p => p.confirmou).length}/{jogo.presencas.length}
              </p>
              <p className="text-xs text-gray-500">Confirmados</p>
            </div>
          </div>

          {jogo.status === 'finalizado' && jogo.resultado && (
            <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-4 border border-green-200">
              <div className="text-center">
                <h4 className="font-semibold text-gray-900 mb-2">Resultado Final</h4>
                <div className="text-3xl font-bold">
                  <span
                    className={
                      jogo.resultado.gols > jogo.resultado.golsAdversario
                        ? 'text-green-600'
                        : jogo.resultado.gols < jogo.resultado.golsAdversario
                        ? 'text-red-600'
                        : 'text-yellow-600'
                    }
                  >
                    {jogo.resultado.gols} - {jogo.resultado.golsAdversario}
                  </span>
                </div>
              </div>
            </div>
          )}

          <div className="flex gap-2">
            {jogo.status === 'agendado' && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 hover:bg-blue-50 hover:border-blue-300"
                  onClick={() => onConfirmations(jogo)}
                >
                  <Users className="w-4 h-4 mr-2" />
                  Confirmações
                </Button>
                <Button
                  size="sm"
                  className="flex-1 bg-green-600 hover:bg-green-700 shadow-md hover:shadow-lg transition-all duration-200"
                  onClick={() => onRegister(jogo)}
                >
                  <Target className="w-4 h-4 mr-2" />
                  Registrar
                </Button>
              </>
            )}
            {jogo.status === 'finalizado' && (
              <Button
                variant="outline"
                size="sm"
                className="flex-1 hover:bg-purple-50 hover:border-purple-300"
                onClick={() => {
                  const resultado = jogo.resultado 
                    ? `${jogo.resultado.gols} - ${jogo.resultado.golsAdversario}`
                    : 'Não finalizado';
                  showToast.info(`Jogo vs ${jogo.adversario}: ${resultado}`);
                }}
              >
                <Lightning className="w-4 h-4 mr-2" />
                Ver Detalhes
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
});

JogoCard.displayName = 'JogoCard';

export default JogoCard;


