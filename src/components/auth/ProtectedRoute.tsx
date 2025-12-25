import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import LoadingSpinner from '../ui/loading-spinner';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
  redirectTo?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  allowedRoles = ['administrador', 'jogador'],
  redirectTo 
}) => {
  const { usuario, perfilSelecionado, isLoading } = useAuth();
  const location = useLocation();

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-primary">
        <LoadingSpinner size="lg" text="Inicializando..." className="text-white" />
      </div>
    );
  }

  // Não logado - redirecionar para login
  if (!usuario) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Logado mas sem perfil selecionado
  if (!perfilSelecionado) {
    return <Navigate to="/selecao-perfil" replace />;
  }

  // Verificar permissões
  if (!allowedRoles.includes(usuario.tipo)) {
    // Redirecionar para rota apropriada baseada no tipo de usuário
    const targetRoute = redirectTo || (usuario.tipo === 'administrador' ? '/admin' : '/jogador');
    return <Navigate to={targetRoute} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute; 