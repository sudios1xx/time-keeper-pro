import React, { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SoccerBall, Trophy, TrendUp, Calendar } from "phosphor-react";
import { useNavigation } from "@/hooks/use-navigation";
import PageHeader from "@/components/common/PageHeader";
import UpcomingItemCard from "@/components/admin/components/UpcomingItemCard";
import { data } from "@/services/data";
import type { Evento, Jogo, Jogador } from "@/types";

const PlayerDashboardPage: React.FC = () => {
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
      setJogadorData(players[0] || null);
      setJogos(games);
      setEventos(events);
    })();
    return () => {
      active = false;
    };
  }, []);

  const proximosJogos = useMemo(
    () => jogos.filter((j) => j.status === "agendado").slice(0, 1),
    [jogos],
  );
  const proximosEventos = useMemo(() => eventos.slice(0, 1), [eventos]);

  const getTwoPartName = (fullName: string): string => {
    const parts = (fullName || "")
      .trim()
      .split(/\s+/)
      .filter(Boolean);
    if (parts.length === 0) return "";
    if (parts.length === 1) return parts[0];
    return `${parts[0]} ${parts[parts.length - 1]}`;
  };

  const estatisticas = jogadorData
    ? [
        {
          label: "Presença",
          valor: `${jogadorData.percentualPresenca}%`,
          icon: TrendUp,
          color: "warning",
        },
        {
          label: "Próximos Jogos",
          valor: proximosJogos.length,
          icon: SoccerBall,
          color: "info",
        },
      ]
    : [];

  return (
    <div className="space-y-3 sm:space-y-6 animate-fade-in px-1">
      <PageHeader
        title={
          jogadorData ? `Olá, ${getTwoPartName(jogadorData.nome)}!` : "Olá!"
        }
        description={jogadorData?.posicao}
        stats={
          jogadorData
            ? estatisticas.map((s) => ({
                title: s.label,
                value: s.valor,
                icon: s.icon,
                color: s.color,
              }))
            : undefined
        }
      />

      {/* Próximos Jogos */}
      <section className="mt-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-[#1E293B]">
            Próximos Jogos
          </h2>
          <Button
            size="sm"
            variant="link"
            className="text-[#4C1D95] px-0"
            onClick={() => navigateTo("/jogador/jogos")}
          >
            Ver todos
          </Button>
        </div>
        <div className="w-full">
          {proximosJogos.length > 0 ? (
            <UpcomingItemCard
              icon={Trophy}
              title={`vs ${proximosJogos[0].adversario}`}
              dateText={`${new Date(
                proximosJogos[0].data,
              ).toLocaleDateString("pt-BR")} • ${proximosJogos[0].horario}`}
              statusLabel="Agendado"
              statusClassName="bg-[#3B82F6] text-white text-xs px-3 py-1 rounded-full"
              iconGradientClassName="from-[#4C1D95] to-[#3B82F6]"
            />
          ) : (
            <Card className="bg-white rounded-xl shadow-card p-4">
              <CardContent className="p-0">
                <p className="text-muted-foreground text-center">
                  Nenhum jogo agendado
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </section>

      {/* Próximos Eventos */}
      <section className="mt-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-[#1E293B]">
            Próximos Eventos
          </h2>
          <Button
            size="sm"
            variant="link"
            className="text-[#4C1D95] px-0"
            onClick={() => navigateTo("/jogador/eventos")}
          >
            Ver todos
          </Button>
        </div>
        <div className="w-full">
          {proximosEventos.length > 0 ? (
            <UpcomingItemCard
              icon={Calendar}
              title={proximosEventos[0].nome}
              dateText={`${new Date(
                proximosEventos[0].data,
              ).toLocaleDateString("pt-BR")} • ${proximosEventos[0].horario}`}
              statusLabel="Confirmado"
              statusClassName="bg-[#22C55E] text-white text-xs px-3 py-1 rounded-full"
              iconGradientClassName="from-[#22C55E] to-[#16A34A]"
            />
          ) : (
            <Card className="bg-white rounded-xl shadow-card p-4">
              <CardContent className="p-0">
                <p className="text-muted-foreground text-center">
                  Nenhum evento agendado
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </section>

    </div>
  );
};

export default PlayerDashboardPage;
