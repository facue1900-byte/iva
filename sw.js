/**
 * Service worker: hace que la app ABRA sin señal.
 *
 * Cachea sólo el cascarón (el HTML, el manifest, el icono). Las respuestas de
 * la API NO se cachean nunca: un saldo de IVA viejo mostrado como actual es
 * peor que no mostrar nada. Si no hay señal, la pantalla dice que no se pudo
 * conectar — y la carga de facturas sigue andando porque va a la cola.
 */
const CACHE = 'iva-estevez-v1';
const SHELL = ['./', './index.html', './manifest.json', './icono.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);

  // Todo lo que no sea de este sitio (o sea, la API de Apps Script) pasa
  // derecho a la red, sin tocar el caché.
  if (url.origin !== location.origin || e.request.method !== 'GET') return;

  // El cascarón: red primero para agarrar actualizaciones, caché si no hay señal.
  e.respondWith(
    fetch(e.request)
      .then(r => {
        const copia = r.clone();
        caches.open(CACHE).then(c => c.put(e.request, copia));
        return r;
      })
      .catch(() => caches.match(e.request).then(r => r || caches.match('./index.html')))
  );
});
