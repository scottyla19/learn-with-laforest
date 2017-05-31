var filesToCache = [
  '.',
  'css/main.css',
  'img/spartanHeadLeft.svg',
  'img/spartanHeadRight.svg',
  'js/main.js',
  'index.html',
  'pages/404.html',
  'pages/offline.html',
  'https://fonts.googleapis.com/css?family=Roboto:300,400,500,700',
  'https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js',
  'https://fonts.googleapis.com/icon?family=Material+Icons',
  'https://fonts.googleapis.com/css?family=Roboto:300,400,500,700'

];

var staticCacheName = 'pages-cache-v1';

self.addEventListener('install', function(event) {
  console.log('Attempting to install service worker and cache static assets');
  event.waitUntil(
    caches.open(staticCacheName)
    .then(function(cache) {
      // handle no-cors cdns
      const request = new Request('https://code.getmdl.io/1.3.0/material.deep_purple-yellow.min.css', {mode: 'no-cors'});
      fetch(request).then(response => cache.put(request, response));
      const request2 = new Request('https://code.getmdl.io/1.3.0/material.min.js', {mode: 'no-cors'});
      fetch(request2).then(response2 => cache.put(request2, response2));

      return cache.addAll(filesToCache);
    })
  );
});

self.addEventListener('activate', function(event) {
  console.log('Activating new service worker...');

  var cacheWhitelist = [staticCacheName];

  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
self.addEventListener('fetch', function(event) {
  console.log('Fetch event for ', event.request.url);
  event.respondWith(
    caches.match(event.request).then(function(response) {
      if (response) {
        console.log('Found ', event.request.url, ' in cache');
        return response;
      }
      console.log('Network request for ', event.request.url);
      return fetch(event.request).then(function(response) {
        if (response.status === 404) {
          return caches.match('pages/404.html');
        }
        return caches.open(staticCacheName).then(function(cache) {
          if (event.request.url.indexOf('test') < 0) {
            cache.put(event.request.url, response.clone());
          }
          return response;
        });
      });
    }).catch(function(error) {
      console.log('Error, ', error);
      return caches.match('pages/offline.html');
    })
  );
});
