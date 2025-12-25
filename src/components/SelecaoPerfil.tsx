// Componente para seleção de perfil (Administrador ou Jogador)
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Gear, Users, Trophy, ChartBar } from 'phosphor-react';

const SelecaoPerfil: React.FC = () => {
  const { usuario, selecionarPerfil } = useAuth();
  const navigate = useNavigate();

  const handlePerfilSelecionado = (tipo: 'jogador' | 'administrador') => {
    selecionarPerfil(tipo);
    // Navegar para a rota correta baseada no tipo
    if (tipo === 'administrador') {
      navigate('/admin');
    } else {
      navigate('/jogador');
    }
  };

  const perfis = [
    {
      tipo: 'administrador' as const,
      titulo: 'Administrador',
      descricao: 'Gerencie jogadores, jogos, eventos e estatísticas completas do time',
      icone: Gear,
      funcionalidades: [
        'Gerenciar elenco e comissão',
        'Agendar jogos e eventos',
        'Registrar resultados',
        'Ver todas as estatísticas'
      ],
      cor: 'from-blue-500 to-blue-600',
      delay: '0ms'
    },
    {
      tipo: 'jogador' as const,
      titulo: 'Jogador',
      descricao: 'Confirme presenças, veja suas estatísticas e acompanhe o time',
      icone: Trophy,
      funcionalidades: [
        'Confirmar presença em jogos',
        'RSVP para eventos',
        'Acompanhar estatísticas pessoais',
        'Sistema de troféus e medalhas'
      ],
      cor: 'from-green-500 to-green-600',
      delay: '150ms'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-primary flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="text-center text-white mb-8 animate-fade-in">
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mr-4 shadow-glow">
              <img
                src={usuario?.foto || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=64&h=64&fit=crop&crop=face'}
                alt={usuario?.nome}
                className="w-12 h-12 rounded-full object-cover"
              />
            </div>
            <div className="text-left">
              <h1 className="text-2xl font-bold">Olá, {usuario?.nome}!</h1>
              <p className="text-white/80">Como você deseja acessar o sistema?</p>
            </div>
          </div>
        </div>

        {/* Cards de Seleção */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {perfis.map((perfil) => {
            const IconComponent = perfil.icone;
            return (
              <Card 
                key={perfil.tipo}
                className="relative overflow-hidden shadow-float border-0 card-hover animate-slide-up"
                style={{ animationDelay: perfil.delay }}
              >
                {/* Gradiente de fundo */}
                <div className={`absolute inset-0 bg-gradient-to-br ${perfil.cor} opacity-5`} />
                
                <CardHeader className="relative text-center pb-4">
                  <div className={`mx-auto w-16 h-16 bg-gradient-to-br ${perfil.cor} rounded-full flex items-center justify-center mb-4 shadow-glow`}>
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-xl font-bold">{perfil.titulo}</CardTitle>
                  <CardDescription className="text-sm">
                    {perfil.descricao}
                  </CardDescription>
                </CardHeader>

                <CardContent className="relative space-y-4">
                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm text-muted-foreground mb-3">
                      O que você pode fazer:
                    </h4>
                    <ul className="space-y-2">
                      {perfil.funcionalidades.map((func, index) => (
                        <li key={index} className="flex items-center text-sm">
                          <div className="w-1.5 h-1.5 bg-primary rounded-full mr-3 flex-shrink-0" />
                          {func}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Button
                    onClick={() => handlePerfilSelecionado(perfil.tipo)}
                    className={`w-full bg-gradient-to-r ${perfil.cor} hover:opacity-90 transition-all duration-300 transform hover:scale-105 shadow-md`}
                  >
                    Acessar como {perfil.titulo}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Informações adicionais */}
        <div className="text-center text-white/60 text-sm mt-8 animate-fade-in" style={{ animationDelay: '300ms' }}>
          <div className="flex items-center justify-center space-x-6">
            <div className="flex items-center">
              <Users className="w-4 h-4 mr-2" />
              <span>Time Completo</span>
            </div>
            <div className="flex items-center">
              <ChartBar className="w-4 h-4 mr-2" />
              <span>Estatísticas Detalhadas</span>
            </div>
            <div className="flex items-center">
              <Trophy className="w-4 h-4 mr-2" />
              <span>Sistema de Conquistas</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SelecaoPerfil;