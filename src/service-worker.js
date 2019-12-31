const cacheName = "memgrid";

self.addEventListener("install", (event) => {
	event.waitUntil(
		caches.open(cacheName).then((cache) => cache.addAll([
			"index.html"
		]).then(() => { self.skipWaiting(); }))
	);
});

self.addEventListener("activate", (event) => {
	event.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", (event) => {
	event.respondWith(
		caches.open(cacheName)
			.then((cache) => {
				cache.match(event.request, {
					ignoreSearch: true
				});
			})
			.then((response) => response || fetch(event.request))
	);
});
