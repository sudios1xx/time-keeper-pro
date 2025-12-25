import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Home, Users, CalendarDays, LayoutGrid, User2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

const navItemsAdmin = [
  { to: "/admin", icon: Home, label: "Visão geral" },
  { to: "/admin/jogadores", icon: Users, label: "Jogadores" },
  { to: "/admin/jogos", icon: CalendarDays, label: "Jogos" },
  { to: "/admin/escala", icon: LayoutGrid, label: "Escalação" },
  { to: "/admin/financeiro", icon: User2, label: "Finanças" },
];

const navItemsPlayer = [
  { to: "/player", icon: Home, label: "Dashboard" },
  { to: "/player/jogos", icon: CalendarDays, label: "Jogos" },
  { to: "/player/eventos", icon: LayoutGrid, label: "Eventos" },
  { to: "/player/perfil", icon: User2, label: "Perfil" },
];

export const AppLayout = () => {
  const { session, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const items = session?.role === "admin" ? navItemsAdmin : navItemsPlayer;

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground timme-pitch-bg">
      <header className="relative z-10 flex items-center justify-between px-4 pb-3 pt-6">
        <div className="flex items-center gap-2">
          <span className="h-8 w-8 rounded-full border border-primary/40 bg-primary/20" />
          <div className="leading-tight">
            <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">timme</p>
            <p className="text-sm font-semibold">{session?.role === "admin" ? "Gestor" : "Atleta"}</p>
          </div>
        </div>
        {session && (
          <Button variant="ghost" size="pill" onClick={logout}>
            Sair
          </Button>
        )}
      </header>

      <main className="relative flex-1 pb-20">
        <div className="pointer-events-none absolute inset-x-0 top-[-120px] mx-auto h-48 max-w-md timme-hero-blur" />
        <div className="relative z-10 mx-auto flex h-full max-w-md flex-col gap-4 px-4 pb-6">
          <Outlet />
        </div>
      </main>

      {session && (
        <nav className="sticky bottom-0 z-20 mx-auto w-full max-w-md border-t border-border/60 bg-background/95 pb-4 pt-2 backdrop-blur">
          <div className="mx-4 flex items-center justify-between gap-1 rounded-full bg-secondary/70 px-2 py-1 shadow-lg shadow-black/50">
            {items.map((item) => {
              const isActive = location.pathname === item.to;
              const Icon = item.icon;
              return (
                <button
                  key={item.to}
                  onClick={() => navigate(item.to)}
                  className={`flex flex-1 flex-col items-center justify-center gap-1 rounded-full px-2 py-1 text-[0.7rem] transition-colors ${isActive ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </nav>
      )}
    </div>
  );
};
