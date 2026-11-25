// Self-hosted PWA: offline map pack, but fresh shell on each online visit.
const CACHE = "gitiasei-immersive-v04-20261125";
const ASSETS = ["./", "./index.html", "./src/styles.css", "./src/catalog.mjs", "./src/core.mjs", "./src/app.mjs", "./src/directory.mjs", "./src/preview.mjs", "./src/official.mjs", "./src/research-preview.mjs", "./src/native-map.mjs", "./src/native-map-core.mjs", "./data/map-land.v1.json", "./data/map-roads.v1.json", "./data/map-pins.v1.json", "./data/video-links.json", "./city.svg", "./manifest.webmanifest", "./icon.svg", "./icon-192.png", "./icon-512.png"];
self.addEventListener("install", event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(ASSETS)));
  self.skipWaiting();
});
self.addEventListener("activate", event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key !== CACHE).map(key => caches.delete(key)))));
  self.clients.claim();
});
self.addEventListener("fetch", event => {
  const request = event.request;
  if (request.method !== "GET" || new URL(request.url).origin !== self.location.origin || request.headers.has("range")) return;
  const url = new URL(request.url);
  // Immutable projection assets are costly to re-download; SW version changes refresh them.
  if (/\/data\/map-(land|roads|pins)\.v1\.json$/.test(url.pathname)) {
    event.respondWith(caches.match(request).then(cached => cached || fetch(request).then(response => {
      if (response.ok) {
        const copy=response.clone();
        event.waitUntil(caches.open(CACHE).then(cache => cache.put(request,copy)));
      }
      return response;
    })));
    return;
  }
  // Network-first shell: a deployed update must not remain stuck behind a stale cache.
  event.respondWith(fetch(request).then(response => {
    if (response.ok) {
      const copy=response.clone();
      event.waitUntil(caches.open(CACHE).then(cache => cache.put(request,copy)));
    }
    return response;
  }).catch(async () => (await caches.match(request)) || Response.error()));
});
