// service-worker.js
// ✅ IMPORTANTE: quando você fizer alterações grandes no sistema (index/laudo),
// aumente o número da versão abaixo para forçar atualização do cache.

const CACHE_VERSION = "si-laudos-v19"; // ✅ MUDE para v20, v21... quando atualizar
const CACHE_NAME = CACHE_VERSION;

// ✅ lista de arquivos essenciais do sistema
const APP_SHELL = [
  "./",
  "./index.html",
  "./laudo.html",
  "./manifest.json",

  // imagens do sistema
  "./img/logotipo.png",
  "./img/sesctopo.png",

  // selo do laudo
  "./logo/logotipo.png",

  // assinatura do laudo
  "./assinatura/ass.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((k) => (k !== CACHE_NAME ? caches.delete(k) : null))
      )
    )
  );
  self.clients.claim();
});

// ✅ estratégia: cache first, network fallback
self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;

  event.respondWith(
    caches.match(req).then((cached) => {
      if (cached) return cached;

      return fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(req, copy));
          return res;
        })
        .catch(() => cached);
    })
  );
});
