// ===== THE LABEN CAFÉ — SERVICE WORKER =====
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

// ── Background push (phone locked / tab closed) ───────────
messaging.onBackgroundMessage(payload => {
  const data  = payload.data || {};
  const title = data.title   || '🛎️ New Order — The Laben Café';
  return self.registration.showNotification(title, {
    body:               data.body || 'A new order just came in!',
    icon:               '/icon-192.png',
    badge:              '/icon-72.png',
    tag:                data.tag  || 'laben-' + Date.now(),
    vibrate:            [300, 100, 300, 100, 300],
    requireInteraction: true,
    data:               { url: '/' },
    actions: [
      { action: 'open',    title: '👀 View Order' },
      { action: 'dismiss', title: '✕ Dismiss'     }
    ]
  });
});

// ── Cache ─────────────────────────────────────────────────
const CACHE  = 'laben-v3';
const ASSETS = ['/', '/index.html', '/app.js', '/style.css', '/manifest.json'];

self.addEventListener('install', e => {
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS).catch(() => {})));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request)).catch(() => caches.match('/index.html'))
  );
});

// ── Message from page (when tab is open) ─────────────────
self.addEventListener('message', e => {
  if (e.data && e.data.type === 'NEW_ORDER') {
    const o = e.data.order || {};
    e.waitUntil(self.registration.showNotification('🛎️ New Order #' + o.id, {
      body:               '👤 ' + o.name + '\n💰 ₹' + o.total + ' · ' + o.payment + '\n📍 ' + o.address,
      icon:               '/icon-192.png',
      badge:              '/icon-72.png',
      tag:                'order-' + o.id,
      vibrate:            [300, 100, 300],
      requireInteraction: true,
      data:               { url: '/' },
      actions: [
        { action: 'open',    title: '👀 Open Admin' },
        { action: 'dismiss', title: '✕ Dismiss'     }
      ]
    }));
  }
});

// ── Notification click ────────────────────────────────────
self.addEventListener('notificationclick', e => {
  e.notification.close();
  if (e.action === 'dismiss') return;
  e.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(list => {
      for (const c of list) {
        if ('focus' in c) { c.postMessage({ type: 'OPEN_ADMIN' }); return c.focus(); }
      }
      if (clients.openWindow) return clients.openWindow('/');
    })
  );
});
