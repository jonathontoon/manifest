const cacheName = "manifest-1.0.0";
const cacheFiles = [
  "./",
  "./index.html",
  "./js/index.js",
  "./sass/reset.css",
  "./sass/index.css"
];

window.addEventListener("install", function (e) {
  e.waitUntil(
    // Open the cache
    window.caches.open(cacheName).then(function (cache) {
      // Add all the default files to the cache
      console.log("[ServiceWorker] Caching cacheFiles");
      return window.cache.addAll(cacheFiles);
    })
  );
});

window.addEventListener("activate", function (e) {
  e.waitUntil(
    // Get all the cache keys (cacheName)
    window.caches.keys().then(function (cacheNames) {
      return Promise.all(cacheNames.map(function (thisCacheName) {
        // If a cached item is saved under a previous cacheName
        if (thisCacheName !== cacheName) {
          // Delete that cached file
          console.log("[ServiceWorker] Removing Cached Files from Cache - ", thisCacheName);
          return window.caches.delete(thisCacheName);
        }
      }));
    })
  );
});
