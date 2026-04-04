// =====================================================
// FIREBASE MESSAGING SERVICE WORKER — The Laben Café
// Handles background push notifications (app closed / screen off)
// =====================================================

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

// ── Background messages (tab closed / browser minimised) ──────────────────
messaging.onBackgroundMessage(function(payload) {
  console.log('[SW] Background message:', payload);

  const data  = payload.data  || {};
  const notif = payload.notification || {};

  const title   = data.title || notif.title || '🛎️ New Order! — The Laben Café';
  const body    = data.body  || notif.body  || 'A new order just arrived!';
  const orderId = data.orderId || '';

  return self.registration.showNotification(title, {
    body,
    icon:    '/icon-192.png',
    badge:   '/icon-72.png',
    tag:     orderId ? 'order-' + orderId : 'laben-new-order',
    renotify: true,
    vibrate: [300, 100, 300, 100, 300],
    requireInteraction: true,
    data:    { url: '/?openAdmin=1', orderId },
    actions: [
      { action: 'open',    title: '👀 View Order' },
      { action: 'dismiss', title: '✕ Dismiss'    }
    ]
  });
});

// ── Notification click ────────────────────────────────────────────────────
self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  if (event.action === 'dismiss') return;

  const targetUrl = (event.notification.data && event.notification.data.url)
    ? event.notification.data.url
    : '/?openAdmin=1';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(list) {
      for (let i = 0; i < list.length; i++) {
        const c = list[i];
        if ('focus' in c) {
          c.postMessage({ type: 'OPEN_ADMIN' });
          return c.focus();
        }
      }
      return clients.openWindow(targetUrl);
    })
  );
});

// ── SW lifecycle — activate immediately so new SW takes over right away ───
self.addEventListener('install',  () => self.skipWaiting());
self.addEventListener('activate', e  => e.waitUntil(clients.claim()));
