import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { forceScrollToTopManual } from '../utils/scroll-manager';

export const useNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { usuario } = useAuth();

  const navigateTo = (path: string) => {
    // Verificar se o usuário tem permissão para acessar a rota
    if (!usuario) {
      navigate('/login');
      return;
    }

    // Verificar se é uma rota de admin
    if (path.startsWith('/admin') && usuario.tipo !== 'administrador') {
      navigate('/jogador');
      return;
    }

    // Verificar se é uma rota de jogador
    if (path.startsWith('/jogador') && usuario.tipo !== 'jogador') {
      navigate('/admin');
      return;
    }

    // Forçar scroll ao topo antes de navegar
    forceScrollToTopManual();
    
    // Navegar para a nova rota
    navigate(path);
    
    // Forçar scroll ao topo novamente após navegação
    setTimeout(forceScrollToTopManual, 10);
    setTimeout(forceScrollToTopManual, 50);
    setTimeout(forceScrollToTopManual, 100);
  };

  const navigateToHome = () => {
    if (!usuario) {
      navigate('/login');
      return;
    }

    // Forçar scroll ao topo antes de navegar
    forceScrollToTopManual();

    if (usuario.tipo === 'administrador') {
      navigate('/admin');
    } else {
      navigate('/jogador');
    }
    
    // Forçar scroll ao topo novamente após navegação
    setTimeout(forceScrollToTopManual, 10);
    setTimeout(forceScrollToTopManual, 50);
    setTimeout(forceScrollToTopManual, 100);
  };

  const isActiveRoute = (path: string) => {
    return location.pathname === path;
  };

  const canAccessRoute = (path: string) => {
    if (!usuario) return false;
    
    if (path.startsWith('/admin')) {
      return usuario.tipo === 'administrador';
    }
    
    if (path.startsWith('/jogador')) {
      return usuario.tipo === 'jogador';
    }
    
    return true;
  };

  return {
    navigateTo,
    navigateToHome,
    isActiveRoute,
    canAccessRoute,
    currentPath: location.pathname
  };
}; 