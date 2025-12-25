import React, { useState } from 'react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { 
  PencilSimple, 
  Trash, 
  Calendar,
  TrendUp,
  User
} from 'phosphor-react';
import { Jogador } from '../../types';
import { confirmAction } from '../../utils/toast-helpers';

interface PlayerCardProps {
  jogador: Jogador;
  onEdit?: (jogador: Jogador) => void;
  onDelete?: (jogador: Jogador) => void;
  showActions?: boolean;
}

const PlayerCard: React.FC<PlayerCardProps> = React.memo(({
  jogador,
  onEdit,
  onDelete,
  showActions = true
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const getPositionColor = (posicao: string) => {
    const colors = {
      'goleiro': 'bg-blue-100 text-blue-800',
      'zagueiro': 'bg-green-100 text-green-800',
      'lateral': 'bg-yellow-100 text-yellow-800',
      'meio-campo': 'bg-purple-100 text-purple-800',
      'atacante': 'bg-red-100 text-red-800'
    };
    return colors[posicao.toLowerCase() as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getPresencaColor = (percentual: number) => {
    if (percentual >= 90) return 'text-green-600';
    if (percentual >= 75) return 'text-yellow-600';
    return 'text-red-600';
  };

  const handleCardClick = () => {
    setIsModalOpen(true);
  };

  const handleEdit = () => {
    setIsModalOpen(false);
    onEdit?.(jogador);
  };

  const handleDelete = async () => {
    await confirmAction(
      `Tem certeza que deseja excluir ${jogador.nome}?`,
      () => {
        setIsModalOpen(false);
        onDelete?.(jogador);
      }
    );
  };

  return (
    <>
      <Card 
        className="bg-white/90 backdrop-blur-sm border-0 shadow-card md:hover:shadow-xl transition-all duration-300 cursor-pointer"
        onClick={handleCardClick}
      >
        <CardContent className="p-4">
          {/* Layout principal com nome e função na mesma linha */}
          <div className="flex items-center justify-between mb-3">
            {/* Avatar e Nome */}
            <div className="flex items-center space-x-4 flex-1 min-w-0">
              <Avatar className="w-12 h-12 border-2 border-white shadow-md flex-shrink-0">
                <AvatarImage src={jogador.foto} alt={jogador.nome} />
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold">
                  {jogador.nome.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              
              <h3 className="font-semibold text-gray-900 text-base truncate">
                {jogador.nome}
              </h3>
            </div>

            {/* Função na extrema direita */}
            <Badge className={`${getPositionColor(jogador.posicao)} flex-shrink-0 ml-4`}>
              {jogador.posicao}
            </Badge>
          </div>
          
          {/* Estatísticas */}
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <span className="flex items-center">
              <Calendar className="w-4 h-4 mr-1" />
              {jogador.jogosCompareceu}/{jogador.totalJogos} jogos
            </span>
            <span className={`flex items-center ${getPresencaColor(jogador.percentualPresenca)}`}>
              <TrendUp className="w-4 h-4 mr-1" />
              {jogador.percentualPresenca}% presença
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Modal com detalhes do jogador */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="w-[90vw] max-w-sm bg-white/95 backdrop-blur-sm border border-gray-200 shadow-xl rounded-xl">
          <DialogHeader className="relative">
            <DialogTitle className="text-center text-xl font-semibold text-gray-900">
              Detalhes do Jogador
            </DialogTitle>
            <DialogDescription className="text-center text-gray-600">
              Informações completas sobre {jogador.nome}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* Header com foto e informações básicas */}
            <div className="text-center space-y-4">
              <div className="relative">
                <Avatar className="w-24 h-24 border-4 border-white shadow-lg mx-auto">
                  <AvatarImage src={jogador.foto} alt={jogador.nome} />
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-2xl font-bold">
                    {jogador.nome.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                
                {/* Badge de posição sobreposto */}
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                  <Badge className={`${getPositionColor(jogador.posicao)} text-xs px-3 py-1 shadow-md`}>
                    {jogador.posicao}
                  </Badge>
                </div>
              </div>
              
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{jogador.nome}</h2>
              </div>
            </div>

            {/* Estatísticas detalhadas */}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <div className="flex items-center space-x-2 mb-2">
                    <User className="w-5 h-5 text-blue-600" />
                    <span className="text-sm font-medium text-gray-700">Idade</span>
                  </div>
                  <p className="text-xl font-semibold text-gray-900">{jogador.idade} anos</p>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <div className="flex items-center space-x-2 mb-2">
                    <Calendar className="w-5 h-5 text-green-600" />
                    <span className="text-sm font-medium text-gray-700">Jogos</span>
                  </div>
                  <p className="text-xl font-semibold text-gray-900">{jogador.jogosCompareceu}/{jogador.totalJogos}</p>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <div className="flex items-center space-x-2 mb-2">
                  <TrendUp className="w-5 h-5 text-orange-600" />
                  <span className="text-sm font-medium text-gray-700">Presença</span>
                </div>
                <p className={`text-xl font-semibold ${getPresencaColor(jogador.percentualPresenca)}`}>
                  {jogador.percentualPresenca}%
                </p>
              </div>

              {/* Espaço reservado para futuros destaques do jogador (ex: conquistas) */}
            </div>

            {/* Ações */}
            {showActions && (
              <div className="flex space-x-3 pt-6 border-t border-gray-200">
                <Button 
                  variant="outline" 
                  className="flex-1 h-11"
                  onClick={handleEdit}
                >
                  <PencilSimple className="w-4 h-4 mr-2" />
                  Editar
                </Button>
                <Button 
                  variant="destructive" 
                  className="flex-1 h-11"
                  onClick={handleDelete}
                >
                  <Trash className="w-4 h-4 mr-2" />
                  Excluir
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
});

PlayerCard.displayName = 'PlayerCard';

export default PlayerCard; 