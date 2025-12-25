import React from 'react';
import { Card, CardContent } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { Button } from '../../ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '../../ui/avatar';
import { Calendar, CaretDown, ChatCircle, Eye, PencilSimple, ShareNetwork, ThumbsUp, Users } from 'phosphor-react';
import { Noticia } from '../../../types';

interface NoticiaCardProps {
  noticia: Noticia;
  index: number;
}

const formatarData = (data: string) => {
  const agora = new Date();
  const dataNoticia = new Date(data);
  const diferenca = agora.getTime() - dataNoticia.getTime();
  const dias = Math.floor(diferenca / (1000 * 60 * 60 * 24));
  if (dias === 0) return 'Hoje';
  if (dias === 1) return 'Ontem';
  if (dias < 7) return `${dias} dias atrás`;
  return dataNoticia.toLocaleDateString('pt-BR');
};

const NoticiaCardComponent: React.FC<NoticiaCardProps> = ({ noticia, index }) => {
  return (
    <Card
      className="bg-white rounded-xl border sm:shadow-card shadow-none card-hover animate-scale-in overflow-hidden"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <CardContent className="p-0">
        <div className="p-4 sm:p-6 space-y-4">
          <div className="flex flex-col sm:flex-row items-start justify-between gap-4 sm:gap-0">
            <div className="flex items-start space-x-3 sm:space-x-4 flex-1">
              <Avatar className="w-10 h-10 sm:w-12 sm:h-12 border-2 border-primary/20">
                <AvatarImage src={noticia.autorFoto} alt={noticia.autorNome} />
                <AvatarFallback>
                  {noticia.autorNome
                    .split(' ')
                    .map((n: string) => n[0])
                    .join('')}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-2 flex-1">
                <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                  <h3 className="text-lg sm:text-xl font-bold line-clamp-2">{noticia.titulo}</h3>
                  {noticia.destaque && (
                    <Badge className="gradient-warning text-white shadow-glow">Destaque</Badge>
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-muted-foreground">
                  <span className="flex items-center">
                    <Users className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                    {noticia.autorNome}
                  </span>
                  <span className="flex items-center">
                    <Calendar className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                    {formatarData(noticia.dataPublicacao)}
                  </span>
                  <Badge variant="outline" className="text-xs">
                    {noticia.categoria}
                  </Badge>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2 self-end sm:self-start">
              <Button variant="ghost" size="sm">
                <PencilSimple className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                <ShareNetwork className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-muted-foreground leading-relaxed line-clamp-3">{noticia.conteudo}</p>
            {noticia.imagem && (
              <div className="relative rounded-lg overflow-hidden bg-accent/30 h-48">
                <img src={noticia.imagem} alt={noticia.titulo} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-4 border-t border-border">
            <div className="flex items-center gap-4 sm:gap-6 text-xs sm:text-sm text-muted-foreground">
              <div className="flex items-center space-x-1">
                <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                <span>{noticia.visualizacoes.toLocaleString()}</span>
              </div>
              <div className="flex items-center space-x-1">
                <ThumbsUp className="w-3 h-3 sm:w-4 sm:h-4" />
                <span>{noticia.likes}</span>
              </div>
              <div className="flex items-center space-x-1">
                <ChatCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                <span>{noticia.comentarios}</span>
              </div>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Button variant="outline" size="sm" className="flex-1 sm:flex-none justify-center">
                <Eye className="w-4 h-4 mr-2" />
                Visualizar
              </Button>
              <Button variant="outline" size="sm" className="flex-1 sm:flex-none justify-center">
                <ShareNetwork className="w-4 h-4 mr-2" />
                Compartilhar
              </Button>
            </div>
          </div>

          <div className="bg-accent/20 rounded-lg p-3 sm:p-4">
            <h4 className="font-semibold text-xs sm:text-sm mb-3 flex items-center">
              <CaretDown className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 text-primary" />
              Engajamento
            </h4>
            <div className="grid grid-cols-3 gap-2 sm:gap-4 text-center">
              <div className="p-2 rounded-md hover:bg-accent/30 transition-colors">
                <p className="text-base sm:text-lg font-bold text-primary">{noticia.visualizacoes}</p>
                <p className="text-xs text-muted-foreground">Visualizações</p>
              </div>
              <div className="p-2 rounded-md hover:bg-accent/30 transition-colors">
                <p className="text-base sm:text-lg font-bold text-success">{noticia.likes}</p>
                <p className="text-xs text-muted-foreground">Curtidas</p>
              </div>
              <div className="p-2 rounded-md hover:bg-accent/30 transition-colors">
                <p className="text-base sm:text-lg font-bold text-info">{noticia.comentarios}</p>
                <p className="text-xs text-muted-foreground">Comentários</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const NoticiaCard = React.memo(NoticiaCardComponent);

NoticiaCard.displayName = 'NoticiaCard';

export default NoticiaCard;


