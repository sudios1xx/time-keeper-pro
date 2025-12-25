// Componente principal da aplicação que gerencia o fluxo de autenticação
import React, { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Login from '../components/Login';
import SelecaoPerfil from '../components/SelecaoPerfil';
import DashboardAdmin from '@/features/admin/components/AdminDashboardPage';
import DashboardJogador from '@/features/profile/components/PlayerDashboardPage';
import LoadingSpinner from '../components/ui/loading-spinner';
import { logger } from '../utils/logger';

const MainApp: React.FC = () => {
  const { usuario, perfilSelecionado, isLoading } = useAuth();

  useEffect(() => {
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

    if (usuario) {
      registerSync();
    }
  }, [usuario]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-primary">
        <LoadingSpinner size="lg" text="Inicializando..." className="text-white" />
      </div>
    );
  }

  if (!usuario) {
    return <Login />;
  }

  if (!perfilSelecionado) {
    return <SelecaoPerfil />;
  }

  if (usuario.tipo === 'administrador') {
    return <DashboardAdmin />;
  }

  return <DashboardJogador />;
};

export default MainApp;