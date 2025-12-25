import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Hook ultra-agressivo que força o scroll ao topo
 * Usa múltiplos métodos para detectar mudanças de rota
 */
export const useScrollToTopAggressive = () => {
  const { pathname } = useLocation();
  const prevPathname = useRef(pathname);
  const scrollAttempts = useRef(0);

  useEffect(() => {
    // Só executar se a rota realmente mudou
    if (prevPathname.current !== pathname) {
      prevPathname.current = pathname;
      scrollAttempts.current = 0;
      
      // Função que força o scroll ao topo usando todos os métodos possíveis
      const forceScrollToTop = () => {
        scrollAttempts.current++;
        
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
        
        // Método 5: window.pageYOffset
        if (window.pageYOffset > 0) {
          window.scrollTo(0, 0);
        }
        
        // Método 6: window.scrollY
        if (window.scrollY > 0) {
          window.scrollTo(0, 0);
        }
        
        // Método 7: scrollIntoView
        try {
          document.body.scrollIntoView({ behavior: 'instant' });
        } catch {
          // Ignorar erro
        }
        
        // Método 8: Usar window.scroll
        try {
          window.scroll(0, 0);
        } catch {
          // Ignorar erro
        }
      };

      // Executar imediatamente
      forceScrollToTop();
      
      // Executar múltiplas vezes para garantir
      const timeouts = [
        setTimeout(forceScrollToTop, 0),
        setTimeout(forceScrollToTop, 10),
        setTimeout(forceScrollToTop, 50),
        setTimeout(forceScrollToTop, 100),
        setTimeout(forceScrollToTop, 200),
        setTimeout(forceScrollToTop, 500),
        setTimeout(forceScrollToTop, 1000),
        setTimeout(forceScrollToTop, 2000)
      ];
      
      return () => {
        timeouts.forEach(clearTimeout);
      };
    }
  }, [pathname]);

  // Adicionar listener global para detectar mudanças de rota
  useEffect(() => {
    const handleRouteChange = () => {
      const newPath = window.location.pathname;
      if (newPath !== prevPathname.current) {
        prevPathname.current = newPath;
        
        // Forçar scroll ao topo
        window.scrollTo(0, 0);
        if (document.documentElement) {
          document.documentElement.scrollTop = 0;
        }
        if (document.body) {
          document.body.scrollTop = 0;
        }
      }
    };

    // Listener para mudanças de popstate
    window.addEventListener('popstate', handleRouteChange);
    
    // Listener para mudanças de pushstate
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;
    
    history.pushState = function(...args) {
      originalPushState.apply(history, args);
      handleRouteChange();
    };
    
    history.replaceState = function(...args) {
      originalReplaceState.apply(history, args);
      handleRouteChange();
    };
    
    return () => {
      window.removeEventListener('popstate', handleRouteChange);
      history.pushState = originalPushState;
      history.replaceState = originalReplaceState;
    };
  }, []);
}; 