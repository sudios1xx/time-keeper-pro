/**
 * Gerenciador global de scroll que força o scroll ao topo
 * sempre que detectar uma mudança de rota
 */

let currentPath = window.location.pathname;

// Função que força o scroll ao topo usando todos os métodos possíveis
const forceScrollToTop = () => {
  // Método 1: window.scrollTo
  window.scrollTo(0, 0);
  
  // Método 2: document.documentElement
  if (document.documentElement) {
    document.documentElement.scrollTop = 0;
    document.documentElement.scrollLeft = 0;
  }
  
  // Método 3: document.body
  if (document.body) {
    document.body.scrollTop = 0;
    document.body.scrollLeft = 0;
  }
  
  // Método 4: window.pageYOffset
  if (window.pageYOffset > 0) {
    window.scrollTo(0, 0);
  }
  
  // Método 5: window.scrollY
  if (window.scrollY > 0) {
    window.scrollTo(0, 0);
  }
  
  // Método 6: Usar scrollIntoView
  try {
    document.body.scrollIntoView({ behavior: 'instant' });
  } catch {
    // Ignorar erro
  }
};

// Listener para detectar mudanças de rota
const handleRouteChange = () => {
  const newPath = window.location.pathname;
  
  if (newPath !== currentPath) {
    currentPath = newPath;
    
    // Forçar scroll ao topo imediatamente
    forceScrollToTop();
    
    // Executar múltiplas vezes para garantir
    setTimeout(forceScrollToTop, 0);
    setTimeout(forceScrollToTop, 10);
    setTimeout(forceScrollToTop, 50);
    setTimeout(forceScrollToTop, 100);
    setTimeout(forceScrollToTop, 200);
    setTimeout(forceScrollToTop, 500);
    setTimeout(forceScrollToTop, 1000);
  }
};

// Inicializar o listener
export const initScrollManager = () => {
  let intervalId: number | null = null;
  let rafId: number | null = null;
  
  // Listener para mudanças de popstate (navegação do browser)
  window.addEventListener('popstate', handleRouteChange);
  
  // Listener para mudanças de pushstate (navegação programática)
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
  
  // Listener para mudanças de hash
  window.addEventListener('hashchange', handleRouteChange);
  
  // Listener para mudanças de URL usando MutationObserver
  let lastUrl = location.href;
  const observer = new MutationObserver(() => {
    const url = location.href;
    if (url !== lastUrl) {
      lastUrl = url;
      handleRouteChange();
    }
  });
  
  observer.observe(document, { subtree: true, childList: true });
  
  // Listener para mudanças de rota usando setInterval
  intervalId = window.setInterval(() => {
    const newPath = window.location.pathname;
    if (newPath !== currentPath) {
      handleRouteChange();
    }
  }, 100);
  
  // Listener para mudanças de rota usando requestAnimationFrame
  const checkRouteChange = () => {
    const newPath = window.location.pathname;
    if (newPath !== currentPath) {
      handleRouteChange();
    }
    rafId = requestAnimationFrame(checkRouteChange);
  };
  
  rafId = requestAnimationFrame(checkRouteChange);
  
  // Retornar função de cleanup
  return () => {
    window.removeEventListener('popstate', handleRouteChange);
    window.removeEventListener('hashchange', handleRouteChange);
    history.pushState = originalPushState;
    history.replaceState = originalReplaceState;
    observer.disconnect();
    if (intervalId !== null) {
      clearInterval(intervalId);
    }
    if (rafId !== null) {
      cancelAnimationFrame(rafId);
    }
  };
};

// Função para forçar scroll manualmente
export const forceScrollToTopManual = () => {
  forceScrollToTop();
}; 