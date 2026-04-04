// ===== THE LABEN CAFE - SERVICE WORKER =====
// This makes notifications appear on mobile home screen like WhatsApp/Instagram

const CACHE_NAME = 'laben-cafe-v1';
const ASSETS = [
  '/',
  '/index.html',
  '/app.js',
  '/style.css',
  '/manifest.json'
];

// Install - cache assets
self.addEventListener('install', e => {
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS).catch(() => {}))
  );
});

// Activate - clean old caches
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// Fetch - serve from cache when offline
self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request)).catch(() => caches.match('/index.html'))
  );
});

// ===== PUSH NOTIFICATION HANDLER =====
// This fires when Firebase sends a push - shows on phone home screen
self.addEventListener('push', e => {
  let data = {};
  try { data = e.data ? e.data.json() : {}; } catch(err) { data = { title: '🛎️ New Order!', body: 'A new order has arrived at The Laben Café!' }; }

  const title   = data.title || '🛎️ New Order — The Laben Café';
  const options = {
    body:    data.body    || 'A new order just came in!',
    icon:    data.icon    || '/icon-192.png',
    badge:   data.badge   || '/icon-72.png',
    tag:     data.tag     || 'laben-order-' + Date.now(),
    data:    data.data    || { url: '/' },
    vibrate: [200, 100, 200, 100, 200],
    sound:   'default',
    requireInteraction: true,
    actions: [
      { action: 'open',    title: '👀 View Order' },
      { action: 'dismiss', title: '✕ Dismiss'     }
    ]
  };

  e.waitUntil(self.registration.showNotification(title, options));
});

// ===== NOTIFICATION CLICK =====
self.addEventListener('notificationclick', e => {
  e.notification.close();
  if (e.action === 'dismiss') return;

  const url = (e.notification.data && e.notification.data.url) ? e.notification.data.url : '/';

  e.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clientList => {
      for (const client of clientList) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          client.postMessage({ type: 'OPEN_ADMIN' });
          return client.focus();
        }
      }
      if (clients.openWindow) return clients.openWindow(url);
    })
  );
});

// ===== BACKGROUND SYNC (Firebase order listener via message) =====
// Main app sends message to SW to show notification when new order comes
self.addEventListener('message', e => {
  if (e.data && e.data.type === 'NEW_ORDER') {
    const order = e.data.order;
    const title = '🛎️ New Order #' + order.id;
    const options = {
      body:    '👤 ' + order.name + '\n💰 ₹' + order.total + ' · ' + order.payment + '\n📍 ' + order.address,
      icon:    '/icon-192.png',
      badge:   '/icon-72.png',
      tag:     'order-' + order.id,
      vibrate: [300, 100, 300, 100, 300],
      requireInteraction: true,
      data:    { url: '/', orderId: order.id },
      actions: [
        { action: 'open',    title: '👀 Open Admin' },
        { action: 'dismiss', title: '✕ Dismiss'     }
      ]
    };
    self.registration.showNotification(title, options);
  }
});
