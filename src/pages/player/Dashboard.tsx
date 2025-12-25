import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarDays, Users } from "lucide-react";

const mockNextGames = [
  { opponent: "Real Vila", date: "Sáb · 16:00", place: "Arena Bairro Alto", status: "Confirmado" },
  { opponent: "Inter da Rua 7", date: "Dom · 10:30", place: "Campo Municipal", status: "Pendente" },
];

const mockNextEvents = [
  { type: "Treino", when: "Qui · 20:00", place: "Quadra Coberta" },
  { type: "Reunião", when: "Sex · 19:30", place: "Bar do Zé" },
];

const PlayerDashboard = () => {
  return (
    <div className="space-y-4 animate-fade-in">
      <section className="space-y-1.5">
        <h1 className="text-xl font-semibold">Fala, craque!</h1>
        <p className="text-sm text-muted-foreground">Veja seus próximos compromissos com o timme.</p>
      </section>

      <section className="grid grid-cols-2 gap-3 text-xs">
        <Card className="timme-card bg-card/90">
          <CardContent className="flex flex-col gap-2 p-3">
            <span className="text-[0.65rem] uppercase tracking-[0.18em] text-muted-foreground">Presença geral</span>
            <p className="text-2xl font-semibold">82%</p>
            <p className="text-[0.7rem] text-muted-foreground">Últimos 20 jogos</p>
          </CardContent>
        </Card>
        <Card className="timme-card bg-card/90">
          <CardContent className="flex flex-col gap-2 p-3">
            <span className="text-[0.65rem] uppercase tracking-[0.18em] text-muted-foreground">Gols + assist.</span>
            <p className="text-2xl font-semibold">12</p>
            <p className="text-[0.7rem] text-muted-foreground">Nessa temporada</p>
          </CardContent>
        </Card>
      </section>

      <section className="space-y-2">
        <div className="flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-sm font-semibold">
            <CalendarDays className="h-4 w-4 text-primary" /> Próximos jogos
          </h2>
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
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-2 py-1 ${
                      game.status === "Confirmado"
                        ? "bg-primary/15 text-primary"
                        : game.status === "Pendente"
                          ? "bg-accent/15 text-accent-foreground"
                          : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {game.status}
                  </span>
                  <Button variant="outline" size="sm" className="text-[0.7rem]">
                    Confirmar
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="space-y-2 pb-4">
        <div className="flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-sm font-semibold">
            <Users className="h-4 w-4 text-primary" /> Próximos eventos
          </h2>
        </div>
        <div className="space-y-2">
          {mockNextEvents.map((event) => (
            <Card key={event.type + event.when} className="timme-card bg-card/90">
              <CardContent className="flex items-center justify-between gap-3 p-3">
                <div>
                  <p className="text-sm font-semibold">{event.type}</p>
                  <p className="text-[0.7rem] text-muted-foreground">{event.when} · {event.place}</p>
                </div>
                <Button variant="outline" size="sm" className="text-[0.7rem]">
                  Confirmar
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
};

export default PlayerDashboard;
