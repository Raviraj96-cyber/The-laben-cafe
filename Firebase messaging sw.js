// =============================================================
// firebase-messaging-sw.js
// Place this file at your WEBSITE ROOT (same folder as index.html)
// e.g.  /firebase-messaging-sw.js
// Must be on HTTPS (or localhost) to work.
// =============================================================

importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey:            "AIzaSyAQ_8cq9DWzXb5bgl2SpY5xI5TYKd-6dfA",
  authDomain:        "laben-cafe.firebaseapp.com",
  databaseURL:       "https://laben-cafe-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId:         "laben-cafe",
  storageBucket:     "laben-cafe.firebasestorage.app",
  messagingSenderId: "236045385314",
  appId:             "1:236045385314:web:a363accd4d0b9f0fe35b3b"
});

const messaging = firebase.messaging();

// ── Background message handler ────────────────────────────────────────────
// This fires when a push arrives and the browser/tab is in the background.
// FCM automatically shows the notification from the `notification` field.
// We handle the `data`-only payload here manually.
messaging.onBackgroundMessage(payload => {
  console.log('[SW] Background message received:', payload);

  const data  = payload.data        || {};
  const notif = payload.notification || {};

  const title = data.title || notif.title || '🛎️ New Order! — The Laben Café';
  const body  = data.body  || notif.body  || 'A new order just arrived. Tap to view.';
  const orderId = data.orderId || '';

  return self.registration.showNotification(title, {
    body,
    icon:    '/icon-192.png',
    badge:   '/icon-72.png',
    tag:     orderId ? 'order-' + orderId : 'laben-order',
    renotify: true,
    vibrate: [300, 100, 300, 100, 300],
    requireInteraction: true,
    data: { url: '/?openAdmin=1', orderId },
    actions: [
      { action: 'open',    title: '👀 View Order' },
      { action: 'dismiss', title: '✕ Dismiss'     }
    ]
  });
});

// ── Notification click handler ────────────────────────────────────────────
self.addEventListener('notificationclick', event => {
  event.notification.close();

  if (event.action === 'dismiss') return;

  const url = (event.notification.data && event.notification.data.url)
    ? event.notification.data.url
    : '/?openAdmin=1';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(list => {
      // If a window with this origin is already open, focus it
      for (const client of list) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          client.focus();
          client.postMessage({ type: 'OPEN_ADMIN' });
          return;
        }
      }
      // Otherwise open a new window
      if (clients.openWindow) return clients.openWindow(url);
    })
  );
});

// ── Push event fallback (raw push without FCM data) ───────────────────────
self.addEventListener('push', event => {
  // FCM handles its own push via onBackgroundMessage above.
  // This catches any raw push that slips through (e.g. direct Web Push API calls).
  if (!event.data) return;
  let payload;
  try { payload = event.data.json(); } catch(e) { return; }

  // If FCM already handled it, it will have a `from` field — skip
  if (payload.from) return;

  const title = (payload.notification && payload.notification.title) || '🛎️ New Order!';
  const body  = (payload.notification && payload.notification.body)  || 'New order at The Laben Café.';

  event.waitUntil(
    self.registration.showNotification(title, {
      body,
      icon:  '/icon-192.png',
      badge: '/icon-72.png',
      tag:   'laben-order',
      vibrate: [300, 100, 300],
      requireInteraction: true,
      data: { url: '/?openAdmin=1' }
    })
  );
});

// ── Service worker lifecycle ──────────────────────────────────────────────
self.addEventListener('install',  () => self.skipWaiting());
self.addEventListener('activate', e  => e.waitUntil(clients.claim()));
