import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Users, Search, Filter } from "lucide-react";

const mockPlayers = [
  {
    id: 1,
    name: "João " + "Pedalada",
    position: "Atacante",
    age: 27,
    phone: "(11) 99999-0001",
    status: "ativo" as const,
  },
  {
    id: 2,
    name: "Bruno " + "Paredão",
    position: "Goleiro",
    age: 31,
    phone: "(11) 98888-0002",
    status: "ativo" as const,
  },
  {
    id: 3,
    name: "Rafa " + "Motorzinho",
    position: "Meia",
    age: 24,
    phone: "(11) 97777-0003",
    status: "lesionado" as const,
  },
  {
    id: 4,
    name: "Diego " + "Zagueiro",
    position: "Zagueiro",
    age: 29,
    phone: "",
    status: "inativo" as const,
  },
];

const statusColor: Record<string, string> = {
  ativo: "bg-primary/20 text-primary",
  inativo: "bg-muted text-muted-foreground",
  lesionado: "bg-accent/20 text-accent-foreground",
};

const JogadoresPage = () => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);

  const filteredPlayers = mockPlayers.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter ? p.status === statusFilter : true;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-4 animate-fade-in">
      <section className="space-y-1">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/20 text-primary">
            <Users className="h-4 w-4" />
          </div>
          <div>
            <h1 className="text-lg font-semibold">Elenco do timme</h1>
            <p className="text-xs text-muted-foreground">Gerencie jogadores, posições e status em tempo real.</p>
          </div>
        </div>
      </section>

      <Card className="timme-card bg-card/95 border-border/70">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Filtros rápidos</CardTitle>
          <CardDescription className="text-[0.7rem]">
            Busque por nome/apelido e filtre por status. Depois ligamos isso ao banco.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 pt-0">
          <div className="flex items-center gap-2 rounded-full bg-secondary/60 px-3 py-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar jogador ou apelido"
              className="h-8 border-none bg-transparent px-0 text-xs focus-visible:ring-0"
            />
          </div>
          <div className="flex flex-wrap items-center gap-2 text-[0.7rem]">
            <span className="inline-flex items-center gap-1 text-muted-foreground">
              <Filter className="h-3 w-3" /> Status:
            </span>
            {[
              { key: null, label: "Todos" },
              { key: "ativo", label: "Ativos" },
              { key: "lesionado", label: "Lesionados" },
              { key: "inativo", label: "Inativos" },
            ].map((opt) => (
              <button
                key={opt.label}
                onClick={() => setStatusFilter(opt.key as string | null)}
                className={`rounded-full px-3 py-1 transition-colors ${
                  statusFilter === opt.key
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary/60 text-secondary-foreground"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      <section className="space-y-2 pb-4">
        <div className="flex items-center justify-between">
          <p className="text-xs text-muted-foreground">
            {filteredPlayers.length} jogadores encontrados
          </p>
          <Button variant="hero" size="pill">
            Novo jogador
          </Button>
        </div>
        <div className="space-y-3">
          {filteredPlayers.map((player) => (
            <Card
              key={player.id}
              className="timme-card bg-card/95 border-border/70 hover:border-primary/60 hover:shadow-lg hover:shadow-primary/30 transition-all duration-200"
            >
              <CardContent className="flex items-center gap-3 p-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/15 text-xs font-semibold uppercase text-primary">
                  {player.name
                    .split(" ")
                    .filter(Boolean)
                    .slice(0, 2)
                    .map((n) => n[0])
                    .join("")}
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <p className="text-sm font-semibold leading-tight">{player.name}</p>
                      <p className="text-[0.7rem] text-muted-foreground">{player.position}</p>
                    </div>
                    <Badge
                      variant="outline"
                      className={`border-none text-[0.65rem] ${statusColor[player.status]} px-2 py-1`}
                    >
                      {player.status}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-[0.7rem] text-muted-foreground">
                    <span>
                      {player.age ? `${player.age} anos` : "Idade não informada"}
                      {player.phone && ` · ${player.phone}`}
                    </span>
                  </div>
                  <div className="flex gap-2 pt-1 text-[0.7rem]">
                    <Button variant="outline" size="sm" className="flex-1">
                      Editar
                    </Button>
                    <Button variant="subtle" size="sm" className="flex-1">
                      Ver histórico
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {filteredPlayers.length === 0 && (
            <Card className="timme-card bg-card/80 border-dashed border-muted/60 text-center text-xs text-muted-foreground">
              <CardContent className="space-y-2 p-4">
                <p>Nenhum jogador encontrado com esses filtros.</p>
                <p>Comece cadastrando o elenco do seu timme – titulares, banco e amigos da resenha.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </section>
    </div>
  );
};

export default JogadoresPage;
