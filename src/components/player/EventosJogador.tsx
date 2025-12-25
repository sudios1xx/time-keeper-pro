// Visualização de eventos para jogadores
import React, { useEffect, useMemo, useState } from 'react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { 
  Calendar, 
  WarningCircle,
  Heart,
  Clock,
  MapPin, 
  Users,
  CheckCircle,
  XCircle,
  Lightning,
  Coffee,
  Target
} from 'phosphor-react';
import { logger } from '../../utils/logger';
import PageHeader from '../common/PageHeader';
import { data } from '../../services/data';
import type { Evento, Jogador } from '../../types';

const EventosJogador: React.FC = () => {

  const [filterType, setFilterType] = useState('todos');
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [jogadorData, setJogadorData] = useState<Jogador | null>(null);
  
  useEffect(() => {
    let active = true;
    (async () => {
      const [players, events] = await Promise.all([data.getPlayers(), data.getEvents()]);
      if (!active) return;
      setJogadorData(players[0] || null);
      setEventos(events);
    })();
    return () => { active = false; };
  }, []);
  
  const tiposEventos = [
    { value: 'todos', label: 'Todos', icon: Calendar },
    { value: 'social', label: 'Sociais', icon: Lightning },
    { value: 'treino', label: 'Treinos', icon: Target },
    { value: 'reuniao', label: 'Reuniões', icon: Coffee }
  ];

  const eventosFiltrados = useMemo(() => eventos.filter(evento => 
    filterType === 'todos' || evento.tipo === filterType
  ), [eventos, filterType]);

  const estatisticas = useMemo(() => {
    const totalEventos = eventos.length || 1;
    const eventosConfirmados = jogadorData
      ? eventos.filter(e => e.presencas.find(p => p.jogadorId === jogadorData.id)?.confirmou).length
      : 0;
    const proximosEventos = eventos.filter(e => new Date(e.data) > new Date()).length;
    const minhaPresenca = Math.round((eventosConfirmados / totalEventos) * 100);
    return { totalEventos: eventos.length, eventosConfirmados, proximosEventos, minhaPresenca };
  }, [eventos, jogadorData]);

  const stats = [
    { title: 'Total', value: estatisticas.totalEventos, icon: Calendar, color: 'blue' },
    { title: 'Confirmados', value: estatisticas.eventosConfirmados, icon: CheckCircle, color: 'success' },
    { title: 'Próximos', value: estatisticas.proximosEventos, icon: WarningCircle, color: 'info' },
    { title: 'Minha Presença', value: `${estatisticas.minhaPresenca}%`, icon: Heart, color: 'warning' },
  ];

  const confirmarPresenca = (eventoId: string, confirmar: boolean) => {
    // Em uma aplicação real, isso seria uma chamada para API
    logger.log(`${confirmar ? 'Confirmando' : 'Cancelando'} presença no evento ${eventoId}`);
  };

  const getEventIcon = (tipo: string) => {
    switch (tipo) {
      case 'social': return <Lightning className="w-6 h-6" />;
      case 'treino': return <Target className="w-6 h-6" />;
      case 'reuniao': return <Coffee className="w-6 h-6" />;
      default: return <Calendar className="w-6 h-6" />;
    }
  };

  const getEventColor = (tipo: string) => {
    switch (tipo) {
      case 'social': return 'text-purple-600 bg-purple-100';
      case 'treino': return 'text-blue-600 bg-blue-100';
      case 'reuniao': return 'text-orange-600 bg-orange-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const isEventoProximo = (data: string) => new Date(data) > new Date();

  const formatarData = (data: string) => {
    const hoje = new Date();
    const dataEvento = new Date(data);
    const diferenca = dataEvento.getTime() - hoje.getTime();
    const dias = Math.ceil(diferenca / (1000 * 60 * 60 * 24));
    
    if (dias === 0) return 'Hoje';
    if (dias === 1) return 'Amanhã';
    if (dias > 0 && dias <= 7) return `Em ${dias} dias`;
    if (dias < 0) {
      const diasPassados = Math.abs(dias);
      if (diasPassados === 1) return 'Ontem';
      if (diasPassados <= 7) return `${diasPassados} dias atrás`;
    }
    return dataEvento.toLocaleDateString('pt-BR');
  };

  return (
    <div className="space-y-3 sm:space-y-6 animate-fade-in px-1">
      <PageHeader
        title="Meus Eventos"
        description="Acompanhe os eventos do time e confirme sua presença"
        stats={stats}
      />

      {/* Filtros */}
      <Card className="shadow-card">
        <CardContent className="p-3 sm:p-6">
          <div className="flex flex-wrap gap-2 justify-center">
            {tiposEventos.map(tipo => {
              const IconComponent = tipo.icon;
              return (
                <Button
                  key={tipo.value}
                  variant={filterType === tipo.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilterType(tipo.value)}
                  className={`${filterType === tipo.value ? "shadow-glow" : ""} flex items-center gap-2`}
                >
                  <IconComponent className="w-4 h-4" />
                  {tipo.label}
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Lista de Eventos */}
      <div className="grid gap-2 sm:gap-4">
        {eventosFiltrados.map((evento, index) => {
          const minhaPresenca = jogadorData ? evento.presencas.find(p => p.jogadorId === jogadorData.id) : undefined;
          const confirmei = minhaPresenca?.confirmou;
          const isProximo = isEventoProximo(evento.data);
          const confirmacoes = evento.presencas.filter(p => p.confirmou).length;
          const totalJogadores = evento.presencas.length;
          const percentualConfirmacoes = (confirmacoes / totalJogadores) * 100;

          return (
            <Card key={evento.id} className="card-hover shadow-card">
              <CardContent className="p-3 sm:p-6">
                <div className="space-y-4">
                  {/* Header do Evento */}
                  <div className="flex flex-col sm:flex-row items-start justify-between gap-3 sm:gap-0">
                    <div className="flex items-start space-x-3 sm:space-x-4">
                      <div className="relative">
                        <div className={`p-2 sm:p-3 rounded-xl ${getEventColor(evento.tipo)} shadow-card`}>
                          {getEventIcon(evento.tipo)}
                        </div>
                        {isProximo && (
                          <div className="absolute -top-1 -right-1 w-2 sm:w-3 h-2 sm:h-3 bg-success rounded-full animate-pulse-glow"></div>
                        )}
                      </div>
                      <div className="space-y-2 flex-1">
                        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                          <h3 className="text-base sm:text-lg md:text-xl font-bold">{evento.nome}</h3>
                          <Badge variant="outline" className="text-xs capitalize">
                            {evento.tipo}
                          </Badge>
                          {isProximo && (
                            <Badge className="text-xs bg-green-50 text-green-700 border-green-200">
                              {formatarData(evento.data)}
                            </Badge>
                          )}
                        </div>
                        
                        <p className="text-sm text-muted-foreground">{evento.descricao}</p>
                        
                        <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-muted-foreground">
                          <span className="flex items-center">
                            <Calendar className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                            {new Date(evento.data).toLocaleDateString('pt-BR')}
                          </span>
                          <span className="flex items-center">
                            <Clock className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                            {evento.horario}
                          </span>
                          {evento.local && (
                            <span className="flex items-center">
                              <MapPin className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                              {evento.local}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="self-end sm:self-start">
                      <Badge variant={confirmei ? "default" : "secondary"} className="flex items-center gap-1 text-xs">
                        {confirmei ? (
                          <CheckCircle className="w-3 h-3" />
                        ) : (
                          <XCircle className="w-3 h-3" />
                        )}
                        {confirmei ? 'Confirmado' : 'Pendente'}
                      </Badge>
                    </div>
                  </div>

                  {/* Estatísticas de Participação */}
                  <div className="bg-accent/30 rounded-lg p-3 sm:p-4">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0 mb-3">
                      <h4 className="text-sm sm:text-base font-semibold flex items-center">
                        <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                        Participação do Time
                      </h4>
                      <span className="text-xs sm:text-sm font-medium">
                        {confirmacoes}/{totalJogadores} confirmados ({Math.round(percentualConfirmacoes)}%)
                      </span>
                    </div>
                    
                    <div className="w-full bg-secondary rounded-full h-2 sm:h-3 mb-3">
                      <div 
                        className="bg-gradient-primary h-2 sm:h-3 rounded-full transition-all duration-500 shadow-glow"
                        style={{ width: `${percentualConfirmacoes}%` }}
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-2 sm:gap-4 text-center text-xs sm:text-sm">
                      <div className="hover:bg-accent/30 rounded-md p-1.5 transition-colors cursor-pointer">
                        <p className="font-medium text-success">{confirmacoes}</p>
                        <p className="text-[10px] sm:text-xs text-muted-foreground">Confirmados</p>
                      </div>
                      <div className="hover:bg-accent/30 rounded-md p-1.5 transition-colors cursor-pointer">
                        <p className="font-medium text-warning">{totalJogadores - confirmacoes}</p>
                        <p className="text-[10px] sm:text-xs text-muted-foreground">Pendentes</p>
                      </div>
                      <div className="hover:bg-accent/30 rounded-md p-1.5 transition-colors cursor-pointer">
                        <Badge variant={percentualConfirmacoes >= 80 ? "default" : percentualConfirmacoes >= 60 ? "secondary" : "destructive"} className="text-xs">
                          {percentualConfirmacoes >= 80 ? 'Excelente' : percentualConfirmacoes >= 60 ? 'Bom' : 'Baixo'}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {/* Ações */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-2 border-t border-border">
                    <div className="text-xs sm:text-sm text-muted-foreground">
                      {confirmei 
                        ? `Você confirmou presença neste ${evento.tipo}` 
                        : `Confirme sua presença para este ${evento.tipo}`
                      }
                    </div>

                    <div className="flex space-x-2 self-end sm:self-auto mt-2 sm:mt-0">
                      {confirmei ? (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => confirmarPresenca(evento.id, false)}
                          className="text-destructive hover:text-destructive text-xs sm:text-sm"
                        >
                          <XCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
                          Cancelar
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          onClick={() => confirmarPresenca(evento.id, true)}
                          className="gradient-success shadow-glow text-xs sm:text-sm"
                        >
                          <CheckCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
                          Confirmar Presença
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {eventosFiltrados.length === 0 && (
        <Card className="shadow-card">
          <CardContent className="p-6 sm:p-8 md:p-12 text-center">
            <div className="space-y-3 sm:space-y-4">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-muted rounded-full flex items-center justify-center mx-auto">
                <Lightning className="w-6 h-6 sm:w-8 sm:h-8 text-muted-foreground" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-semibold">Nenhum evento encontrado</h3>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                  {filterType === 'todos' 
                    ? 'Não há eventos registrados no momento'
                    : `Nenhum evento do tipo "${filterType}" encontrado`
                  }
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default EventosJogador;