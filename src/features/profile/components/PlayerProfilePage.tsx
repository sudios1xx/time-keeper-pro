import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { User, SignOut, PencilSimple, Calendar } from "phosphor-react";
import { useAuth } from "@/contexts/AuthContext";
import PageHeader from "@/components/common/PageHeader";

const estatisticas = [
  { label: "Jogos", valor: 32, icon: Calendar, color: "blue" },
  { label: "Eventos", valor: 12, icon: Calendar, color: "info" },
];

const PlayerProfilePage: React.FC = () => {
  const { usuario, logout } = useAuth();

  const stats = estatisticas.map((s) => ({
    title: s.label,
    value: s.valor,
    icon: s.icon,
    color: s.color,
  }));

  return (
    <div className="space-y-3 sm:space-y-6 animate-fade-in px-1">
      <PageHeader
        title={usuario?.nome || "Nome do Jogador"}
        description={usuario?.email || "email@exemplo.com"}
        stats={stats}
      />

      {/* Avatar e informações */}
      <Card className="shadow-card">
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-col items-center gap-3">
            <img
              src={
                usuario?.foto ||
                "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=96&h=96&fit=crop&crop=face"
              }
              alt={usuario?.nome}
              className="w-24 h-24 rounded-full object-cover border-4 border-primary/20"
            />
            <div className="text-center">
              <span className="text-sm text-primary font-semibold capitalize flex items-center justify-center gap-1">
                <User className="w-4 h-4" />
                {usuario?.tipo || "Jogador"}
              </span>
            </div>
            <Button size="sm" variant="outline" className="flex items-center gap-1">
              <PencilSimple className="w-4 h-4" /> Editar Perfil
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Botão sair */}
      <div className="flex justify-center pt-2">
        <Button
          variant="outline"
          className="flex items-center gap-2 text-destructive border-destructive"
          onClick={logout}
        >
          <SignOut className="w-4 h-4" /> Sair
        </Button>
      </div>
    </div>
  );
};

export default PlayerProfilePage;
