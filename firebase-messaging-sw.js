// ============================================================
// firebase-messaging-sw.js
// ⚠️  PLACE THIS FILE AT YOUR SITE ROOT — same folder as index.html
//     e.g. if index.html is at  public/index.html
//          this file must be at public/firebase-messaging-sw.js
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

if (!self.firebase || !self.firebase.apps.length) {
  firebase.initializeApp(FIREBASE_CONFIG);
}

let messaging;
try { messaging = firebase.messaging(); } catch(e) { console.warn('[SW] FCM init:', e.message); }

// ── Show a notification ───────────────────────────────────────────────────
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

// ── FCM background message (tab closed / background) ─────────────────────
if (messaging) {
  messaging.onBackgroundMessage(payload => {
    const data  = payload.data        || {};
    const notif = payload.notification || {};
    const title   = data.title   || notif.title  || '🛎️ New Order! — The Laben Café';
    const body    = data.body    || notif.body   || 'A new order just arrived.';
    const orderId = data.orderId || '';
    return showOrderNotification(title, body, orderId);
  });
}

// ── IndexedDB helpers (track which orders we already notified) ────────────
const IDB_NAME  = 'laben-sw-db';
const IDB_STORE = 'seen-orders';

function openIDB() {
  return new Promise((res, rej) => {
    const r = indexedDB.open(IDB_NAME, 1);
    r.onupgradeneeded = e => e.target.result.createObjectStore(IDB_STORE, { keyPath: 'id' });
    r.onsuccess = e => res(e.target.result);
    r.onerror   = e => rej(e.target.error);
  });
}
function idbHasSeen(db, id) {
  return new Promise(res => {
    const r = db.transaction(IDB_STORE,'readonly').objectStore(IDB_STORE).get(id);
    r.onsuccess = e => res(!!e.target.result);
    r.onerror   = () => res(false);
  });
}
function idbMarkSeen(db, id) {
  return new Promise(res => {
    const tx = db.transaction(IDB_STORE,'readwrite');
    tx.objectStore(IDB_STORE).put({ id, ts: Date.now() });
    tx.oncomplete = res; tx.onerror = res;
  });
}

// ── Poll Firebase DB for fresh orders ────────────────────────────────────
async function checkNewOrders() {
  if (Notification.permission !== 'granted') return;
  let db;
  try { db = await openIDB(); } catch(e) { return; }

  const url = FIREBASE_CONFIG.databaseURL +
    '/orders.json?orderBy=%22timestamp%22&limitToLast=10';
  let data;
  try {
    const res = await fetch(url);
    if (!res.ok) return;
    data = await res.json();
  } catch(e) { return; }

  if (!data || typeof data !== 'object') return;
  const now = Date.now();

  for (const order of Object.values(data)) {
    if (!order || !order.id) continue;
    const age = now - (order.timestamp || 0);
    if (age > 120000) { await idbMarkSeen(db, order.id); continue; } // older than 2 min → skip
    if (await idbHasSeen(db, order.id)) continue;
    await idbMarkSeen(db, order.id);
    const title = '🛎️ New Order #' + order.id + ' — The Laben Café';
    const body  = (order.name || 'Customer') + ' · ₹' + (order.total || '?') + ' · ' + (order.payment || 'COD');
    await showOrderNotification(title, body, order.id);
  }
}

// ── Messages from main page ───────────────────────────────────────────────
self.addEventListener('message', event => {
  if (!event.data) return;
  const { type, title, body, orderId } = event.data;

  if (type === 'NEW_ORDER') {
    // Main page says: show this notification right now
    showOrderNotification(
      title   || '🛎️ New Order! — The Laben Café',
      body    || 'A new order just arrived.',
      orderId || ''
    );
  }
  if (type === 'START_WATCH' || type === 'CHECK_ORDERS') {
    checkNewOrders();
  }
});

// ── Notification tap ──────────────────────────────────────────────────────
self.addEventListener('notificationclick', event => {
  event.notification.close();
  if (event.action === 'dismiss') return;
  const url = (event.notification.data && event.notification.data.url) || '/?openAdmin=1';
  event.waitUntil(
    clients.matchAll({ type:'window', includeUncontrolled:true }).then(list => {
      for (const c of list) {
        if (c.url.includes(self.location.origin) && 'focus' in c) {
          c.focus(); c.postMessage({ type:'OPEN_ADMIN' }); return;
        }
      }
      if (clients.openWindow) return clients.openWindow(url);
    })
  );
});

// ── Periodic background sync ──────────────────────────────────────────────
self.addEventListener('periodicsync', event => {
  if (event.tag === 'check-orders') event.waitUntil(checkNewOrders());
});

// ── Raw push fallback ─────────────────────────────────────────────────────
self.addEventListener('push', event => {
  if (!event.data) { event.waitUntil(checkNewOrders()); return; }
  let p; try { p = event.data.json(); } catch(e) { event.waitUntil(checkNewOrders()); return; }
  if (p.from) return; // FCM already handled via onBackgroundMessage
  const t = (p.notification && p.notification.title) || '🛎️ New Order!';
  const b = (p.notification && p.notification.body)  || 'New order at The Laben Café.';
  event.waitUntil(showOrderNotification(t, b, ''));
});

// ── Lifecycle ─────────────────────────────────────────────────────────────
self.addEventListener('install',  () => self.skipWaiting());
self.addEventListener('activate', e  => e.waitUntil(clients.claim()));
