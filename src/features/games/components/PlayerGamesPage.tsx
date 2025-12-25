import React, { useEffect, useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Trophy,
  CheckCircle,
  Clock,
  MapPin,
  Users,
  XCircle,
  TrendUp,
} from "phosphor-react";
import { logger } from "@/utils/logger";
import type { Jogo, Jogador } from "@/types";
import PageHeader from "@/components/common/PageHeader";
import { data } from "@/services/data";

const PlayerGamesPage: React.FC = () => {
  const [filterStatus, setFilterStatus] = useState("agendado");
  const [jogos, setJogos] = useState<Jogo[]>([]);
  const [jogadorData, setJogadorData] = useState<Jogador | null>(null);

  useEffect(() => {
    let active = true;
    (async () => {
      const [players, games] = await Promise.all([
        data.getPlayers(),
        data.getGames(),
      ]);
      if (!active) return;
      setJogadorData(players[0] || null);
      setJogos(games);
    })();
    return () => {
      active = false;
    };
  }, []);

  const statusOptions = [
    { value: "agendado", label: "Próximos Jogos", icon: Clock },
    { value: "finalizado", label: "Jogos Realizados", icon: CheckCircle },
    { value: "todos", label: "Todos os Jogos", icon: Calendar },
  ];

  const jogosFiltrados = useMemo(
    () =>
      jogos.filter(
        (jogo) => filterStatus === "todos" || jogo.status === filterStatus,
      ),
    [jogos, filterStatus],
  );

  const estatisticas = useMemo(
    () => ({
      totalJogos: jogos.length,
      jogosAgendados: jogos.filter((j) => j.status === "agendado").length,
      jogosFinalizados: jogos.filter((j) => j.status === "finalizado").length,
      minhaPresenca: jogadorData
        ? jogos.filter(
            (j) =>
              j.presencas.find((p) => p.jogadorId === jogadorData.id)?.confirmou,
          ).length
        : 0,
    }),
    [jogos, jogadorData],
  );

  const stats = [
    { title: "Total", value: estatisticas.totalJogos, icon: Calendar, color: "blue" },
    {
      title: "Próximos",
      value: estatisticas.jogosAgendados,
      icon: Clock,
      color: "info",
    },
    {
      title: "Confirmei",
      value: estatisticas.minhaPresenca,
      icon: CheckCircle,
      color: "success",
    },
    {
      title: "Presença",
      value: `${jogadorData?.percentualPresenca ?? 0}%`,
      icon: TrendUp,
      color: "warning",
    },
  ];

  const confirmarPresenca = (jogoId: string, confirmar: boolean) => {
    logger.log(
      `${confirmar ? "Confirmando" : "Cancelando"} presença no jogo ${jogoId}`,
    );
  };

  const getResultadoDisplay = (jogo: Jogo) => {
    if (jogo.status !== "finalizado" || !jogo.resultado) return null;

    const { gols, golsAdversario } = jogo.resultado;
    let resultado = "";
    let cor = "";

    if (gols > golsAdversario) {
      resultado = "Vitória";
      cor = "text-success bg-success/10";
    } else if (gols < golsAdversario) {
      resultado = "Derrota";
      cor = "text-destructive bg-destructive/10";
    } else {
      resultado = "Empate";
      cor = "text-warning bg-warning/10";
    }

    return { resultado, cor, placar: `${gols} - ${golsAdversario}` };
  };

  return (
    <div className="space-y-3 sm:space-y-6 animate-fade-in px-1">
      <PageHeader
        title="Meus Jogos"
        description="Acompanhe os jogos e confirme sua presença"
        stats={stats}
      />

      {/* Filtros */}
      <Card className="shadow-card">
        <CardContent className="p-3 sm:p-6">
          <div className="flex flex-wrap gap-2 justify-center">
            {statusOptions.map((option) => {
              const IconComponent = option.icon;
              return (
                <Button
                  key={option.value}
                  variant={
                    filterStatus === option.value ? "default" : "outline"
                  }
                  size="sm"
                  onClick={() => setFilterStatus(option.value)}
                  className={`${
                    filterStatus === option.value ? "shadow-glow" : ""
                  } flex items-center gap-2`}
                >
                  <IconComponent className="w-4 h-4" />
                  {option.label}
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Lista de Jogos */}
      <div className="grid gap-3 sm:gap-4">
        {jogosFiltrados.map((jogo) => {
          const minhaPresenca = jogadorData
            ? jogo.presencas.find((p) => p.jogadorId === jogadorData.id)
            : undefined;
          const confirmei = minhaPresenca?.confirmou;
          const resultadoInfo = getResultadoDisplay(jogo);
          const isProximo = jogo.status === "agendado";

          return (
            <Card key={jogo.id} className="card-hover shadow-card">
              <CardContent className="p-3 sm:p-6">
                <div className="space-y-3 sm:space-y-4">
                  {/* Header do Jogo */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center space-x-3 sm:space-x-4 min-w-0 flex-1">
                      <div className="text-center shrink-0">
                        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-primary rounded-xl flex items-center justify-center shadow-glow">
                          <Trophy className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                        </div>
                        <p className="text-xs text-muted-foreground mt-1 font-medium">
                          {jogo.status === "agendado" ? "PRÓXIMO" : "FINALIZADO"}
                        </p>
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="text-lg sm:text-2xl font-bold truncate">
                          vs {jogo.adversario}
                        </h3>
                        <div className="flex flex-col gap-1 text-xs sm:text-sm text-muted-foreground">
                          <div className="flex items-center">
                            <Calendar className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                            {new Date(jogo.data).toLocaleDateString("pt-BR")}
                            <Clock className="w-3 h-3 sm:w-4 sm:h-4 mr-1 ml-4" />
                            {jogo.horario}
                          </div>
                          <div className="flex items-center">
                            <MapPin className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                            <span className="truncate">{jogo.local}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="text-right space-y-2 shrink-0">
                      {resultadoInfo && (
                        <div className="space-y-1">
                          <div className="text-xl sm:text-3xl font-bold">
                            {resultadoInfo.placar}
                          </div>
                          <Badge className={`${resultadoInfo.cor} text-xs`}>
                            {resultadoInfo.resultado}
                          </Badge>
                        </div>
                      )}

                      {isProximo && (
                        <Badge
                          variant={confirmei ? "default" : "secondary"}
                          className="flex items-center gap-1 text-xs"
                        >
                          {confirmei ? (
                            <CheckCircle className="w-3 h-3" />
                          ) : (
                            <XCircle className="w-3 h-3" />
                          )}
                          {confirmei ? "Confirmado" : "Pendente"}
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Informações do Time */}
                  <div className="bg-accent/30 rounded-lg p-3 sm:p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold flex items-center text-sm sm:text-base">
                        <Users className="w-4 h-4 mr-2" />
                        Presença do Time
                      </h4>
                      <span className="text-xs sm:text-sm font-medium">
                        {
                          jogo.presencas.filter((p) => p.confirmou)
                            .length
                        }
                        /{jogo.presencas.length} confirmados
                      </span>
                    </div>

                    <div className="w-full bg-secondary rounded-full h-2 mb-2">
                      <div
                        className="bg-gradient-primary h-2 rounded-full transition-all duration-500"
                        style={{
                          width: `${
                            (jogo.presencas.filter((p) => p.confirmou).length /
                              jogo.presencas.length) *
                            100
                          }%`,
                        }}
                      />
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 text-xs sm:text-sm">
                      <div className="text-center">
                        <p className="font-medium text-success">
                          {
                            jogo.presencas.filter((p) => p.confirmou)
                              .length
                          }
                        </p>
                        <p className="text-muted-foreground">Confirmados</p>
                      </div>
                      <div className="text-center">
                        <p className="font-medium text-warning">
                          {
                            jogo.presencas.filter((p) => !p.confirmou)
                              .length
                          }
                        </p>
                        <p className="text-muted-foreground">Pendentes</p>
                      </div>
                      <div className="text-center">
                        <p className="font-medium text-primary">
                          {Math.round(
                            (jogo.presencas.filter((p) => p.confirmou).length /
                              jogo.presencas.length) *
                              100,
                          )}
                          %
                        </p>
                        <p className="text-muted-foreground">Taxa</p>
                      </div>
                      <div className="text-center">
                        <Badge
                          variant={
                            jogo.presencas.filter((p) => p.confirmou).length /
                              jogo.presencas.length >=
                            0.8
                              ? "default"
                              : "secondary"
                          }
                          className="text-xs"
                        >
                          {jogo.presencas.filter((p) => p.confirmou).length /
                            jogo.presencas.length >=
                          0.8
                            ? "Ótimo"
                            : "Regular"}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {/* Ações */}
                  {isProximo && (
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pt-2 border-t border-border">
                      <div className="text-xs sm:text-sm text-muted-foreground">
                        {confirmei
                          ? "Você confirmou presença neste jogo"
                          : "Confirme sua presença para este jogo"}
                      </div>

                      <div className="flex space-x-2 w-full sm:w-auto">
                        {confirmei ? (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => confirmarPresenca(jogo.id, false)}
                            className="text-destructive hover:text-destructive text-xs flex-1 sm:flex-none"
                          >
                            <XCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                            Cancelar
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            onClick={() => confirmarPresenca(jogo.id, true)}
                            className="gradient-success shadow-glow text-xs flex-1 sm:flex-none"
                          >
                            <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                            Confirmar
                          </Button>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Detalhes do resultado para jogos finalizados */}
                  {jogo.status === "finalizado" && jogo.resultado && (
                    <div className="pt-2 border-t border-border">
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 text-xs sm:text-sm">
                        <div className="text-center">
                          <p className="font-medium">⚽ {jogo.resultado.gols}</p>
                          <p className="text-muted-foreground">Gols marcados</p>
                        </div>
                        <div className="text-center">
                          <p className="font-medium">
                            🛡️ {jogo.resultado.golsAdversario}
                          </p>
                          <p className="text-muted-foreground">Gols sofridos</p>
                        </div>
                        <div className="text-center">
                          <p className="font-medium">
                            🟨 {jogo.resultado.cartoesAmarelos}
                          </p>
                          <p className="text-muted-foreground">
                            Cartões amarelos
                          </p>
                        </div>
                        <div className="text-center">
                          <p className="font-medium">
                            🟥 {jogo.resultado.cartoesVermelhos}
                          </p>
                          <p className="text-muted-foreground">
                            Cartões vermelhos
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {jogosFiltrados.length === 0 && (
        <Card className="shadow-card">
          <CardContent className="p-12 text-center">
            <div className="space-y-4">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto">
                <Calendar className="w-8 h-8 text-muted-foreground" />
              </div>
              <div>
                <h3 className="font-semibold">Nenhum jogo encontrado</h3>
                <p className="text-muted-foreground">
                  {filterStatus === "agendado"
                    ? "Não há jogos agendados no momento"
                    : filterStatus === "finalizado"
                      ? "Nenhum jogo foi finalizado ainda"
                      : "Nenhum jogo registrado"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PlayerGamesPage;
