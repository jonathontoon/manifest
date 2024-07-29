import { manifest, version } from "@parcel/service-worker";

self.addEventListener("install", function (e) {
  e.waitUntil(
    caches.open(version).then(function (cache) {
      return cache.addAll(manifest).then(function () { self.skipWaiting(); });
    })
  );
});

self.addEventListener("activate", function (e) {
  e.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", function (e) {
  e.respondWith(
    caches.open(version)
      .then(function (cache) { return cache.match(e.request, { ignoreSearch: true }); })
      .then(function (response) { return response || fetch(e.request); })
  );
});
