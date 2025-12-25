// Layout moderno com navegação baseada em rotas
import React from 'react';
import Navigation from './navigation/Navigation';
import Sidebar from './navigation/Sidebar';
import { useAuth } from '../contexts/AuthContext';
import { Trophy, Bell, MagnifyingGlass } from 'phosphor-react';
import { Button } from './ui/button';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { usuario } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar para Desktop */}
      <Sidebar />
      
      {/* Navegação Mobile */}
      <Navigation />
      
      {/* Cabeçalho Desktop - Full width */}
      <header className="hidden lg:block fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 h-16 shadow-md">
        <div className="flex h-full items-center justify-between px-6">
          {/* Lado esquerdo - Título da página */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center shadow-sm">
                <Trophy className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  Jogo em Foco
                </h1>
                <p className="text-xs text-gray-500 font-medium">
                  {usuario?.tipo === 'administrador' ? '⚡ Admin' : '🎯 Pro'}
                </p>
              </div>
            </div>
          </div>
          
          {/* Lado direito - Ações */}
          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="sm" className="p-2">
              <MagnifyingGlass className="w-5 h-5" />
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
            <div className="flex items-center space-x-3 p-2">
              <div className="text-right">
                <p className="text-sm font-semibold text-gray-900">{usuario?.nome}</p>
                <p className="text-xs text-purple-600 font-medium capitalize">{usuario?.tipo}</p>
              </div>
              <img
                src={usuario?.foto || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face'}
                alt={usuario?.nome}
                className="w-8 h-8 rounded-full object-cover border-2 border-gray-200"
              />
            </div>
          </div>
        </div>
      </header>
      
      {/* Conteúdo Principal */}
      <main className="lg:ml-64 pt-12 sm:pt-14 lg:pt-16 px-3 sm:px-6 py-4 sm:py-8 pb-20 lg:pb-8 animate-fade-in min-h-screen bg-gray-50/50">
        <div className="space-y-4 sm:space-y-8 max-w-full">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;