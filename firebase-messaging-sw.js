// ============================================================
// firebase-messaging-sw.js  ·  The Laben Café
// PLACE THIS FILE AT YOUR SITE ROOT — same folder as index.html
//   cPanel/Hostinger → public_html/firebase-messaging-sw.js
//   Firebase Hosting → public/firebase-messaging-sw.js
// ============================================================

const DB_URL = 'https://laben-cafe-default-rtdb.asia-southeast1.firebasedatabase.app';

// ── IndexedDB: track seen order IDs ──────────────────────────────────────────
const IDB = {
  _db: null,
  open() {
    if (this._db) return Promise.resolve(this._db);
    return new Promise((res, rej) => {
      const r = indexedDB.open('laben-sw', 2);
      r.onupgradeneeded = e => {
        const db = e.target.result;
        if (!db.objectStoreNames.contains('seen')) db.createObjectStore('seen', { keyPath: 'id' });
      };
      r.onsuccess = e => { this._db = e.target.result; res(this._db); };
      r.onerror   = e => rej(e.target.error);
    });
  },
  async has(id) {
    try {
      const db = await this.open();
      return new Promise(res => {
        const req = db.transaction('seen','readonly').objectStore('seen').get(id);
        req.onsuccess = e => res(!!e.target.result);
        req.onerror   = () => res(false);
      });
    } catch(e) { return false; }
  },
  async mark(id) {
    try {
      const db = await this.open();
      return new Promise(res => {
        const tx = db.transaction('seen','readwrite');
        tx.objectStore('seen').put({ id, ts: Date.now() });
        tx.oncomplete = res; tx.onerror = res;
      });
    } catch(e) {}
  },
  async cleanup() {
    try {
      const db = await this.open();
      const cutoff = Date.now() - 86400000;
      const tx = db.transaction('seen','readwrite');
      const store = tx.objectStore('seen');
      const req = store.openCursor();
      req.onsuccess = e => {
        const cursor = e.target.result;
        if (!cursor) return;
        if ((cursor.value.ts||0) < cutoff) store.delete(cursor.value.id);
        cursor.continue();
      };
    } catch(e) {}
  }
};

// ── Show notification ─────────────────────────────────────────────────────────
function showNotif(title, body, orderId) {
  const tag = orderId ? 'laben-order-' + orderId : 'laben-order';
  return self.registration.showNotification(title, {
    body,
    icon:    '/icon-192.png',
    badge:   '/icon-192.png',
    tag,
    renotify: true,
    vibrate: [300, 100, 300, 100, 300],
    requireInteraction: true,
    data: { url: '/?openAdmin=1', orderId: orderId || '' }
  });
}

// ── Poll Firebase REST for new orders ─────────────────────────────────────────
async function checkOrders() {
  try {
    const res = await fetch(
      DB_URL + '/orders.json?orderBy=%22timestamp%22&limitToLast=15',
      { cache: 'no-store' }
    );
    if (!res.ok) return;
    const data = await res.json();
    if (!data || typeof data !== 'object') return;

    const now = Date.now();
    const entries = Object.values(data).filter(Boolean);

    for (const order of entries) {
      if (!order || !order.id) continue;
      const age = now - (order.timestamp || 0);
      if (age > 180000) { await IDB.mark(order.id); continue; }
      if (await IDB.has(order.id)) continue;
      await IDB.mark(order.id);

      const title = '🛎️ New Order #' + order.id + ' — The Laben Café';
      const body  = (order.name || 'Customer') + ' · ₹' + (order.total || '?') + ' · ' + (order.payment || 'COD');
      await showNotif(title, body, order.id);
    }

    await IDB.cleanup();
  } catch(e) {}
}

// ── Message from main page ───────────────────────────────────────────────────
self.addEventListener('message', event => {
  if (!event.data) return;
  const { type, title, body, orderId } = event.data;

  if (type === 'NEW_ORDER') {
    IDB.mark(orderId || ('manual-' + Date.now()));
    showNotif(
      title   || '🛎️ New Order! — The Laben Café',
      body    || 'A new order just arrived.',
      orderId || ''
    );
  }
  if (type === 'CHECK_ORDERS' || type === 'START_WATCH') {
    checkOrders();
  }
  if (type === 'MARK_SEEN' && orderId) {
    IDB.mark(orderId);
  }
});

// ── Notification click ───────────────────────────────────────────────────────
self.addEventListener('notificationclick', event => {
  event.notification.close();
  const url = (event.notification.data && event.notification.data.url) || '/?openAdmin=1';
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(list => {
      for (const c of list) {
        if ('focus' in c) { c.focus(); c.postMessage({ type: 'OPEN_ADMIN' }); return; }
      }
      if (clients.openWindow) return clients.openWindow(url);
    })
  );
});

// ── Raw push fallback ────────────────────────────────────────────────────────
self.addEventListener('push', event => {
  let payload = null;
  try { payload = event.data ? event.data.json() : null; } catch(e) {}
  if (payload && payload.notification) {
    const t  = payload.notification.title || '🛎️ New Order!';
    const b  = payload.notification.body  || 'New order received.';
    const id = (payload.data && payload.data.orderId) || '';
    event.waitUntil(showNotif(t, b, id));
  } else {
    event.waitUntil(checkOrders());
  }
});

// ── Periodic sync ────────────────────────────────────────────────────────────
self.addEventListener('periodicsync', event => {
  if (event.tag === 'laben-check-orders') event.waitUntil(checkOrders());
});

// ── Lifecycle ────────────────────────────────────────────────────────────────
self.addEventListener('install',  () => self.skipWaiting());
self.addEventListener('activate', e  => e.waitUntil(clients.claim()));
