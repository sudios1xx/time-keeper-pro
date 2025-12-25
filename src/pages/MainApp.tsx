// Componente principal da aplicação que gerencia o fluxo de autenticação
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Login from '../components/Login';
import SelecaoPerfil from '../components/SelecaoPerfil';
import Layout from '../components/Layout';
import DashboardAdmin from '../components/admin/DashboardAdmin';
import DashboardJogador from '../components/player/DashboardJogador';
import PerfilJogador from '../components/player/PerfilJogador';
import LoadingSpinner from '../components/ui/loading-spinner';
import { logger } from '../utils/logger';

const MainApp: React.FC = () => {
  const { usuario, perfilSelecionado, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');

  useEffect(() => {
    // Função para registrar o Background Sync
    const registerSync = async () => {
      if ('serviceWorker' in navigator && 'SyncManager' in window) {
        try {
          const registration = await navigator.serviceWorker.ready;
          await registration.sync.register('sync-data');
          logger.log('Background Sync registrado com sucesso para "sync-data"');
        } catch (err) {
          logger.error('Falha ao registrar Background Sync:', err);
        }
      } else {
        logger.log('Background Sync não é suportado neste navegador.');
      }
    };

    // Só registra o sync se tiver um usuário logado
    if (usuario) {
      registerSync();
    }
  }, [usuario]); // Executa quando o estado do usuário muda

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-primary">
        <LoadingSpinner size="lg" text="Inicializando..." className="text-white" />
      </div>
    );
  }

  // Não logado - mostrar tela de login
  if (!usuario) {
    return <Login />;
  }

  // Logado mas sem perfil selecionado
  if (!perfilSelecionado) {
    return <SelecaoPerfil />;
  }

  // Função para renderizar o conteúdo baseado na aba ativa
  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return usuario.tipo === 'administrador' ? (
          <DashboardAdmin onNavigate={setActiveTab} />
        ) : (
          <DashboardJogador onNavigate={setActiveTab} />
        );
      
      case 'jogadores':
        if (usuario.tipo === 'administrador') {
          const GestaoJogadores = React.lazy(() => import('../components/admin/GestaoJogadores'));
          return (
            <React.Suspense fallback={<LoadingSpinner size="md" text="Carregando gestão..." className="py-12" />}>
              <GestaoJogadores />
            </React.Suspense>
          );
        }
        // Jogadores não têm acesso à gestão de jogadores
        return (
          <div className="text-center py-12">
            <div className="text-muted-foreground">
              <p>Acesso restrito a administradores</p>
            </div>
          </div>
        );
        
      case 'jogos':
        if (usuario.tipo === 'administrador') {
          const GestaoJogos = React.lazy(() => import('../components/admin/GestaoJogos'));
          return (
            <React.Suspense fallback={<LoadingSpinner size="md" text="Carregando jogos..." className="py-12" />}>
              <GestaoJogos />
            </React.Suspense>
          );
        } else {
          const JogosJogador = React.lazy(() => import('../components/player/JogosJogador'));
          return (
            <React.Suspense fallback={<LoadingSpinner size="md" text="Carregando jogos..." className="py-12" />}>
              <JogosJogador />
            </React.Suspense>
          );
        }
        
      case 'eventos':
        if (usuario.tipo === 'administrador') {
          const GestaoEventos = React.lazy(() => import('../components/admin/GestaoEventos'));
          return (
            <React.Suspense fallback={<LoadingSpinner size="md" text="Carregando eventos..." className="py-12" />}>
              <GestaoEventos />
            </React.Suspense>
          );
        } else {
          const EventosJogador = React.lazy(() => import('../components/player/EventosJogador'));
          return (
            <React.Suspense fallback={<LoadingSpinner size="md" text="Carregando eventos..." className="py-12" />}>
              <EventosJogador />
            </React.Suspense>
          );
        }
        
      // Central removida (sem backend ainda)
        
      case 'perfil':
        if (usuario.tipo === 'jogador') {
          return <PerfilJogador />;
        }
        // Administradores não têm perfil de jogador
        return (
          <div className="text-center py-12">
            <div className="text-muted-foreground">
              <p>Perfil disponível apenas para jogadores</p>
            </div>
          </div>
        );
        
      default:
        return usuario.tipo === 'administrador' ? (
          <DashboardAdmin onNavigate={setActiveTab} />
        ) : (
          <DashboardJogador onNavigate={setActiveTab} />
        );
    }
  };

  return (
    <Layout 
      activeTab={activeTab} 
      onTabChange={setActiveTab}
    >
      {renderContent()}
    </Layout>
  );
};

export default MainApp;