// ===== THE LABEN CAFE - SERVICE WORKER (MOBILE FIXED) =====
const CACHE_NAME = 'laben-cafe-v2';
const ASSETS = ['/', '/index.html', '/app.js', '/style.css', '/manifest.json'];

// ── Install ──────────────────────────────────────────────
self.addEventListener('install', e => {
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE_NAME).then(c => c.addAll(ASSETS).catch(() => {}))
  );
});

// ── Activate ─────────────────────────────────────────────
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// ── Fetch (offline support) ───────────────────────────────
self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request)
      .then(r => r || fetch(e.request))
      .catch(() => caches.match('/index.html'))
  );
});

// ── Message from page → show notification on mobile ───────
// This is the KEY fix: page sends NEW_ORDER message, SW shows it.
// This works on Android Chrome, iOS Safari (PWA), and desktop.
self.addEventListener('message', e => {
  if (!e.data) return;

  if (e.data.type === 'NEW_ORDER') {
    const order = e.data.order || {};
    const title = '🛎️ New Order #' + (order.id || '???');
    const options = {
      body:               '👤 ' + (order.name || '') + '\n💰 ₹' + (order.total || 0) + ' · ' + (order.payment || '') + '\n📍 ' + (order.address || ''),
      icon:               '/icon-192.png',
      badge:              '/icon-72.png',
      tag:                'order-' + (order.id || Date.now()),
      vibrate:            [300, 100, 300, 100, 300],
      requireInteraction: true,
      data:               { url: '/', orderId: order.id },
      actions: [
        { action: 'open',    title: '👀 Open Admin' },
        { action: 'dismiss', title: '✕ Dismiss'     }
      ]
    };
    e.waitUntil(self.registration.showNotification(title, options));
  }

  if (e.data.type === 'OPEN_ADMIN') {
    // Already handled in notificationclick below
  }
});

// ── Push (from Firebase Cloud Messaging if configured) ────
self.addEventListener('push', e => {
  let data = {};
  try { data = e.data ? e.data.json() : {}; } catch (_) {}
  const title   = data.title || '🛎️ New Order — The Laben Café';
  const options = {
    body:               data.body || 'A new order just came in!',
    icon:               '/icon-192.png',
    badge:              '/icon-72.png',
    tag:                data.tag  || 'laben-order-' + Date.now(),
    vibrate:            [200, 100, 200, 100, 200],
    requireInteraction: true,
    data:               { url: '/' }
  };
  e.waitUntil(self.registration.showNotification(title, options));
});

// ── Notification click ────────────────────────────────────
self.addEventListener('notificationclick', e => {
  e.notification.close();
  if (e.action === 'dismiss') return;

  const targetUrl = (e.notification.data && e.notification.data.url) ? e.notification.data.url : '/';

  e.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clientList => {
      for (const client of clientList) {
        if ('focus' in client) {
          client.postMessage({ type: 'OPEN_ADMIN' });
          return client.focus();
        }
      }
      if (clients.openWindow) return clients.openWindow(targetUrl);
    })
  );
});
