import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Hook que força o scroll ao topo sempre que a rota muda
 * Usa múltiplos métodos para garantir que funcione
 */
export const useForceScrollTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Função que força o scroll ao topo usando todos os métodos possíveis
    const forceScrollToTop = () => {
      // Método 1: window.scrollTo
      window.scrollTo(0, 0);
      
      // Método 2: window.scrollTo com smooth
      try {
        window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
      } catch {
        // Fallback se smooth não for suportado
        window.scrollTo(0, 0);
      }
      
      // Método 3: document.documentElement
      if (document.documentElement) {
        document.documentElement.scrollTop = 0;
        document.documentElement.scrollLeft = 0;
      }
      
      // Método 4: document.body
      if (document.body) {
        document.body.scrollTop = 0;
        document.body.scrollLeft = 0;
      }
      
      // Método 5: window.scrollY
      if (window.scrollY > 0) {
        window.scrollTo(0, 0);
      }
    };

    // Executar imediatamente
    forceScrollToTop();
    
    // Executar múltiplas vezes para garantir
    const timeouts = [
      setTimeout(forceScrollToTop, 10),
      setTimeout(forceScrollToTop, 50),
      setTimeout(forceScrollToTop, 100),
      setTimeout(forceScrollToTop, 200),
      setTimeout(forceScrollToTop, 500)
    ];
    
    return () => {
      timeouts.forEach(clearTimeout);
    };
  }, [pathname]);
}; 