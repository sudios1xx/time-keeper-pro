// Extensões de tipo para Service Worker e APIs relacionadas
declare interface ServiceWorkerRegistration {
  readonly sync: SyncManager;
}

declare interface SyncManager {
  getTags(): Promise<string[]>;
  register(tag: string): Promise<void>;
}

declare interface ServiceWorkerGlobalScope {
  registration: ServiceWorkerRegistration;
}

// Permite o uso de 'self' como ServiceWorkerGlobalScope
declare const self: ServiceWorkerGlobalScope;
