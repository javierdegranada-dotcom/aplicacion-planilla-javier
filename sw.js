/* ================================================
   Service Worker — Planilla Tiro con Arco Gaia
   Versión: 1.0
   Estrategia: Cache-first (funciona sin internet)
   ================================================ */

const CACHE_NAME = "arco-gaia-v7";

// Archivos que se guardan en caché al instalar
const ARCHIVOS_CACHE = [
  "/aplicacion-planilla-javier/index.html",
  "/aplicacion-planilla-javier/manifest.json",
  "/aplicacion-planilla-javier/icon-192x192.png",
  "/aplicacion-planilla-javier/icon-512x512.png",
  "/aplicacion-planilla-javier/apple-touch-icon.png",
  "/aplicacion-planilla-javier/favicon-32x32.png"
];

// Instalación: guardar todos los archivos en caché
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("[SW] Guardando archivos en caché...");
      return cache.addAll(ARCHIVOS_CACHE);
    })
  );
  self.skipWaiting();
});

// Activación: limpiar cachés antiguas si hay nueva versión
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => {
            console.log("[SW] Eliminando caché antigua:", key);
            return caches.delete(key);
          })
      )
    )
  );
  self.clients.claim();
});

// Fetch: servir desde caché (sin internet)
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) {
        return cached; // Servir desde caché
      }
      // Si no está en caché, intentar red
      return fetch(event.request).catch(() => {
        // Sin red y sin caché: devolver el HTML principal como fallback
        return caches.match("/aplicacion-planilla-javier/index.html");
      });
    })
  );
});
