const CACHE_PREFIX = "chalakchamps-cache-";
const CACHE_VERSION = "v2";
const CACHE_NAME = `${CACHE_PREFIX}${CACHE_VERSION}`;

const URLS_TO_CACHE = [
  "/manifest.json",
  "/icon.png",
];

// Install: pre-cache only non-HTML assets we want offline
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(URLS_TO_CACHE);
    }),
  );
  // In case we receive a SKIP_WAITING message instead of relying on install
});

// Activate: remove old caches and take control
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheName.startsWith(CACHE_PREFIX)) return null;
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
          return null;
        }),
      ),
    ),
  );
  self.clients.claim();
});

// Listen for messages from the page (used to trigger skipWaiting)
self.addEventListener("message", (event) => {
  if (!event.data) return;
  if (event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

// Fetch handler: network-first for navigations (HTML), cache-first for others
self.addEventListener("fetch", (event) => {
  const { request } = event;

  if (request.method !== "GET") return;

  // Determine if request is a navigation to HTML
  const acceptHeader = request.headers.get("accept") || "";
  const isNavigation = request.mode === "navigate" || acceptHeader.includes("text/html");

  if (isNavigation) {
    // Network-first: try network, fallback to cache
    event.respondWith(
      fetch(request)
        .then((networkResponse) => {
          // If valid response, update cache for future offline use
          if (networkResponse && networkResponse.status === 200) {
            const responseClone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return networkResponse;
        })
        .catch(() => caches.match(request).then((cached) => cached || new Response("Offline", { status: 503 }))),
    );
    return;
  }

  // For other requests (static assets) use cache-first, falling back to network
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      if (cachedResponse) return cachedResponse;
      return fetch(request)
        .then((networkResponse) => {
          if (!networkResponse || networkResponse.status !== 200 || networkResponse.type === "opaque") {
            return networkResponse;
          }
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, responseToCache));
          return networkResponse;
        })
        .catch(() => new Response("Offline", { status: 503 }));
    }),
  );
});
