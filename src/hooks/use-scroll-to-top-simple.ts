import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Hook simples que força o scroll ao topo quando a rota muda
 */
export const useScrollToTopSimple = () => {
  const { pathname } = useLocation();
  const prevPathname = useRef(pathname);

  useEffect(() => {
    // Só executar se a rota realmente mudou
    if (prevPathname.current !== pathname) {
      prevPathname.current = pathname;
      
      // Forçar scroll ao topo
      window.scrollTo(0, 0);
      
      // Executar novamente no próximo frame
      requestAnimationFrame(() => {
        window.scrollTo(0, 0);
      });
    }
  }, [pathname]);
}; 