// ============================================================
//  PASTE THESE FUNCTIONS INTO app.js
//  Replace: registerServiceWorker() and sendOrderNotification()
// ============================================================

// ── Service Worker Registration ──────────────────────────
async function registerServiceWorker() {
  if (!('serviceWorker' in navigator)) {
    console.warn('SW not supported'); return null;
  }
  try {
    const reg = await navigator.serviceWorker.register('/sw.js', { scope: '/' });
    swRegistration = reg;
    console.log('✅ SW registered');

    // Wait for SW to be active (important on first load)
    if (reg.installing) {
      await new Promise(resolve => {
        reg.installing.addEventListener('statechange', e => {
          if (e.target.state === 'activated') resolve();
        });
      });
    }

    // When user taps notification → open admin panel
    navigator.serviceWorker.addEventListener('message', e => {
      if (e.data && e.data.type === 'OPEN_ADMIN') {
        const adminEl = document.getElementById('adminPanel');
        if (adminEl) new bootstrap.Offcanvas(adminEl).show();
      }
    });

    return reg;
  } catch (err) {
    console.error('❌ SW failed:', err);
    return null;
  }
}

// ── Send Order Notification (MOBILE FIXED) ───────────────
//
//  KEY FIX: Instead of calling swRegistration.showNotification()
//  directly from the page (which FAILS on Android/iOS),
//  we POST a message to the Service Worker and let IT show
//  the notification. The SW runs in a trusted background context
//  that Android/iOS allow to display lock-screen notifications.
//
function sendOrderNotification(order) {
  if (!('Notification' in window) || Notification.permission !== 'granted') return;

  const notifData = {
    type:  'NEW_ORDER',
    order: {
      id:      order.id,
      name:    order.name,
      total:   order.total,
      payment: order.payment,
      address: order.address
    }
  };

  // PRIMARY: send to SW controller (works on mobile!)
  if (navigator.serviceWorker && navigator.serviceWorker.controller) {
    navigator.serviceWorker.controller.postMessage(notifData);
    return; // done — SW will show it
  }

  // FALLBACK 1: use SW registration directly (desktop Chrome)
  if (swRegistration) {
    swRegistration.showNotification('🛎️ New Order #' + order.id, {
      body:               '👤 ' + order.name + '\n💰 ₹' + order.total + ' via ' + order.payment + '\n📍 ' + order.address,
      icon:               '/icon-192.png',
      badge:              '/icon-72.png',
      tag:                'laben-order-' + order.id,
      vibrate:            [300, 100, 300, 100, 300],
      requireInteraction: true,
      data:               { url: '/', orderId: order.id },
      actions: [
        { action: 'open',    title: '👀 View Order' },
        { action: 'dismiss', title: '✕ Dismiss'     }
      ]
    });
    return;
  }

  // FALLBACK 2: basic browser notification (desktop only)
  try {
    new Notification('🛎️ New Order #' + order.id, {
      body: '👤 ' + order.name + ' · ₹' + order.total
    });
  } catch (e) {}
}
