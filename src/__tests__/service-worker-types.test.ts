// Teste para verificar se os tipos do Service Worker estão corretos

// Verifica se o Service Worker está disponível no navegador
declare global {
  interface Window {
    SyncManager: any;
  }
}

describe('Service Worker Types', () => {
  it('deve ter os tipos corretos para o Service Worker', async () => {
    // Verifica se o Service Worker está disponível
    if ('serviceWorker' in navigator) {
      // Verifica se o SyncManager está disponível
      const syncSupported = 'SyncManager' in window;
      
      if (syncSupported) {
        // Tenta obter o registration do Service Worker
        const registration = await navigator.serviceWorker.ready;
        
        // Verifica se a propriedade sync existe e é do tipo correto
        expect(registration.sync).toBeDefined();
        expect(typeof registration.sync.register).toBe('function');
      } else {
        console.warn('SyncManager não está disponível neste navegador');
      }
    } else {
      console.warn('Service Worker não está disponível neste navegador');
    }
  });
});
