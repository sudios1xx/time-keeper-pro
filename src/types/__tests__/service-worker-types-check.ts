// Este arquivo verifica se os tipos do Service Worker estão corretos
// Não é um teste executável, apenas uma verificação de tipos

// Verificação de tipos para ServiceWorkerRegistration
const testServiceWorkerRegistration = async () => {
  if ('serviceWorker' in navigator) {
    const registration = await navigator.serviceWorker.ready;
    
    // Verifica se a propriedade sync está disponível
    if ('sync' in registration) {
      // Verifica se o método register está disponível
      if (typeof registration.sync.register === 'function') {
        console.log('ServiceWorkerRegistration.sync está corretamente tipado');
      } else {
        console.error('ServiceWorkerRegistration.sync.register não é uma função');
      }
    } else {
      console.error('ServiceWorkerRegistration não tem a propriedade sync');
    }
  } else {
    console.warn('Service Worker não suportado neste navegador');
  }
};

// Executa a verificação
testServiceWorkerRegistration().catch(console.error);
