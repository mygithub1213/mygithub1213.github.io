importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.6.3/workbox-sw.js');

initPrecacheAndRoute = () => {
  workbox.precaching.precacheAndRoute([
    { url: '/', revision: '1' },
    { url: '/nav.html', revision: '1' },
    { url: '/index.html', revision: '1' },
    { url: '/klub.html', revision: '1' },
    { url: '/sw-register.js', revision: '1' },
    { url: '/manifest.json', revision: '1' },
    { url: '/css/materialize.min.css', revision: '1' },
    { url: '/css/style.css', revision: '1' },
    { url: '/js/materialize.min.js', revision: '1' },
    { url: '/js/api.js', revision: '1' },
    { url: '/js/nav.js', revision: '1' },
    { url: '/js/idb.js', revision: '1' },
    { url: '/js/db.js', revision: '1' },
    { url: '/icons/ideal_icon_32x32.png', revision: '1' },
    { url: '/icons/ideal_logo_192x192.png', revision: '1' },
    { url: '/icons/ideal_logo_512x512.png', revision: '1' }
  ],
  {
    ignoreUrlParametersMatching: [/.*/]
  });
}

initRegisterRoute = () => {
  workbox.routing.registerRoute(
    new RegExp('/pages/'),
    workbox.strategies.staleWhileRevalidate({
      cacheName: "pages"
    })
  );

  workbox.routing.registerRoute(
    /^https:\/\/fonts\.googleapis\.com/,
    workbox.strategies.staleWhileRevalidate({
      cacheName: 'google-fonts-stylesheets',
    })
  );

  workbox.routing.registerRoute(
    /^https:\/\/fonts\.gstatic\.com/,
    workbox.strategies.cacheFirst({
      cacheName: 'google-fonts-webfonts',
      plugins: [
        new workbox.cacheableResponse.Plugin({
          statuses: [0, 200],
        }),
        new workbox.expiration.Plugin({
          maxAgeSeconds: 60 * 60 * 24 * 365,
          maxEntries: 30,
        }),
      ],
    })
  );

  workbox.routing.registerRoute(
    /^https:\/\/api\.football-data\.org/,
    workbox.strategies.staleWhileRevalidate({
      cacheName: 'api-football-data',
    })
  );
}

initPushMessage = () => {
  self.addEventListener('push', function(event){
    let body        = "Push message no payload";
    const iconIdeal = 'icons/ideal_logo_192x192.png';

    if(event.data) {
      body = event.data.text();
    }

    const options = {
      body: body,
      badge: iconIdeal,
      icon: iconIdeal,
      vibrate: [100, 50, 100],
      data: {
        dateOfArrival: Date.now(),
        primaryKey: 1
      }
    }

    event.waitUntil(
      self.registration.showNotification('ideaLBola', options)
    );
  });
}

if(workbox) {
  console.log(`Workbox berhasil dimuat`);

  initPrecacheAndRoute();
  initRegisterRoute();
  initPushMessage();

} else {
  console.log(`Workbox gagal dimuat`);
}