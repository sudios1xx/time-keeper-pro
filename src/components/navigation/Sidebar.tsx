import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigation } from '../../hooks/use-navigation';
import { Button } from '../ui/button';
import {
  House,
  Users,
  SoccerBall,
  Calendar,
  Chats,
  User,
  SignOut,
  Bell,
  MagnifyingGlass,
  Trophy,
  CurrencyDollarSimple
} from 'phosphor-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { Badge } from '../ui/badge';
import { Card, CardContent } from '../ui/card';
import { PencilSimple, Medal } from 'phosphor-react';

const Sidebar: React.FC = () => {
  const { usuario, logout } = useAuth();
  const { navigateTo, isActiveRoute } = useNavigation();
  const [isPerfilJogadorOpen, setIsPerfilJogadorOpen] = React.useState(false);

  const menuAdministrador = [
    { id: '/admin/elenco', label: 'Elenco', icon: Users },
    { id: '/admin/financas', label: 'Finanças', icon: CurrencyDollarSimple },
    { id: '/admin', label: 'Início', icon: House },
    { id: '/admin/jogos', label: 'Jogos', icon: SoccerBall },
    { id: '/admin/eventos', label: 'Eventos', icon: Calendar },
  ];

  const menuJogador = [
    { id: '/jogador', label: 'Início', icon: House },
    { id: '/jogador/jogos', label: 'Jogos', icon: SoccerBall },
    { id: '/jogador/eventos', label: 'Eventos', icon: Calendar },
  ];

  const menuItems = usuario?.tipo === 'administrador' ? menuAdministrador : menuJogador;

  const handleLogout = () => {
    logout();
    navigateTo('/login');
  };

  return (
    <div className="hidden lg:flex flex-col w-64 bg-white border-r border-gray-200 h-[calc(100vh-4rem)] fixed left-0 top-16 z-40 shadow-md">
      {/* Menu de Navegação */}
      <nav className="flex-1 p-4 space-y-2 pt-6">
        {menuItems.map((item) => {
          const IconComponent = item.icon;
          const isActive = isActiveRoute(item.id);
          const isDisabled = item.disabled;
          const isAdminHome = usuario?.tipo === 'administrador' && item.id === '/admin';
          
          return (
            <Button
              key={item.id}
              variant="ghost"
              disabled={isDisabled}
              className={`w-full justify-start h-12 px-4 rounded-xl transition-all duration-300 ${
                isDisabled
                  ? 'text-gray-400 cursor-not-allowed opacity-50'
                  : isActive 
                    ? isAdminHome
                      ? 'bg-gradient-to-r from-[#4C1D95] to-[#3B82F6] text-white shadow-lg'
                      : 'bg-purple-600 text-white shadow-md'
                    : isAdminHome
                      ? 'text-gray-700 hover:text-white hover:bg-gradient-to-r hover:from-[#4C1D95] hover:to-[#3B82F6]'
                      : 'text-gray-600 hover:text-purple-600 hover:bg-purple-50'
              }`}
              onClick={() => !isDisabled && navigateTo(item.id)}
              title={isDisabled ? 'Funcionalidade em desenvolvimento' : ''}
            >
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center mr-3 transition-colors ${
                isAdminHome
                  ? isActive
                    ? 'bg-white/15'
                    : 'bg-[#4C1D95]/10'
                  : isActive
                    ? 'bg-white/10'
                    : 'bg-transparent'
              }`}>
                <IconComponent className="w-5 h-5" />
              </div>
              <span className={`font-medium ${isAdminHome ? 'font-semibold' : ''}`}>{item.label}</span>
            </Button>
          );
        })}
      </nav>

      {/* Footer com Perfil e Logout */}
      <div className="p-4 border-t border-gray-200 space-y-3">
        {/* Notificações e Busca */}
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" className="flex-1 p-2">
            <MagnifyingGlass className="w-4 h-4" />
          </Button>
          <div className="relative">
            <Button variant="ghost" size="sm" className="p-2">
              <Bell className="w-5 h-5 text-gray-600" />
            </Button>
            <span className="absolute w-4 h-4 flex items-center justify-center rounded-full bg-[#EF4444] text-white text-xs font-bold border-2 border-white" 
                  style={{top: 0, right: 0, transform: 'translate(20%, -20%)'}}>
              3
            </span>
          </div>
        </div>

        {/* Perfil do Usuário */}
        <div className="flex items-center space-x-3 p-3 rounded-xl bg-gray-50">
          {usuario?.tipo === 'administrador' ? (
            <button
              onClick={() => navigateTo('/admin/configuracoes')}
              className="flex items-center space-x-3 cursor-pointer flex-1"
            >
              <img
                src={usuario?.foto || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face'}
                alt={usuario?.nome}
                className="w-10 h-10 rounded-xl object-cover border-2"
                style={{ borderColor: '#1E293B' }}
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">{usuario?.nome}</p>
                <p className="text-xs text-primary font-medium capitalize">{usuario?.tipo}</p>
              </div>
            </button>
          ) : (
            <Dialog open={isPerfilJogadorOpen} onOpenChange={setIsPerfilJogadorOpen}>
              <DialogTrigger asChild>
                <div className="flex items-center space-x-3 flex-1 cursor-pointer">
                  <img
                    src={usuario?.foto || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face'}
                    alt={usuario?.nome}
                    className="w-10 h-10 rounded-xl object-cover border-2"
                    style={{ borderColor: '#1E293B' }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">{usuario?.nome}</p>
                    <p className="text-xs text-primary font-medium capitalize">{usuario?.tipo}</p>
                  </div>
                </div>
              </DialogTrigger>
              <DialogContent className="w-[95vw] max-w-md max-h-[90vh] rounded-xl bg-white border-0 shadow-2xl backdrop-blur-sm mx-auto my-auto">
                <div className="flex flex-col h-full max-h-[90vh]">
                  <DialogHeader className="text-center pb-4 pt-3 flex-shrink-0">
                    <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-4">
                      <User className="w-8 h-8 text-white" />
                    </div>
                    <DialogTitle className="text-2xl font-bold text-gray-900">{usuario?.nome || 'Perfil do Jogador'}</DialogTitle>
                    <DialogDescription className="text-gray-600 mt-2 text-base">
                      {usuario?.email || 'email@exemplo.com'}
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="flex-1 overflow-y-auto px-6 py-4">
                    <div className="space-y-6">
                      {/* Estatísticas */}
                      <div className="grid grid-cols-3 gap-4">
                        <Card className="gradient-card shadow-card">
                          <CardContent className="p-4 text-center">
                            <p className="text-2xl font-bold text-primary">32</p>
                            <p className="text-xs text-muted-foreground">Jogos</p>
                          </CardContent>
                        </Card>
                        <Card className="gradient-card shadow-card">
                          <CardContent className="p-4 text-center">
                            <p className="text-2xl font-bold text-primary">12</p>
                            <p className="text-xs text-muted-foreground">Eventos</p>
                          </CardContent>
                        </Card>
                        <Card className="gradient-card shadow-card">
                          <CardContent className="p-4 text-center">
                            <p className="text-2xl font-bold text-primary">5</p>
                            <p className="text-xs text-muted-foreground">Conquistas</p>
                          </CardContent>
                        </Card>
                      </div>

                      {/* Avatar e informações */}
                      <Card className="shadow-card">
                        <CardContent className="p-4 sm:p-6">
                          <div className="flex flex-col items-center gap-3">
                            <img
                              src={usuario?.foto || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=96&h=96&fit=crop&crop=face'}
                              alt={usuario?.nome}
                              className="w-24 h-24 rounded-full object-cover border-4 border-primary/20"
                            />
                            <div className="text-center">
                              <span className="text-sm text-primary font-semibold capitalize flex items-center justify-center gap-1">
                                <User className="w-4 h-4" />
                                {usuario?.tipo || 'Jogador'}
                              </span>
                            </div>
                            <Button size="sm" variant="outline" className="flex items-center gap-1">
                              <PencilSimple className="w-4 h-4" /> Editar Perfil
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                        
                      {/* Conquistas */}
                      <Card className="shadow-card">
                        <CardContent className="p-4 sm:p-6">
                          <h3 className="text-base font-semibold mb-3 text-[#1E293B] flex items-center gap-2">
                            <Trophy className="w-5 h-5 text-yellow-500" /> Conquistas Recentes
                          </h3>
                          <div className="flex flex-wrap gap-2">
                            <Badge className="flex items-center gap-1 px-3 py-1 text-xs bg-primary/10 text-primary font-medium rounded-full">
                              <Trophy className="w-4 h-4 text-yellow-500" /> Artilheiro <span className="ml-1 text-muted-foreground">(14/06/2024)</span>
                            </Badge>
                            <Badge className="flex items-center gap-1 px-3 py-1 text-xs bg-primary/10 text-primary font-medium rounded-full">
                              <Medal className="w-4 h-4 text-purple-500" /> Presença VIP <span className="ml-1 text-muted-foreground">(09/07/2024)</span>
                            </Badge>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                  
                  <div className="space-y-3 pt-6 mt-6 border-t border-gray-100 px-6 pb-6 flex-shrink-0">
                    <Button 
                      variant="outline" 
                      onClick={() => setIsPerfilJogadorOpen(false)}
                      className="w-full h-12 text-base border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all duration-100"
                    >
                      Fechar
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setIsPerfilJogadorOpen(false);
                        handleLogout();
                      }}
                      className="w-full h-12 text-base border-red-200 text-red-600 hover:border-red-300 hover:bg-red-50 transition-all duration-100"
                    >
                      <SignOut className="w-4 h-4 mr-2" />
                      Sair da Conta
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          )}
          
          <Button
            variant="ghost"
            size="sm"
            className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50"
            onClick={handleLogout}
          >
            <SignOut className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar; 