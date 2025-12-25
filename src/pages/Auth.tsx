import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useAuth, UserRole } from "@/context/AuthContext";

const AuthPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>("admin");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    login({ email, role });
    navigate(role === "admin" ? "/admin" : "/player");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background timme-pitch-bg px-4">
      <div className="pointer-events-none absolute inset-x-0 top-[-120px] mx-auto h-48 max-w-md timme-hero-blur" />
      <Card className="relative z-10 w-full max-w-md border-border/80 bg-card/95 timme-card timme-card-glow">
        <CardHeader>
          <p className="text-xs uppercase tracking-[0.2em] text-accent">Futebol amador</p>
          <CardTitle className="text-2xl">Entrar no timme</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Entrar como</Label>
              <RadioGroup
                defaultValue="admin"
                className="grid grid-cols-2 gap-2 text-xs"
                onValueChange={(value) => setRole(value as UserRole)}
              >
                <div className="flex items-center gap-2 rounded-full bg-secondary/70 px-3 py-2">
                  <RadioGroupItem value="admin" id="admin" />
                  <Label htmlFor="admin" className="flex-1 cursor-pointer text-xs">
                    Gestor
                  </Label>
                </div>
                <div className="flex items-center gap-2 rounded-full bg-secondary/70 px-3 py-2">
                  <RadioGroupItem value="player" id="player" />
                  <Label htmlFor="player" className="flex-1 cursor-pointer text-xs">
                    Jogador
                  </Label>
                </div>
              </RadioGroup>
            </div>
            <Button type="submit" variant="hero" size="lg" className="w-full">
              Entrar
            </Button>
            <p className="text-[0.7rem] leading-snug text-muted-foreground">
              Nesta primeira versão a autenticação é simulada apenas no front-end. Depois conectaremos ao backend
              completo com Supabase e papéis (admin / jogador).
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthPage;
