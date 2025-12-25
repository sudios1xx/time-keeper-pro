// Componente de Login para PWA de futebol - Mobile First
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Label } from './ui/label';
import { SpinnerGap, Shield, Envelope, Lock, User, SoccerBall } from 'phosphor-react';
import { useToast } from '../hooks/use-toast';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !senha) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha email e senha.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    const sucesso = await login(email);
    
    if (sucesso) {
      toast({
        title: "Login realizado!",
        description: "Bem-vindo ao sistema de gestão do time.",
      });
    } else {
      toast({
        title: "Erro no login",
        description: "Verifique suas credenciais e tente novamente.",
        variant: "destructive"
      });
    }
    
    setIsLoading(false);
  };

  const preencherCredenciais = (tipo: 'admin' | 'jogador') => {
    if (tipo === 'admin') {
      setEmail('admin@time.com');
      setSenha('123456');
    } else {
      setEmail('jogador@time.com');
      setSenha('123456');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex flex-col p-4">
      {/* Container principal com scroll se necessário */}
      <div className="flex-1 flex flex-col justify-center items-center min-h-0">
        <div className="w-full max-w-sm space-y-6">
          {/* Logo e Branding */}
          <div className="text-center space-y-3">
            <div className="mx-auto w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center shadow-lg">
              <Shield className="w-7 h-7 sm:w-8 sm:h-8 text-white" weight="fill" />
            </div>
            <div className="space-y-1">
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
                Time Manager
              </h1>
              <p className="text-xs sm:text-sm text-slate-600">
                Sistema de Gestão de Futebol
              </p>
            </div>
          </div>

          {/* Card de Login */}
          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="space-y-1 pb-4 px-6 pt-6">
              <CardTitle className="text-lg sm:text-xl text-center text-slate-900">
                Entrar no Sistema
              </CardTitle>
              <CardDescription className="text-center text-slate-600 text-xs sm:text-sm">
                Entre com suas credenciais para acessar o sistema
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-4 px-6 pb-6">
              <form onSubmit={handleSubmit} className="space-y-3">
                <div className="space-y-1">
                  <Label htmlFor="email" className="text-xs sm:text-sm font-medium text-slate-700">
                    Email
                  </Label>
                  <div className="relative">
                    <Envelope className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="seu@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 h-10 sm:h-11 border-slate-200 focus:border-blue-500 focus:ring-blue-500 text-sm"
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <Label htmlFor="senha" className="text-xs sm:text-sm font-medium text-slate-700">
                    Senha
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      id="senha"
                      type="password"
                      placeholder="Sua senha"
                      value={senha}
                      onChange={(e) => setSenha(e.target.value)}
                      className="pl-10 h-10 sm:h-11 border-slate-200 focus:border-blue-500 focus:ring-blue-500 text-sm"
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full h-10 sm:h-11 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-medium rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl text-sm"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <SpinnerGap className="mr-2 h-4 w-4 animate-spin" />
                      Entrando...
                    </>
                  ) : (
                    'Entrar'
                  )}
                </Button>
              </form>

              {/* Credenciais de Demonstração */}
              <div className="space-y-3">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-200" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-2 text-slate-500 font-medium text-xs">
                      Credenciais para demonstração
                    </span>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => preencherCredenciais('admin')}
                    disabled={isLoading}
                    className="h-9 border-slate-200 hover:border-blue-300 hover:bg-blue-50 text-slate-700 font-medium text-xs"
                  >
                    <User className="w-3 h-3 mr-1" />
                    <span className="text-xs">Admin</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => preencherCredenciais('jogador')}
                    disabled={isLoading}
                    className="h-9 border-slate-200 hover:border-blue-300 hover:bg-blue-50 text-slate-700 font-medium text-xs"
                  >
                    <SoccerBall className="w-3 h-3 mr-1" />
                    <span className="text-xs">Jogador</span>
                  </Button>
                </div>
                
                <p className="text-xs text-slate-500 text-center">
                  Ou digite qualquer email e senha
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Rodapé */}
          <div className="text-center">
            <p className="text-xs text-slate-500">
              © 2024 Time Manager - PWA de Gestão Esportiva
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;