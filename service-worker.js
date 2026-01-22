/* service-worker.js — SI Laudos (GitHub Pages)
   ✅ Cache + atualização elegante “Nova versão disponível — Atualizar”
*/

const CACHE_VERSION = "v7"; // ✅ MUDE ESSE NÚMERO A CADA COMMIT IMPORTANTE
const CACHE_NAME = `si-laudos-${CACHE_VERSION}`;

const ASSETS = [
  "./",
  "./index.html",
  "./laudo.html",
  "./manifest.json",

  // pastas
  "./css/style.css",

  // imagens
  "./img/sesctopo.png",
  "./img/rodape.png",
  "./logo/logotipo.png",
  "./assinatura/ass.png"
];

// ✅ instala e guarda cache
self.addEventListener("install", (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
});

// ✅ ativa e remove caches antigos
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.map((k) => (k !== CACHE_NAME ? caches.delete(k) : null)))
    ).then(() => self.clients.claim())
  );
});

// ✅ fetch: cache-first (rápido) + fallback
self.addEventListener("fetch", (event) => {
  const req = event.request;

  // ignora coisas externas
  if (!req.url.startsWith(self.location.origin)) return;

  event.respondWith(
    caches.match(req).then((cached) => {
      if (cached) return cached;

      return fetch(req)
        .then((res) => {
          // salva em cache
          const copy = res.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(req, copy));
          return res;
        })
        .catch(() => cached);
    })
  );
});

// ✅ mensagem do site para o SW
self.addEventListener("message", (event) => {
  if (!event.data) return;

  if (event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});
