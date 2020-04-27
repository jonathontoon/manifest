const cacheName = "manifest-1.0.0";

self.addEventListener("install", function (e) {
  e.waitUntil(
    caches.open(cacheName).then(function (cache) {
      return cache.addAll([
        "./",
        "./index.html",
        "./js.00a46daa.js",
        "./js.00a46daa.css",
        "favicon-16.a76ef598.png",
        "favicon-32.f19d3578.png",
        "favicon-48.d7bc7928.png",
        "favicon-57.83a678dc.png",
        "favicon-72.6280bbd5.png",
        "favicon-76.50a865a6.png",
        "favicon-96.2ff009b1.png",
        "favicon-120.0b2d969e.png",
        "favicon-128.b59a3681.png",
        "favicon-144.3f07b896.png",
        "favicon-152.91b30bc8.png",
        "favicon-167.f9b1d528.png",
        "favicon-180.2188ded0.png",
        "favicon-192.ae26388c.png",
        "favicon-228.98337c4a.png",
        "favicon-384.9fd968c5.png",
        "favicon-512.61aaf624.png",
        "favicon.3697f982.svg",
        "favicon.d42470cd.ico",
        "browserconfig.d20e1c21.xml"
      ]).then(function () { self.skipWaiting(); });
    })
  );
});

self.addEventListener("activate", function (e) {
  e.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", function (e) {
  e.respondWith(
    caches.open(cacheName)
      .then(function (cache) { return cache.match(e.request, { ignoreSearch: true }); })
      .then(function (response) { return response || fetch(e.request); })
  );
});
