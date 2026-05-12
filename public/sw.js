const CACHE_NAME = "chalakchamps-cache-v2";

const URLS_TO_CACHE = [
  "/",
  "/en",
  "/bn",
  "/manifest.json",
  "/icon.png", // From your manifest
  "/icon.png", // From your manifest
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(URLS_TO_CACHE);
    }),
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames.map((cacheName) => {
          // This deletes old caches (e.g., v1) automatically when v2 is installed
          if (cacheName !== CACHE_NAME) {
            console.log("Deleting old cache:", cacheName);
            return caches.delete(cacheName);
          }
          return null;
        }),
      ),
    ),
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const { request } = event;

  // Only handle GET requests
  if (request.method !== "GET") {
    return;
  }

  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      // Return cached version if available
      if (cachedResponse) {
        return cachedResponse;
      }

      // Otherwise, fetch from network
      return fetch(request)
        .then((networkResponse) => {
          // Don't cache non-successful responses or opaque (cross-origin) responses
          if (
            !networkResponse ||
            networkResponse.status !== 200 ||
            networkResponse.type !== "basic"
          ) {
            return networkResponse;
          }

          // Clone the response because it can only be consumed once
          const responseToCache = networkResponse.clone();

          // Add to cache for future visits
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseToCache);
          });

          return networkResponse;
        })
        .catch(() => {
          // If both cache and network fail, you can return a custom offline page here
          // Currently returning 503 status
          return new Response("Offline", { status: 503 });
        });
    }),
  );
});
