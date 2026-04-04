// =====================================================
// FIREBASE MESSAGING SERVICE WORKER
// This file makes notifications arrive even when:
// - Browser is closed
// - Phone screen is off
// - Website tab is closed
// Exactly like WhatsApp / Instagram notifications
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

// Handle background messages (when app is closed/browser not open)
messaging.onBackgroundMessage(function(payload) {
  console.log('Background message received:', payload);

  const data  = payload.data || {};
  const title = data.title || '🛎️ New Order! — The Laben Café';
  const body  = data.body  || 'A new order just arrived!';

  const options = {
    body:    body,
    icon:    '/icon-192.png',
    badge:   '/icon-72.png',
    tag:     data.orderId ? 'order-' + data.orderId : 'laben-order',
    vibrate: [300, 100, 300, 100, 300],
    requireInteraction: true,
    data:    { url: '/?openAdmin=1', orderId: data.orderId || '' },
    actions: [
      { action: 'open',    title: '👀 View Order' },
      { action: 'dismiss', title: '✕ Dismiss'     }
    ]
  };

  return self.registration.showNotification(title, options);
});

// Notification click handler
self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  if (event.action === 'dismiss') return;

  const url = (event.notification.data && event.notification.data.url)
    ? event.notification.data.url : '/?openAdmin=1';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(clientList) {
      for (var i = 0; i < clientList.length; i++) {
        var client = clientList[i];
        if ('focus' in client) {
          client.postMessage({ type: 'OPEN_ADMIN' });
          return client.focus();
        }
      }
      if (clients.openWindow) return clients.openWindow(url);
    })
  );
});
