// First-party static assets only. Never cache third-party media or embeds.
const CACHE = "gitiasei-community-map-v021-20261125";
const ASSETS = ["./", "./index.html", "./src/styles.css", "./src/catalog.mjs", "./src/core.mjs", "./src/app.mjs", "./src/directory.mjs", "./src/preview.mjs", "./src/official.mjs", "./src/research-preview.mjs", "./data/video-links.json", "./city.svg", "./manifest.webmanifest", "./icon.svg"];
self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(ASSETS)));
  self.skipWaiting();
});
self.addEventListener("activate", (event) => {
  event.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key)))));
  self.clients.claim();
});
self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET" || new URL(request.url).origin !== self.location.origin) return;
  event.respondWith(caches.match(request).then((cached) => cached || fetch(request)));
});
