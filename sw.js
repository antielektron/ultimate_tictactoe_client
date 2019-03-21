
self.addEventListener('install', function(e) {
    e.waitUntil(
      caches.open('your-magic-cache').then(function(cache) {
        return cache.addAll([
          '/website/ultimate_tictactoe/',
          '/website/ultimate_tictactoe/index.html',
          '/website/ultimate_tictactoe/manifest.json',
          '/website/ultimate_tictactoe/icon.png',
          '/website/ultimate_tictactoe/LICENSE',
          '/website/ultimate_tictactoe/main.js',
          '/website/ultimate_tictactoe/grid.js',
          '/website/ultimate_tictactoe/local_match_manager.js',
          '/website/ultimate_tictactoe/online_match_manager.js',
          '/website/ultimate_tictactoe/websocket_connection.js',
          '/website/ultimate_tictactoe/infobar.js',
          '/website/ultimate_tictactoe/infocontainer.js',
          '/website/ultimate_tictactoe/settings.js',
          '/website/ultimate_tictactoe/subgrid.js',
          '/website/ultimate_tictactoe/tile.js',
          '/website/ultimate_tictactoe/README.md',
          '/website/ultimate_tictactoe/site.js',
          '/website/ultimate_tictactoe/style.css',
        ]);
      })
    );
  });
  
  self.addEventListener('fetch', function(event) {
    event.respondWith(
      caches.match(event.request).then(function(response) {
        return response || fetch(event.request);
      })
    );
});

self.addEventListener('notificationclick', function(event) {
  event.waitUntil(async function() {
      const allClients = await clients.matchAll({
          includeUncontrolled: true
      });

      var instance = None;


      // Let's see if we already have a window open:
      for (const client of allClients) {
          client.focus();
          instance = client;
          break;
      }

      // If we didn't find an existing window,
      // open a new one:
      if (!instance) {
          instance = await clients.openWindow(rel_home);
      }
  }());
});