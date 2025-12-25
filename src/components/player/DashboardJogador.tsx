// Dashboard do Jogador
import React, { useEffect, useMemo, useState } from 'react';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { 
  SoccerBall, 
  Trophy,
  TrendUp,
  Medal,
  Star,
  Calendar
} from 'phosphor-react';
import { useNavigation } from '../../hooks/use-navigation';
import PageHeader from '../common/PageHeader';
import UpcomingItemCard from '../admin/components/UpcomingItemCard';
import { data } from '../../services/data';
import type { Evento, Jogo, Jogador } from '../../types';

const DashboardJogador: React.FC = () => {
  const { navigateTo } = useNavigation();
  
  const [jogadorData, setJogadorData] = useState<Jogador | null>(null);
  const [jogos, setJogos] = useState<Jogo[]>([]);
  const [eventos, setEventos] = useState<Evento[]>([]);

  useEffect(() => {
    let active = true;
    (async () => {
      const [players, games, events] = await Promise.all([
        data.getPlayers(),
        data.getGames(),
        data.getEvents(),
      ]);
      if (!active) return;
      // Demo: usa o primeiro jogador do elenco
      setJogadorData(players[0] || null);
      setJogos(games);
      setEventos(events);
    })();
    return () => { active = false; };
  }, []);

  const proximosJogos = useMemo(() => jogos.filter(j => j.status === 'agendado').slice(0, 1), [jogos]);
  const proximosEventos = useMemo(() => eventos.slice(0, 1), [eventos]);

  const getTwoPartName = (fullName: string): string => {
    const parts = (fullName || '').trim().split(/\s+/).filter(Boolean);
    if (parts.length === 0) return '';
    if (parts.length === 1) return parts[0];
    return `${parts[0]} ${parts[parts.length - 1]}`;
  };

  const estatisticas = jogadorData ? [
    { label: 'Presença', valor: `${jogadorData.percentualPresenca}%`, icon: TrendUp, color: 'warning' },
    { label: 'Troféus', valor: jogadorData.trofeus.length, icon: Trophy, color: 'blue' },
    { label: 'Medalhas', valor: jogadorData.medalhas.length, icon: Medal, color: 'purple' },
    { label: 'Próximos Jogos', valor: proximosJogos.length, icon: SoccerBall, color: 'info' },
  ] : [];

  return (
    <div className="space-y-3 sm:space-y-6 animate-fade-in px-1">
      <PageHeader
        title={jogadorData ? `Olá, ${getTwoPartName(jogadorData.nome)}!` : 'Olá!'}
        description={jogadorData?.posicao}
        stats={jogadorData ? estatisticas.map((s) => ({
          title: s.label,
          value: s.valor,
          icon: s.icon,
          color: s.color,
        })) : undefined}
      />

      {/* Próximos Jogos */}
      <section className="mt-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-[#1E293B]">Próximos Jogos</h2>
          <Button 
            size="sm" 
            variant="link" 
            className="text-[#4C1D95] px-0"
            onClick={() => navigateTo('/jogador/jogos')}
          >
            Ver todos
          </Button>
        </div>
        <div className="w-full">
          {proximosJogos.length > 0 ? (
            <UpcomingItemCard 
              icon={Trophy} 
              title={`vs ${proximosJogos[0].adversario}`} 
              dateText={`${new Date(proximosJogos[0].data).toLocaleDateString('pt-BR')} • ${proximosJogos[0].horario}`} 
              statusLabel="Agendado" 
              statusClassName="bg-[#3B82F6] text-white text-xs px-3 py-1 rounded-full" 
              iconGradientClassName="from-[#4C1D95] to-[#3B82F6]" 
            />
          ) : (
            <Card className="bg-white rounded-xl shadow-card p-4">
              <CardContent className="p-0">
                <p className="text-muted-foreground text-center">Nenhum jogo agendado</p>
              </CardContent>
            </Card>
          )}
        </div>
      </section>

      {/* Próximos Eventos */}
      <section className="mt-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-[#1E293B]">Próximos Eventos</h2>
          <Button 
            size="sm" 
            variant="link" 
            className="text-[#4C1D95] px-0"
            onClick={() => navigateTo('/jogador/eventos')}
          >
            Ver todos
          </Button>
        </div>
        <div className="w-full">
          {proximosEventos.length > 0 ? (
            <UpcomingItemCard 
              icon={Calendar} 
              title={proximosEventos[0].nome} 
              dateText={`${new Date(proximosEventos[0].data).toLocaleDateString('pt-BR')} • ${proximosEventos[0].horario}`} 
              statusLabel="Confirmado" 
              statusClassName="bg-[#22C55E] text-white text-xs px-3 py-1 rounded-full" 
              iconGradientClassName="from-[#22C55E] to-[#16A34A]" 
            />
          ) : (
            <Card className="bg-white rounded-xl shadow-card p-4">
              <CardContent className="p-0">
                <p className="text-muted-foreground text-center">Nenhum evento agendado</p>
              </CardContent>
            </Card>
          )}
        </div>
      </section>

      {/* Conquistas */}
      <section className="mt-6">
        <h2 className="text-lg font-semibold text-[#1E293B] mb-3">Conquistas</h2>
        <h3 className="text-base font-semibold text-[#1E293B] mb-2">Troféus Recentes</h3>
        <div className="grid grid-cols-2 gap-2 sm:gap-4 mb-4">
          {jogadorData?.trofeus.slice(0, 4).map((trofeu) => (
            <Card key={trofeu.id} className="gradient-card shadow-card">
              <CardContent className="p-3 sm:p-4 flex flex-col items-center">
                <Star className="w-6 h-6 text-[#4C1D95] mb-2" />
                <span className="font-bold text-[#1E293B] text-sm sm:text-base text-center">{trofeu.nome}</span>
                <span className="text-xs text-muted-foreground mt-1">
                  {new Date(trofeu.dataConquista).toLocaleDateString('pt-BR')}
                </span>
              </CardContent>
            </Card>
          ))}
        </div>
        <h3 className="text-base font-semibold text-[#1E293B] mb-2">Medalhas</h3>
        <div className="space-y-2 sm:space-y-3 mb-4">
          {jogadorData?.medalhas.slice(0, 3).map((medalha) => (
            <Card key={medalha.id} className="gradient-card shadow-card">
              <CardContent className="p-3 sm:p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Medal className="w-6 h-6 text-[#4C1D95]" />
                  <div>
                    <span className="font-bold text-[#1E293B] text-sm sm:text-base block">{medalha.nome}</span>
                    <p className="text-xs text-muted-foreground">{medalha.descricao}</p>
                  </div>
                </div>
                <Badge className="bg-[#4C1D95] text-white rounded-full px-3 py-0.5 text-xs">{medalha.tipo}</Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
};

export default DashboardJogador;