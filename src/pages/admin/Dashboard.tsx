import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarDays, Users, Activity, Wallet } from "lucide-react";

const mockNextGames = [
  { opponent: "Real Vila", date: "Sáb · 16:00", place: "Arena Bairro Alto" },
  { opponent: "Inter da Rua 7", date: "Dom · 10:30", place: "Campo Municipal" },
];

const AdminDashboard = () => {
  return (
    <div className="space-y-4 animate-fade-in">
      <section className="space-y-2">
        <h1 className="text-xl font-semibold">Seu timme em campo</h1>
        <p className="text-sm text-muted-foreground">
          Visão rápida de jogadores, jogos, eventos e finanças — tudo pensado para o futebol amador.
        </p>
      </section>

      <section className="grid grid-cols-2 gap-3 text-xs">
        <Card className="timme-card bg-card/90">
          <CardContent className="flex flex-col gap-2 p-3">
            <span className="text-[0.65rem] uppercase tracking-[0.18em] text-muted-foreground">Jogadores</span>
            <p className="text-2xl font-semibold">18</p>
            <p className="text-[0.7rem] text-muted-foreground">Ativos no elenco</p>
          </CardContent>
        </Card>
        <Card className="timme-card bg-card/90">
          <CardContent className="flex flex-col gap-2 p-3">
            <span className="text-[0.65rem] uppercase tracking-[0.18em] text-muted-foreground">Próximos jogos</span>
            <p className="text-2xl font-semibold">3</p>
            <p className="text-[0.7rem] text-muted-foreground">Nas próximas 2 semanas</p>
          </CardContent>
        </Card>
        <Card className="timme-card bg-card/90">
          <CardContent className="flex flex-col gap-2 p-3">
            <span className="text-[0.65rem] uppercase tracking-[0.18em] text-muted-foreground">Eventos ativos</span>
            <p className="text-2xl font-semibold">2</p>
            <p className="text-[0.7rem] text-muted-foreground">Treinos e social</p>
          </CardContent>
        </Card>
        <Card className="timme-card bg-card/90">
          <CardContent className="flex flex-col gap-2 p-3">
            <span className="text-[0.65rem] uppercase tracking-[0.18em] text-muted-foreground">Presença média</span>
            <p className="text-2xl font-semibold">78%</p>
            <p className="text-[0.7rem] text-muted-foreground">Últimos 10 jogos</p>
          </CardContent>
        </Card>
      </section>

      <section className="space-y-2">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold">Ações rápidas</h2>
        </div>
        <div className="flex gap-2 overflow-x-auto timme-scroll-snap-x pb-1">
          <button className="timme-scroll-snap-item min-w-[140px] rounded-2xl bg-primary px-4 py-3 text-left text-xs text-primary-foreground shadow-lg shadow-primary/40">
            <div className="mb-2 flex items-center gap-2 text-[0.7rem] font-semibold uppercase tracking-[0.18em]">
              <CalendarDays className="h-4 w-4" />
              Jogo rápido
            </div>
            <p>Agendar novo amistoso</p>
          </button>
          <button className="timme-scroll-snap-item min-w-[140px] rounded-2xl bg-secondary px-4 py-3 text-left text-xs text-secondary-foreground">
            <div className="mb-2 flex items-center gap-2 text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-accent">
              <Users className="h-4 w-4" />
              Jogadores
            </div>
            <p>Cadastrar atleta no elenco</p>
          </button>
          <button className="timme-scroll-snap-item min-w-[140px] rounded-2xl bg-secondary px-4 py-3 text-left text-xs text-secondary-foreground">
            <div className="mb-2 flex items-center gap-2 text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-primary">
              <Wallet className="h-4 w-4" />
              Finanças
            </div>
            <p>Lançar entrada ou saída</p>
          </button>
        </div>
      </section>

      <section className="space-y-2">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold flex items-center gap-2">
            <CalendarDays className="h-4 w-4 text-primary" /> Próximos jogos
          </h2>
          <Button variant="ghost" size="sm" className="text-[0.7rem]">
            Ver todos
          </Button>
        </div>
        <div className="space-y-2">
          {mockNextGames.map((game) => (
            <Card key={game.opponent} className="timme-card bg-card/90">
              <CardContent className="flex items-center justify-between gap-3 p-3">
                <div>
                  <p className="text-sm font-semibold">vs {game.opponent}</p>
                  <p className="text-[0.7rem] text-muted-foreground">{game.date} · {game.place}</p>
                </div>
                <div className="flex flex-col items-end gap-1 text-[0.65rem]">
                  <span className="inline-flex items-center gap-1 rounded-full bg-primary/15 px-2 py-1 text-primary">
                    <Activity className="h-3 w-3" />
                    amistoso
                  </span>
                  <Button variant="outline" size="sm" className="text-[0.7rem]">
                    Gestão
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
};

export default AdminDashboard;
