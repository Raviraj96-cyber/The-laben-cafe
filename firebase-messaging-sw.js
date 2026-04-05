// ============================================================
// firebase-messaging-sw.js
// Place at your website ROOT (same folder as index.html)
// This file does TWO jobs:
//   1. Handles FCM background push messages (when sent via FCM)
//   2. Directly watches Firebase Realtime DB for new orders
//      and fires notifications itself — NO server key needed ✅
// ============================================================

importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js');

const FIREBASE_CONFIG = {
  apiKey:            "AIzaSyAQ_8cq9DWzXb5bgl2SpY5xI5TYKd-6dfA",
  authDomain:        "laben-cafe.firebaseapp.com",
  databaseURL:       "https://laben-cafe-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId:         "laben-cafe",
  storageBucket:     "laben-cafe.firebasestorage.app",
  messagingSenderId: "236045385314",
  appId:             "1:236045385314:web:a363accd4d0b9f0fe35b3b"
};

// Init Firebase
if (!self.firebase || !self.firebase.apps.length) {
  firebase.initializeApp(FIREBASE_CONFIG);
}

// Init FCM (for receiving push messages when sent via FCM console/API)
let messaging;
try { messaging = firebase.messaging(); } catch(e) { console.warn('[SW] FCM init skipped:', e.message); }

// ── Helper: show a notification ──────────────────────────────────────────
function showOrderNotification(title, body, orderId) {
  return self.registration.showNotification(title, {
    body,
    icon:    '/icon-192.png',
    badge:   '/icon-72.png',
    tag:     orderId ? 'order-' + orderId : 'laben-new-order',
    renotify: true,
    vibrate: [400, 100, 400, 100, 400],
    requireInteraction: true,
    data: { url: '/?openAdmin=1', orderId: orderId || '' },
    actions: [
      { action: 'view',    title: '👀 View Order' },
      { action: 'dismiss', title: '✕ Dismiss'     }
    ]
  });
}

// ── FCM background message handler ───────────────────────────────────────
// Fires when a push comes in while tab is in background/closed
if (messaging) {
  messaging.onBackgroundMessage(payload => {
    console.log('[SW] FCM background message:', payload);
    const data  = payload.data        || {};
    const notif = payload.notification || {};
    const title   = data.title    || notif.title  || '🛎️ New Order! — The Laben Café';
    const body    = data.body     || notif.body   || 'A new order just arrived. Tap to view.';
    const orderId = data.orderId  || '';
    return showOrderNotification(title, body, orderId);
  });
}

// ── Firebase Realtime DB watcher ─────────────────────────────────────────
// This is the KEY part: the SW itself watches the DB for new orders.
// It fires even when ALL tabs are closed — the SW stays alive in background.
// We store seen order IDs in IndexedDB so we don't re-alert on old orders.

const DB_NAME    = 'laben-sw-db';
const STORE_NAME = 'seen-orders';

// Open IndexedDB
function openIDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = e => e.target.result.createObjectStore(STORE_NAME, { keyPath: 'id' });
    req.onsuccess = e => resolve(e.target.result);
    req.onerror   = e => reject(e.target.error);
  });
}

async function hasSeen(db, orderId) {
  return new Promise((resolve, reject) => {
    const tx  = db.transaction(STORE_NAME, 'readonly');
    const req = tx.objectStore(STORE_NAME).get(orderId);
    req.onsuccess = e => resolve(!!e.target.result);
    req.onerror   = () => resolve(false);
  });
}

async function markSeen(db, orderId) {
  return new Promise((resolve, reject) => {
    const tx  = db.transaction(STORE_NAME, 'readwrite');
    tx.objectStore(STORE_NAME).put({ id: orderId, ts: Date.now() });
    tx.oncomplete = () => resolve();
    tx.onerror    = () => resolve();
  });
}

// Watch Firebase DB for new orders
async function watchOrders() {
  // Only watch if notification permission is granted
  if (Notification.permission !== 'granted') return;

  let db;
  try { db = await openIDB(); } catch(e) { console.warn('[SW] IDB open failed:', e); return; }

  // Use Firebase REST streaming API (no SDK needed, works in SW)
  const url = FIREBASE_CONFIG.databaseURL + '/orders.json?orderBy="timestamp"&limitToLast=5';

  try {
    const res = await fetch(url);
    if (!res.ok) return;
    const data = await res.json();
    if (!data || typeof data !== 'object') return;

    const now = Date.now();

    for (const [key, order] of Object.entries(data)) {
      if (!order || !order.id) continue;
      // Only alert on orders from the last 60 seconds (fresh orders)
      const age = now - (order.timestamp || 0);
      if (age > 60000) { await markSeen(db, order.id); continue; }

      const seen = await hasSeen(db, order.id);
      if (!seen) {
        await markSeen(db, order.id);
        const title = '🛎️ New Order #' + order.id + ' — The Laben Café';
        const body  = (order.name || 'Customer') + ' ordered ₹' + (order.total || '?') + ' via ' + (order.payment || 'COD');
        await showOrderNotification(title, body, order.id);
      }
    }
  } catch(e) {
    console.warn('[SW] DB watch fetch failed:', e);
  }
}

// ── Listen for messages from the main page ────────────────────────────────
// Main page tells SW: "notifications are enabled, start watching"
// and "new order just came in, check DB now"
self.addEventListener('message', event => {
  if (!event.data) return;

  if (event.data.type === 'START_WATCH') {
    console.log('[SW] Starting order watch');
    watchOrders();
  }

  if (event.data.type === 'NEW_ORDER') {
    // Main page detected a new order and wants SW to notify
    const { title, body, orderId } = event.data;
    showOrderNotification(
      title  || '🛎️ New Order! — The Laben Café',
      body   || 'A new order just arrived.',
      orderId || ''
    );
  }

  if (event.data.type === 'CHECK_ORDERS') {
    // Poll DB immediately (called periodically by main page via SW message)
    watchOrders();
  }
});

// ── Notification click ────────────────────────────────────────────────────
self.addEventListener('notificationclick', event => {
  event.notification.close();
  if (event.action === 'dismiss') return;

  const targetUrl = (event.notification.data && event.notification.data.url)
    ? event.notification.data.url : '/?openAdmin=1';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(list => {
      for (const client of list) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          client.focus();
          client.postMessage({ type: 'OPEN_ADMIN' });
          return;
        }
      }
      if (clients.openWindow) return clients.openWindow(targetUrl);
    })
  );
});

// ── Periodic background sync fallback ────────────────────────────────────
// Uses Background Sync / periodic push to poll for new orders
// even if the tab has been closed for a while
self.addEventListener('periodicsync', event => {
  if (event.tag === 'check-orders') {
    event.waitUntil(watchOrders());
  }
});

// Push event (raw Web Push, not FCM) — fallback
self.addEventListener('push', event => {
  if (!event.data) {
    event.waitUntil(watchOrders());
    return;
  }
  let payload;
  try { payload = event.data.json(); } catch(e) { event.waitUntil(watchOrders()); return; }
  // FCM handles its own push via onBackgroundMessage — skip those
  if (payload.from) return;

  const title = (payload.notification && payload.notification.title) || '🛎️ New Order!';
  const body  = (payload.notification && payload.notification.body)  || 'New order at The Laben Café.';
  event.waitUntil(showOrderNotification(title, body, ''));
});

// ── SW lifecycle ──────────────────────────────────────────────────────────
self.addEventListener('install',  ()  => { console.log('[SW] Installed'); self.skipWaiting(); });
self.addEventListener('activate', e   => { console.log('[SW] Activated'); e.waitUntil(clients.claim()); });
