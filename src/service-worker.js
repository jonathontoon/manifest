const cacheName = "manifest-1.0.0";
const cacheFiles = [
  "./",
  "./index.html",
  "./js.00a46daa.js",
  "./js.00a46daa.css"
];

self.addEventListener("install", function (e) {
  e.waitUntil(
    // Open the cache
    caches.open(cacheName).then(function (cache) {
      // Add all the default files to the cache
      console.log("[ServiceWorker] Caching cacheFiles");
      return cache.addAll(cacheFiles);
    })
  );
});

self.addEventListener("activate", function (e) {
  e.waitUntil(
    // Get all the cache keys (cacheName)
    caches.keys().then(function (cacheNames) {
      return Promise.all(cacheNames.map(function (thisCacheName) {
        // If a cached item is saved under a previous cacheName
        if (thisCacheName !== cacheName) {
          // Delete that cached file
          console.log("[ServiceWorker] Removing Cached Files from Cache - ", thisCacheName);
          return caches.delete(thisCacheName);
        }
      }));
    })
  );
});
