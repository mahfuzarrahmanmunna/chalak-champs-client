const CACHE_PREFIX = "chalakchamps-cache-";
// ✅ BUMP VERSION to instantly wipe old stale caches on user's device
const CACHE_VERSION = "v3";
const CACHE_NAME = `${CACHE_PREFIX}${CACHE_VERSION}`;

// Install: pre-cache PWA shell assets
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(["/", "/manifest.json", "/icon.png"]);
    }),
  );
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

// ==========================================
// FETCH HANDLER (FIXED: Network-Only for APIs)
// ==========================================

self.addEventListener("fetch", (event) => {
  const { request } = event;

  // 1. Non-GET requests: ALWAYS pass through to network
  if (request.method !== "GET") {
    event.respondWith(
      fetch(request).catch(() => new Response("Offline", { status: 503 })),
    );
    return;
  }

  // 2. Determine if request is an HTML page navigation
  const acceptHeader = request.headers.get("accept") || "";
  const isNavigation =
    request.mode === "navigate" ||
    request.mode === "same-origin" ||
    acceptHeader.includes("text/html");

  // 3. API ROUTES: ALWAYS use network, NEVER cache
  // This prevents serving stale course/product data
  const url = new URL(request.url, self.location.origin);
  const isApiRequest = url.pathname.startsWith("/api/");

  if (isApiRequest) {
    event.respondWith(
      fetch(request).catch(() => new Response("Offline", { status: 503 })),
    );
    return;
  }

  // 4. HTML NAVIGATIONS: Network First (try network, fallback to cache for offline)
  if (isNavigation) {
    event.respondWith(
      fetch(request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const clone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          }
          return networkResponse;
        })
        .catch(() =>
          caches
            .match(request)
            .then(
              (cachedResponse) =>
                cachedResponse || new Response("Offline", { status: 503 }),
            ),
        ),
    );
    return;
  }

  // 5. STATIC ASSETS: Cache First (fast loading for JS, CSS, images)
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      if (cachedResponse) return cachedResponse;

      return fetch(request)
        .then((networkResponse) => {
          // Only cache valid, non-opaque responses
          if (
            networkResponse &&
            networkResponse.status === 200 &&
            networkResponse.type !== "opaque"
          ) {
            const clone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          }
          return networkResponse;
        })
        .catch(() => new Response("Offline", { status: 503 }));
    }),
  );
});
