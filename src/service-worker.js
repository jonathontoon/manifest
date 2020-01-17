const cacheName = "manifest-1.0.0";

self.addEventListener('install', function (e) {
  e.waitUntil(
    caches.open(cacheName).then(function (cache) {
      return cache.addAll([
        "./",
        "./index.html",
        "./js.00a46daa.js",
        "./js.00a46daa.css"
      ]).then(function () { self.skipWaiting(); });
    })
  );
});

self.addEventListener("activate", function (event) {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", function (event) {
  event.respondWith(
    caches.open(cacheName)
      .then(function (cache) { cache.match(event.request, { ignoreSearch: true }) })
      .then(function (response) { return response || fetch(event.request); })
  );
});