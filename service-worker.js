/* =========================================================
   SI — Sistema de Informação • Laudos
   Service Worker (PWA) — GitHub Pages Friendly
   - Cache dos arquivos essenciais
   - Atualiza automaticamente em novo commit
   ========================================================= */

const CACHE_VERSION = "si-laudos-v1";
const CORE_ASSETS = [
  "./",
  "./index.html",
  "./laudo.html",
  "./manifest.json",

  // pastas (ajuste se mudar)
  "./logo/logotipo.png",
  "./img/sesctopo.png",
  "./img/rodape.png",
  "./assinatura/ass.png"
];

/**
 * Instala e cria cache inicial
 */
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_VERSION).then((cache) => cache.addAll(CORE_ASSETS))
  );
  self.skipWaiting();
});

/**
 * Ativa e remove caches antigos
 */
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((k) => k !== CACHE_VERSION)
          .map((k) => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

/**
 * Fetch strategy:
 * - HTML: network-first (para sempre pegar versão nova)
 * - Outros: cache-first (rápido/offline)
 */
self.addEventListener("fetch", (event) => {
  const req = event.request;
  const url = new URL(req.url);

  // somente GET
  if (req.method !== "GET") return;

  // ignora extensões e requests externos
  if (url.origin !== self.location.origin) return;

  const isHTML =
    req.headers.get("accept")?.includes("text/html") ||
    url.pathname.endsWith(".html") ||
    url.pathname === "/" ||
    url.pathname.endsWith("/");

  if (isHTML) {
    // network-first para HTML
    event.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE_VERSION).then((cache) => cache.put(req, copy));
          return res;
        })
        .catch(() => caches.match(req).then((cached) => cached || caches.match("./index.html")))
    );
    return;
  }

  // cache-first para assets
  event.respondWith(
    caches.match(req).then((cached) => {
      if (cached) return cached;

      return fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE_VERSION).then((cache) => cache.put(req, copy));
          return res;
        })
        .catch(() => cached);
    })
  );
});

