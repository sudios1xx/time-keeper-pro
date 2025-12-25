const CACHE_NAME = 'dvfoot-cache-v2';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icone.svg',
  '/js/index-BvbRORhu.js',
  '/js/chunk-DTYO7g0m.js',
  '/js/EventosJogador.tsx-9Vh5-8JD.js',
  '/js/GestaoJogos.tsx-Cxf6VCqG.js',
  '/js/GestaoNoticias.tsx-CpeJvx6H.js',
  '/js/NoticiasJogador.tsx-CrBQPv0k.js',
  '/js/chunk-CFz_eOVL.js',
  '/js/GestaoEventos.tsx-Bv5jlRli.js',
  '/js/GestaoJogadores.tsx-COA6ScnZ.js',
  '/js/JogosJogador.tsx-DAutYxCk.js',
  '/js/chunk-CngY6Nk1.js',
  '/js/chunk-JaNks2A5.js',
  '/js/chunk-DJcYfsJ3.js',
  '/css/index-n6tUk8xA.css'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => response || fetch(event.request))
  );
}); 