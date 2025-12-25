import { useEffect } from 'react';

/**
 * Hook personalizado para scrollar para o topo da página
 * Pode ser usado em componentes específicos quando necessário
 */
export const useScrollToTop = (dependencies: unknown[] = []) => {
  useEffect(() => {
    const scrollToTop = () => {
      // Método principal com smooth behavior
      window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
      
      // Fallback para navegadores que não suportam smooth
      setTimeout(() => {
        if (window.scrollY > 0) {
          window.scrollTo(0, 0);
        }
      }, 100);
    };

    // Executar imediatamente
    scrollToTop();
    
    // Executar novamente após um pequeno delay para garantir
    const timeoutId = setTimeout(scrollToTop, 50);
    
    return () => clearTimeout(timeoutId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);
}; 