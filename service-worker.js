const CACHE_NAME  = "idealbola-v1";
const urlsToCache = [
  "/",
  "/nav.html",
  "/index.html",
  "/klub.html",
  "/sw-register.js",
  "/manifest.json",
  "/pages/home.html",
  "/pages/klub.html",
  "/pages/saved.html",
  "/css/materialize.min.css",
  "/css/style.css",
  "/js/materialize.min.js",
  "/js/api.js",
  "/js/nav.js",
  "/js/idb.js",
  "/js/db.js",
  '/icons/ideal_icon_32x32.png',
  '/icons/ideal_logo_192x192.png',
  '/icons/ideal_logo_512x512.png',
  'https://fonts.googleapis.com/icon?family=Material+Icons',
  'https://fonts.gstatic.com/s/materialicons/v67/flUhRq6tzZclQEJ-Vdg-IuiaDsNc.woff2'
];
 
self.addEventListener("install", function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener("fetch", function(event) {
  const baseUrl = "https://api.football-data.org";

  if(event.request.url.indexOf(baseUrl) > -1) {
    event.respondWith(
      caches.open(CACHE_NAME).then(cache => {
        return fetch(event.request).then(response => {
          cache.put(event.request.url, response.clone());
          return response;
        })
      })
    );
  } else {
    event.respondWith(
      caches.match(event.request, { ignoreSearch: true }).then(response => {
        return response || fetch(event.request);
      })        
    );
  }
});

self.addEventListener("activate", function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheName != CACHE_NAME) {
            console.log("ServiceWorker: cache " + cacheName + " dihapus");
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

self.addEventListener('push', function(event){
  let body = "Push message no payload";

  if(event.data) {
    body = event.data.text();
  }

  const options = {
    body: body,
    badge: 'icons/ideal_logo_192x192.png',
    icon: 'icons/ideal_logo_192x192.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    }
  }

  event.waitUntil(
    self.registration.showNotification('ideaLBola', options)
  );
})