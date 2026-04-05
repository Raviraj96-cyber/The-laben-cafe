// =====================================================================
// THE LABEN CAFÉ — app.js
// =====================================================================

const FCM_VAPID_KEY = 'BJTbJNtzb3hoiWGpZgyX5sUwgCs7U6qhu6UItw2o0G-uVf22u7xUN96TXRNDMOsh5C8XTJwonBcMNZPZlhOO5ek';

const FIREBASE_CONFIG = {
  apiKey:            "AIzaSyAQ_8cq9DWzXb5bgl2SpY5xI5TYKd-6dfA",
  authDomain:        "laben-cafe.firebaseapp.com",
  databaseURL:       "https://laben-cafe-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId:         "laben-cafe",
  storageBucket:     "laben-cafe.firebasestorage.app",
  messagingSenderId: "236045385314",
  appId:             "1:236045385314:web:a363accd4d0b9f0fe35b3b"
};

const CATEGORY_IMAGES = {
  coffee:   'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?w=400&q=80',
  fries:    'https://images.unsplash.com/photo-1585325701956-60dd9c8553bc?w=400&q=80',
  sandwich: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=400&q=80',
  pizza:    'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80',
  burger:   'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80',
  maggi:    'https://images.unsplash.com/photo-1555126634-323283e090fa?w=400&q=80',
};
const LOCAL_ITEM_IMAGES = {
  'Cold Coffee With Crush':             'laban-cafe/imeges/cold_cofee_with_crush.jpg',
  'Cold Coffee With Icecream':          'cold-coffee-icecream.jpg',
  'Hot Coffee':                         'hot_coffe.jpg',
  'Black Coffee':                       'balck_coffee.jpg',
  'Salted Fries':                       'salted_faris.webp',
  'Peri-Peri Fries':                    'peri_peri_fries.jpg',
  'Peri-Peri Fries With Masala':        'Peri-Peri Fries With Masala.jpg',
  'Veg Sandwich':                       'Veg Sandwich.jpg',
  'Cheese Corn Sandwich':               'Cheese Corn Sandwich.webp',
  'Cheese Chilli Sandwich':             'Chili-Cheese-Sandwich.jpg',
  'Plane Cheese Pizza':                 'Plane Cheese Pizza.jpg',
  'Veg Pizza':                          'Veg_Pizza.jpg',
  'Cheese Corn Pizza':                  'Cheese_Corn_Pizza.jpg',
  'Cheese Paneer Pizza':                'Cheese_Paneer_Pizza.jpg',
  'Aloo Tikki Burger':                  'Aloo_Tikki_Burger.webp',
  'Aloo Tikki Cheese Burger':           'Aloo_Tikki_Cheese_Burger.webp',
  'Laben Café Special Maharaja Burger': 'Aloo_Tikki_Cheese_Burger.webp',
  'Plane Maggi':                        'Plane_Maggi.jpg',
  'Masala Maggi':                       'Masala_Maggi.jpg',
  'Cheese Corn Maggi':                  'Cheese_Corn_Maggi.jpg',
  'Cheese Chilli Maggi':                'Cheese_Chilli_Maggi.webp',
};
const DEFAULT_MENU = [
  { id:1,  name:'Cold Coffee With Crush',             desc:'Refreshing cold coffee with crush syrup',          price:70,  cat:'coffee',   img:'' },
  { id:2,  name:'Cold Coffee With Icecream',          desc:'Chilled coffee topped with a scoop of ice cream',  price:80,  cat:'coffee',   img:'' },
  { id:3,  name:'Hot Coffee',                         desc:'Classic warm brew, comforting & rich',             price:30,  cat:'coffee',   img:'' },
  { id:4,  name:'Black Coffee',                       desc:'Strong, pure espresso-style black coffee',         price:30,  cat:'coffee',   img:'' },
  { id:5,  name:'Salted Fries',                       desc:'Crispy golden fries with seasoned salt',           price:70,  cat:'fries',    img:'' },
  { id:6,  name:'Peri-Peri Fries',                    desc:'Spicy peri-peri seasoned crispy fries',            price:80,  cat:'fries',    img:'' },
  { id:7,  name:'Peri-Peri Fries With Masala',        desc:'Peri-peri fries with extra masala kick',           price:90,  cat:'fries',    img:'' },
  { id:8,  name:'Veg Sandwich',                       desc:'Fresh veggies in toasted bread',                   price:60,  cat:'sandwich', img:'' },
  { id:9,  name:'Cheese Corn Sandwich',               desc:'Melted cheese and sweet corn grilled sandwich',    price:90,  cat:'sandwich', img:'' },
  { id:10, name:'Cheese Chilli Sandwich',             desc:'Spicy chilli & gooey cheese in crispy bread',      price:90,  cat:'sandwich', img:'' },
  { id:11, name:'Plane Cheese Pizza',                 desc:'Classic mozzarella on homemade sauce base',        price:130, cat:'pizza',    img:'' },
  { id:12, name:'Veg Pizza',                          desc:'Loaded with fresh seasonal vegetables',            price:150, cat:'pizza',    img:'' },
  { id:13, name:'Cheese Corn Pizza',                  desc:'Sweet corn and extra cheese on thin crust',        price:150, cat:'pizza',    img:'' },
  { id:14, name:'Cheese Paneer Pizza',                desc:'Chunky paneer cubes with melted cheese',           price:150, cat:'pizza',    img:'' },
  { id:15, name:'Aloo Tikki Burger',                  desc:'Spiced aloo tikki patty in a soft bun',            price:70,  cat:'burger',   img:'' },
  { id:16, name:'Aloo Tikki Cheese Burger',           desc:'Tikki patty with melted cheese slice',             price:90,  cat:'burger',   img:'' },
  { id:17, name:'Laben Café Special Maharaja Burger', desc:'Our signature mega burger — a must try!',          price:120, cat:'burger',   img:'' },
  { id:18, name:'Plane Maggi',                        desc:'Simple, comforting classic Maggi noodles',         price:80,  cat:'maggi',    img:'' },
  { id:19, name:'Masala Maggi',                       desc:'Extra spicy masala Maggi loaded with flavour',     price:90,  cat:'maggi',    img:'' },
  { id:20, name:'Cheese Corn Maggi',                  desc:'Creamy cheese and sweet corn Maggi',               price:100, cat:'maggi',    img:'' },
  { id:21, name:'Cheese Chilli Maggi',                desc:'Spicy chilli and melted cheese Maggi',             price:100, cat:'maggi',    img:'' },
];
const DEFAULT_CATEGORIES = ['coffee','fries','sandwich','pizza','burger','maggi'];

// ── State ─────────────────────────────────────────────────────────────────
let menuData   = JSON.parse(localStorage.getItem('laben_menu')       || 'null') || JSON.parse(JSON.stringify(DEFAULT_MENU));
let categories = JSON.parse(localStorage.getItem('laben_categories') || 'null') || [...DEFAULT_CATEGORIES];
let cart       = JSON.parse(localStorage.getItem('laben_cart')       || '[]');
let orders     = JSON.parse(localStorage.getItem('laben_orders')     || '[]');
let nextId     = menuData.reduce((a,b) => Math.max(a,b.id), 0) + 1;
let currentCat = 'all';
let upiPaymentConfirmed = false;

let firebaseDB      = null;
let firebaseStorage = null;
let firebaseOK      = false;
let swRegistration  = null;
let fbListenerReady = false;
let notifEnabled    = localStorage.getItem('laben_notif_enabled') === '1';

function _loadSeen() {
  try { const s = localStorage.getItem('laben_seen_ids'); if (s) return new Set(JSON.parse(s)); } catch(e) {}
  return new Set(orders.map(o => o.id));
}
function _saveSeen() { try { localStorage.setItem('laben_seen_ids', JSON.stringify([...seenIds])); } catch(e) {} }
let seenIds = _loadSeen();
let pendingNewItemImg = '';

function saveMenu()       { localStorage.setItem('laben_menu',       JSON.stringify(menuData));   }
function saveCategories() { localStorage.setItem('laben_categories', JSON.stringify(categories)); }
function saveCart()       { localStorage.setItem('laben_cart',       JSON.stringify(cart));       }
function saveOrders()     { localStorage.setItem('laben_orders',     JSON.stringify(orders));     }

// ── Toast ─────────────────────────────────────────────────────────────────
function showToast(msg, type) {
  const old = document.getElementById('laben-toast'); if (old) old.remove();
  const colors = { success:'#16a34a', warning:'#d97706', error:'#dc2626', info:'#2563eb' };
  const t = document.createElement('div');
  t.id = 'laben-toast';
  t.style.cssText = 'position:fixed;bottom:24px;left:50%;transform:translateX(-50%);background:'+(colors[type]||'#333')+';color:#fff;padding:11px 22px;border-radius:50px;font-size:13px;font-weight:600;z-index:99999;box-shadow:0 4px 20px rgba(0,0,0,.25);font-family:Poppins,sans-serif;white-space:nowrap;transition:opacity .4s;';
  t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(() => { t.style.opacity='0'; setTimeout(() => t.remove(), 400); }, 3500);
}

// ── Helpers ─────────────────────────────────────────────────────────────────
// Detect correct SW path for GitHub Pages repos vs root domains
// GitHub Pages repo: https://user.github.io/repo-name/ → SW at /repo-name/firebase-messaging-sw.js
// Root domain / username.github.io: SW at /firebase-messaging-sw.js
function _getSWPath() {
  const parts = location.pathname.split('/').filter(Boolean);
  // If first path segment is not a file (no dot), treat as repo prefix
  if (parts.length > 0 && !parts[0].includes('.')) {
    return '/' + parts[0] + '/firebase-messaging-sw.js';
  }
  return '/firebase-messaging-sw.js';
}
function _getSWScope() {
  const parts = location.pathname.split('/').filter(Boolean);
  if (parts.length > 0 && !parts[0].includes('.')) {
    return '/' + parts[0] + '/';
  }
  return '/';
}

function _timeout(ms) {
  return new Promise((_,r) => setTimeout(() => r(new Error('timeout')), ms));
}
function isSecureContext() {
  return location.protocol === 'https:' || location.hostname === 'localhost' || location.hostname === '127.0.0.1';
}

// ── Post message to Service Worker ───────────────────────────────────────────
function postToSW(data) {
  if (navigator.serviceWorker && navigator.serviceWorker.controller) {
    navigator.serviceWorker.controller.postMessage(data); return;
  }
  if (swRegistration && swRegistration.active) {
    swRegistration.active.postMessage(data); return;
  }
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready.then(reg => { if (reg.active) reg.active.postMessage(data); }).catch(()=>{});
  }
}

// ── Show notification via SW (most reliable) ─────────────────────────────────
function showDirectNotification(title, body, orderId) {
  if (Notification.permission !== 'granted') return;
  const opts = {
    body, icon: '/icon-192.png', badge: '/icon-192.png',
    tag: orderId ? 'laben-order-' + orderId : 'laben-order',
    renotify: true, vibrate: [300, 100, 300, 100, 300], requireInteraction: true,
    data: { url: '/?openAdmin=1', orderId: orderId || '' }
  };
  const reg = swRegistration;
  if (reg) {
    reg.showNotification(title, opts).catch(() => {
      try { new Notification(title, { body, icon: '/icon-192.png' }); } catch(e) {}
    });
  } else {
    try { new Notification(title, { body, icon: '/icon-192.png' }); } catch(e) {}
  }
}

function notifyNewOrder(order) {
  if (!notifEnabled && localStorage.getItem('laben_notif_enabled') !== '1') return;
  if (Notification.permission !== 'granted') return;
  const title = '🛎️ New Order #' + order.id + ' — The Laben Café';
  const body  = (order.name||'Customer') + ' · ₹' + (order.total||'?') + ' · ' + (order.payment||'COD');
  // Tell SW to show notification (works even when tab is in background)
  postToSW({ type: 'NEW_ORDER', title, body, orderId: order.id });
  // Also attempt direct notification as fallback
  showDirectNotification(title, body, order.id);
}

// ══════════════════════════════════════════════════════════════════════════════
// ENABLE NOTIFICATIONS
// ══════════════════════════════════════════════════════════════════════════════
async function enableNotifications() {
  const btn = document.getElementById('notif-enable-btn');
  const statusEl = document.getElementById('notif-status-text');

  function setStatus(msg, color) {
    if (statusEl) { statusEl.innerHTML = msg; statusEl.style.color = color; }
  }
  function resetBtn(label) {
    if (!btn) return;
    btn.disabled = false;
    btn.innerHTML = label || '<i class="bi bi-bell-fill me-1"></i> Enable Notifications';
    btn.onclick = enableNotifications;
  }

  // 1. Need Notification API
  if (!('Notification' in window)) {
    setStatus('❌ This browser does not support notifications.', '#dc2626');
    return;
  }

  // 2. Need HTTPS
  if (!isSecureContext()) {
    setStatus(
      '❌ <strong>HTTPS required.</strong><br>Notifications only work on <code>https://</code> sites.<br>' +
      '➡️ Deploy to Firebase Hosting, Vercel, or Netlify (all free).', '#dc2626'
    );
    if (btn) btn.style.display = 'none';
    return;
  }

  // 3. Need Service Worker support
  if (!('serviceWorker' in navigator)) {
    setStatus('❌ This browser does not support Service Workers.', '#dc2626');
    return;
  }

  if (btn) { btn.disabled = true; btn.innerHTML = '⏳ Requesting permission…'; }

  // 4. Request permission
  let perm;
  try { perm = await Promise.race([Notification.requestPermission(), _timeout(15000)]); }
  catch(e) { perm = Notification.permission; }

  if (perm !== 'granted') {
    setStatus(
      '❌ <strong>Permission denied.</strong><br>Tap the 🔒 lock icon in the address bar → Notifications → Allow → reload page.',
      '#dc2626'
    );
    resetBtn(); return;
  }

  if (btn) btn.innerHTML = '⏳ Registering service worker…';

  // 5. Register Service Worker
  // First verify the file actually exists
  try {
    const swPath = _getSWPath();
    const check = await fetch(swPath, { method: 'HEAD', cache: 'no-cache' });
    if (!check.ok) {
      setStatus(
        '❌ <strong>File not found on server (HTTP ' + check.status + ').</strong><br><br>' +
        '➡️ Upload <code>firebase-messaging-sw.js</code> to your <strong>root folder</strong>:<br>' +
        '<span style="font-size:11px;color:#888;">' +
        'cPanel/Hostinger: <code>public_html/firebase-messaging-sw.js</code><br>' +
        'Firebase Hosting: <code>public/firebase-messaging-sw.js</code><br>' +
        'Then run <code>firebase deploy</code> or re-upload.' +
        '</span>',
        '#dc2626'
      );
      resetBtn(); return;
    }
  } catch(e) {
    // Network error — still try to register
  }

  try {
    const reg = await Promise.race([
      navigator.serviceWorker.register(_getSWPath(), { scope: _getSWScope() }),
      _timeout(12000)
    ]);
    swRegistration = reg;

    // Wait for SW to activate
    if (reg.installing || reg.waiting) {
      await Promise.race([
        new Promise(resolve => {
          const sw = reg.installing || reg.waiting;
          sw.addEventListener('statechange', e => { if (e.target.state === 'activated') resolve(); });
        }),
        _timeout(8000)
      ]).catch(() => {});
    }

    // Wait for controller
    if (!navigator.serviceWorker.controller) {
      await Promise.race([
        new Promise(resolve => {
          navigator.serviceWorker.addEventListener('controllerchange', resolve, { once: true });
        }),
        _timeout(5000)
      ]).catch(() => {});
    }

  } catch(e) {
    const msg = (e.message || '').toLowerCase();
    let reason = '❌ <strong>Service worker failed.</strong><br>Error: ' + (e.message || 'unknown');
    if (msg.includes('mime') || msg.includes('text/html') || msg.includes('content-type')) {
      reason = '❌ <strong>Wrong file type.</strong> Your server is returning the SW file as HTML instead of JavaScript.<br>' +
               '<span style="font-size:11px">Make sure you uploaded a <code>.js</code> file, not an HTML page.</span>';
    } else if (msg.includes('404') || msg.includes('not found')) {
      reason = '❌ <strong>File not found (404).</strong><br>Upload <code>firebase-messaging-sw.js</code> to your root folder.';
    }
    setStatus(reason, '#dc2626');
    resetBtn(); return;
  }

  // 6. All done!
  notifEnabled = true;
  localStorage.setItem('laben_notif_enabled', '1');

  // Tell SW to start watching
  postToSW({ type: 'START_WATCH' });

  // Set up SW message listener
  navigator.serviceWorker.addEventListener('message', e => {
    if (e.data && e.data.type === 'OPEN_ADMIN') {
      const el = document.getElementById('adminPanel');
      if (el) new bootstrap.Offcanvas(el).show();
    }
  });

  // Show test notification
  setTimeout(() => showDirectNotification(
    '✅ Notifications ON — The Laben Café',
    'You will now get alerts for every new order, even in background! 🛎️', ''
  ), 500);

  showToast('🔔 Notifications enabled! You will get order alerts.', 'success');
  resetBtn();
  updateNotifStatus();
}

// ── Notification status UI ────────────────────────────────────────────────────
function updateNotifStatus() {
  const el  = document.getElementById('notif-status-text');
  const btn = document.getElementById('notif-enable-btn');
  if (!el) return;

  const secure  = isSecureContext();
  const enabled = notifEnabled || localStorage.getItem('laben_notif_enabled') === '1';

  if (!('Notification' in window)) {
    el.innerHTML = '❌ Notifications not supported in this browser.';
    el.style.color = '#dc2626';
    if (btn) btn.style.display = 'none'; return;
  }
  if (!secure) {
    el.innerHTML = '❌ <strong>HTTPS required.</strong> Notifications only work on https:// sites.';
    el.style.color = '#dc2626';
    if (btn) btn.style.display = 'none'; return;
  }
  if (Notification.permission === 'denied') {
    el.innerHTML = '❌ <strong>Blocked by browser.</strong> Tap 🔒 in address bar → Notifications → Allow → reload.';
    el.style.color = '#dc2626';
    if (btn) btn.style.display = 'none'; return;
  }
  if (Notification.permission === 'granted' && enabled) {
    el.innerHTML = '✅ <strong>Active.</strong> You will get order alerts even when this tab is in the background. 🔔';
    el.style.color = '#16a34a';
    if (btn) {
      btn.style.display = ''; btn.disabled = false;
      btn.innerHTML = '<i class="bi bi-bell-slash me-1"></i> Disable';
      btn.onclick = () => {
        notifEnabled = false;
        localStorage.removeItem('laben_notif_enabled');
        showToast('🔕 Notifications disabled', 'info');
        updateNotifStatus();
      };
    }
    return;
  }
  // Default: not enabled yet
  el.innerHTML = '🔔 Tap <strong>Enable</strong> to get new order alerts even when browser is in background.';
  el.style.color = '#d97706';
  if (btn) {
    btn.style.display = ''; btn.disabled = false;
    btn.innerHTML = '<i class="bi bi-bell-fill me-1"></i> Enable Notifications';
    btn.onclick = enableNotifications;
  }
}

// ── Firebase init ─────────────────────────────────────────────────────────────
function initFirebase() {
  try {
    if (typeof firebase === 'undefined') { console.warn('Firebase SDK not loaded'); return; }
    if (!firebase.apps.length) firebase.initializeApp(FIREBASE_CONFIG);

    firebaseDB = firebase.database();
    firebaseOK = true;
    if (firebase.storage) firebaseStorage = firebase.storage();

    showToast('🔥 Firebase connected!', 'success');

    // ── Orders listener ──────────────────────────────────────────────────────
    firebaseDB.ref('orders').on('value', snapshot => {
      const raw = snapshot.val();
      if (!raw) { fbListenerReady = true; return; }

      const fbArr = Object.entries(raw)
        .map(([k, v]) => ({ ...v, _fbKey: k }))
        .sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));

      const newOrders = [];
      fbArr.forEach(fbO => {
        const local = orders.find(o => o.id === fbO.id);
        if (!local) {
          orders.unshift(fbO);
          if (fbListenerReady && !seenIds.has(fbO.id)) newOrders.push(fbO);
          seenIds.add(fbO.id);
        } else { local.status = fbO.status; local._fbKey = fbO._fbKey; }
      });

      fbListenerReady = true; saveOrders(); _saveSeen();
      const dash = document.getElementById('admin-dashboard');
      if (dash && dash.style.display !== 'none') renderOrdersList();

      newOrders.forEach(o => {
        showToast('🛎️ New order from ' + (o.name || 'customer') + '!', 'info');
        notifyNewOrder(o);
      });

    }, err => showToast('❌ Firebase: ' + err.message, 'error'));

    // ── Categories sync ──────────────────────────────────────────────────────
    firebaseDB.ref('categories').on('value', snap => {
      const d = snap.val();
      if (d && Array.isArray(d)) { categories = d; saveCategories(); refreshMenuTabs(); refreshAdminCatDropdown(); }
    });

    // ── Menu sync ────────────────────────────────────────────────────────────
    firebaseDB.ref('menu').on('value', snap => {
      const d = snap.val(); if (!d) return;
      const m = Array.isArray(d) ? d : Object.values(d); if (!m.length) return;
      m.forEach(fi => { const l = menuData.find(i => i.id === fi.id); if (l) { if (fi.img) l.img = fi.img; } else menuData.push(fi); });
      saveMenu(); renderMenu();
    });

    // Start SW polling if notifications are enabled
    if (notifEnabled && swRegistration) postToSW({ type: 'START_WATCH' });
    updateNotifStatus();

    if (window.location.search.includes('openAdmin=1')) {
      setTimeout(() => { const e = document.getElementById('adminPanel'); if (e) new bootstrap.Offcanvas(e).show(); }, 800);
    }

  } catch(e) {
    console.error('Firebase init error:', e);
    showToast('⚠️ Firebase failed: ' + e.message, 'error');
  }
}

function saveOrderToFirebase(order) {
  if(!firebaseOK||!firebaseDB) return;
  seenIds.add(order.id); _saveSeen();
  firebaseDB.ref('orders').push(order)
    .then(()=>showToast('✅ Order saved to cloud!','success'))
    .catch(()=>showToast('❌ Firebase write failed!','error'));
}
function saveMenuItemToFirebase(item) {
  if(!firebaseOK||!firebaseDB) return;
  firebaseDB.ref('menu/'+item.id).set(item).catch(e=>console.warn(e));
}
function saveCategoriesToFirebase() {
  if(!firebaseOK||!firebaseDB) return;
  firebaseDB.ref('categories').set(categories).catch(e=>console.warn(e));
}

// ── Image helpers ─────────────────────────────────────────────────────────
function fileToBase64(file) {
  return new Promise((res,rej) => {
    const reader=new FileReader();
    reader.onload=e => {
      const img=new Image();
      img.onload=()=>{
        const MAX=400; let w=img.width,h=img.height;
        if(w>MAX){h=Math.round(h*MAX/w);w=MAX;}
        if(h>MAX){w=Math.round(w*MAX/h);h=MAX;}
        const c=document.createElement('canvas'); c.width=w; c.height=h;
        c.getContext('2d').drawImage(img,0,0,w,h);
        res(c.toDataURL('image/jpeg',0.75));
      };
      img.onerror=rej; img.src=e.target.result;
    };
    reader.onerror=rej; reader.readAsDataURL(file);
  });
}
function getItemImage(item) {
  if(item.img&&item.img.length>10) return item.img;
  return LOCAL_ITEM_IMAGES[item.name]||CATEGORY_IMAGES[item.cat]||CATEGORY_IMAGES.pizza;
}

// ── Menu tabs ─────────────────────────────────────────────────────────────
function refreshMenuTabs() {
  const tabsEl=document.getElementById('menuTabs'); if(!tabsEl) return;
  const icons={coffee:'☕',fries:'🍟',sandwich:'🥪',pizza:'🍕',burger:'🍔',maggi:'🍜'};
  tabsEl.innerHTML=['all',...categories].map(cat=>{
    const label=cat==='all'?'All Items':cat.charAt(0).toUpperCase()+cat.slice(1);
    return `<li class="nav-item"><button class="menu-tab${cat===currentCat?' active':''}" data-cat="${cat}">${icons[cat]?icons[cat]+' ':''}${label}</button></li>`;
  }).join('');
  tabsEl.querySelectorAll('.menu-tab').forEach(btn=>{
    btn.addEventListener('click',()=>{
      tabsEl.querySelectorAll('.menu-tab').forEach(b=>b.classList.remove('active'));
      btn.classList.add('active'); currentCat=btn.dataset.cat; renderMenu();
    });
  });
}

// ── Render menu ───────────────────────────────────────────────────────────
function renderMenu() {
  const grid=document.getElementById('menu-grid'); if(!grid) return;
  const items=currentCat==='all'?menuData:menuData.filter(i=>i.cat===currentCat);
  if(!items.length){grid.innerHTML=`<div class="col-12 text-center text-muted py-5"><i class="bi bi-search fs-2 d-block mb-2"></i>No items in this category.</div>`;return;}
  grid.innerHTML=items.map(item=>{
    const imgSrc=getItemImage(item),fallback=CATEGORY_IMAGES[item.cat]||CATEGORY_IMAGES.pizza;
    const catLabel=item.cat.charAt(0).toUpperCase()+item.cat.slice(1);
    return `<div class="col-6 col-md-4 col-lg-3 fade-in"><div class="menu-card">
      <div class="menu-card-img"><img src="${imgSrc}" alt="${item.name}" loading="lazy" onerror="this.onerror=null;this.src='${fallback}';"><span class="menu-card-cat">${catLabel}</span></div>
      <div class="menu-card-body"><div class="menu-card-name">${item.name}</div><div class="menu-card-desc">${item.desc}</div>
        <div class="menu-card-footer"><span class="menu-card-price">₹${item.price}</span>
          <button class="btn-add-cart" onclick="addToCart(${item.id})"><i class="bi bi-plus-lg"></i></button>
        </div></div></div></div>`;
  }).join('');
  observeFadeIn();
}

// ── Cart ──────────────────────────────────────────────────────────────────
function addToCart(itemId) {
  const item=menuData.find(i=>i.id===itemId); if(!item) return;
  const ex=cart.find(c=>c.id===itemId);
  if(ex) ex.qty++; else cart.push({id:item.id,name:item.name,price:item.price,qty:1});
  saveCart(); updateCartUI(); showAddedFeedback(itemId);
}
function removeFromCart(itemId) {
  const idx=cart.findIndex(c=>c.id===itemId); if(idx===-1) return;
  if(cart[idx].qty>1) cart[idx].qty--; else cart.splice(idx,1);
  saveCart(); updateCartUI();
}
function clearCart()    { cart=[]; saveCart(); updateCartUI(); }
function getCartTotal() { return cart.reduce((s,c)=>s+c.price*c.qty,0); }

function updateCartUI() {
  const qty=cart.reduce((s,c)=>s+c.qty,0);
  document.getElementById('cart-count').textContent=qty;
  const list=document.getElementById('cart-items-list');
  if(!cart.length){
    list.innerHTML=`<div class="cart-empty"><i class="bi bi-bag-x"></i>Your cart is empty.<br><small class="text-muted">Add items from the menu!</small></div>`;
  } else {
    list.innerHTML=cart.map(c=>`<div class="cart-item-row">
      <div class="cart-item-info"><div class="cart-item-name">${c.name}</div><div class="cart-item-price">₹${c.price} each</div></div>
      <div class="cart-qty-controls">
        <button class="qty-btn" onclick="removeFromCart(${c.id})"><i class="bi bi-dash"></i></button>
        <span class="qty-num">${c.qty}</span>
        <button class="qty-btn" onclick="addToCart(${c.id})"><i class="bi bi-plus"></i></button>
      </div>
      <strong style="min-width:52px;text-align:right;color:var(--accent)">₹${c.price*c.qty}</strong>
    </div>`).join('');
  }
  document.getElementById('cart-total').textContent=getCartTotal();
  const sb=document.getElementById('order-summary-box'); if(!sb) return;
  if(!cart.length){sb.innerHTML=`<p class="mb-0 text-muted">Your cart is empty. Add items from the menu above.</p>`;}
  else{sb.innerHTML=`<strong class="d-block mb-2"><i class="bi bi-bag me-1"></i>Order Summary</strong>
    ${cart.map(c=>`<div class="d-flex justify-content-between"><span>${c.name} × ${c.qty}</span><span>₹${c.price*c.qty}</span></div>`).join('')}
    <hr class="my-2"><div class="d-flex justify-content-between fw-bold"><span>Total</span><span style="color:var(--accent)">₹${getCartTotal()}</span></div>`;}
}
function showAddedFeedback(itemId) {
  const btn=document.querySelector(`.btn-add-cart[onclick="addToCart(${itemId})"]`); if(!btn) return;
  btn.style.background='#16a34a'; btn.innerHTML='<i class="bi bi-check-lg"></i>';
  setTimeout(()=>{btn.style.background='';btn.innerHTML='<i class="bi bi-plus-lg"></i>';},900);
}
function scrollToOrder() {
  const oc=bootstrap.Offcanvas.getInstance(document.getElementById('cartPanel')); if(oc) oc.hide();
  setTimeout(()=>document.getElementById('order').scrollIntoView({behavior:'smooth'}),300);
}

// ── Order placement ───────────────────────────────────────────────────────
function placeOrder(e) {
  e.preventDefault(); if(!cart.length){alert('Your cart is empty!');return;}
  const payment=document.getElementById('ord-payment').value;
  if(payment==='UPI'&&!upiPaymentConfirmed){openUpiModal(getCartTotal());return;}
  const name=document.getElementById('ord-name').value;
  const phone=document.getElementById('ord-phone').value;
  const address=document.getElementById('ord-address').value;
  const note=document.getElementById('ord-note').value;
  const orderId='LBN'+Date.now().toString().slice(-6);
  const timeStr=new Date().toLocaleString('en-IN',{day:'2-digit',month:'short',year:'numeric',hour:'2-digit',minute:'2-digit',hour12:true});
  const newOrder={id:orderId,time:timeStr,timestamp:Date.now(),name,phone,address,payment,note:note||'',items:JSON.parse(JSON.stringify(cart)),total:getCartTotal(),status:'new'};
  orders.unshift(newOrder); saveOrders(); saveOrderToFirebase(newOrder);
  showOrderConfirmation(orderId,name,phone,address,payment,note,getCartTotal());
  upiPaymentConfirmed=false; clearCart();
  document.getElementById('orderForm').reset();
  document.getElementById('upi-info-hint').style.display='none';
}
function showOrderConfirmation(orderId,name,phone,address,payment,note,total,utrId) {
  const conf=document.getElementById('order-confirmation'); if(!conf) return;
  conf.style.display='block';
  conf.innerHTML=`<div class="order-success">
    <i class="bi bi-check-circle-fill me-2"></i><strong>Order Placed Successfully!</strong><br>
    <span class="small">Order ID: <strong>${orderId}</strong></span><br>
    <span class="small">Name: ${name} | Phone: ${phone}</span><br>
    <span class="small">Delivery: ${address}</span><br>
    <span class="small">Payment: ${payment} | Total: <strong>₹${total}</strong></span>
    ${utrId?`<br><span class="small">UTR: <strong style="font-family:monospace;color:#5f259f">${utrId}</strong></span>`:''}
    ${note?`<br><span class="small">Note: ${note}</span>`:''}
    <br><span class="small text-success">We'll call you shortly to confirm. 🙏</span>
  </div>`;
  conf.scrollIntoView({behavior:'smooth'});
}

// ── Admin ─────────────────────────────────────────────────────────────────
function adminLogin() {
  const u=document.getElementById('adm-user').value,p=document.getElementById('adm-pass').value;
  if(u==='admin'&&p==='laben123'){
    document.getElementById('admin-login-wrap').style.display='none';
    document.getElementById('admin-dashboard').style.display='block';
    updateNotifStatus(); switchAdminTab('orders');
  } else { document.getElementById('adm-err').style.display='block'; }
}
function adminLogout() {
  document.getElementById('admin-login-wrap').style.display='block';
  document.getElementById('admin-dashboard').style.display='none';
  document.getElementById('adm-user').value=''; document.getElementById('adm-pass').value='';
}
function switchAdminTab(tab) {
  document.querySelectorAll('.adm-tab-btn').forEach(b=>b.classList.remove('active'));
  document.getElementById('adm-tab-'+tab).classList.add('active');
  ['orders','menu','catmgr'].forEach(t=>{document.getElementById('adm-panel-'+t).style.display=t===tab?'block':'none';});
  if(tab==='orders') renderOrdersList();
  if(tab==='menu')   renderAdminList();
  if(tab==='catmgr') renderCategoryManager();
}

// ── Category manager ──────────────────────────────────────────────────────
function refreshAdminCatDropdown() {
  const sel=document.getElementById('adm-cat'); if(!sel) return;
  sel.innerHTML=categories.map(c=>`<option value="${c}">${c.charAt(0).toUpperCase()+c.slice(1)}</option>`).join('');
}
function renderCategoryManager() {
  const wrap=document.getElementById('adm-cat-list'); if(!wrap) return;
  if(!categories.length){wrap.innerHTML=`<p class="text-muted small text-center py-3">No categories yet.</p>`;return;}
  wrap.innerHTML=categories.map(cat=>{
    const count=menuData.filter(i=>i.cat===cat).length;
    return `<div class="adm-cat-row">
      <div style="display:flex;align-items:center;gap:8px;flex:1;"><span style="font-weight:600;text-transform:capitalize;">${cat}</span><span class="cat-badge">${count} item${count!==1?'s':''}</span></div>
      <div style="display:flex;gap:6px;">
        <button onclick="startRenameCat('${cat}')" class="adm-edit-btn"><i class="bi bi-pencil-fill"></i> Rename</button>
        <button onclick="deleteCategory('${cat}')" class="adm-del-btn"><i class="bi bi-trash3-fill"></i></button>
      </div></div>
    <div id="cat-rename-${cat}" style="display:none;padding:8px 0 10px;border-bottom:1px dashed #eee;">
      <div style="display:flex;gap:6px;align-items:center;">
        <input type="text" id="cat-rename-input-${cat}" value="${cat}" class="form-control form-control-sm" style="max-width:200px;">
        <button onclick="saveCategoryRename('${cat}')" class="btn btn-sm" style="background:#e8500a;color:#fff;border:none;border-radius:8px;padding:4px 12px;font-size:12px;">Save</button>
        <button onclick="cancelCatRename('${cat}')" class="btn btn-sm" style="background:#eee;border:none;border-radius:8px;padding:4px 10px;font-size:12px;">✕</button>
      </div></div>`;
  }).join('');
}
function startRenameCat(cat){document.getElementById('cat-rename-'+cat).style.display='block';document.getElementById('cat-rename-input-'+cat).focus();}
function cancelCatRename(cat){document.getElementById('cat-rename-'+cat).style.display='none';}
function saveCategoryRename(oldCat){
  const input=document.getElementById('cat-rename-input-'+oldCat);
  const newCat=input.value.trim().toLowerCase().replace(/\s+/g,'');
  if(!newCat){showToast('Enter a valid name','error');return;}
  if(newCat===oldCat){cancelCatRename(oldCat);return;}
  if(categories.includes(newCat)){showToast('Already exists!','warning');return;}
  categories[categories.indexOf(oldCat)]=newCat;
  menuData.forEach(i=>{if(i.cat===oldCat)i.cat=newCat;});
  saveMenu();saveCategories();saveCategoriesToFirebase();
  refreshMenuTabs();refreshAdminCatDropdown();renderCategoryManager();renderMenu();
  showToast('Renamed to "'+newCat+'"','success');
}
function addCategory(){
  const input=document.getElementById('adm-new-cat-input');
  const newCat=input.value.trim().toLowerCase().replace(/\s+/g,'');
  if(!newCat){showToast('Enter a name','error');return;}
  if(categories.includes(newCat)){showToast('Already exists!','warning');return;}
  categories.push(newCat);saveCategories();saveCategoriesToFirebase();
  refreshMenuTabs();refreshAdminCatDropdown();renderCategoryManager();
  input.value='';showToast('"'+newCat+'" added!','success');
}
function deleteCategory(cat){
  const count=menuData.filter(i=>i.cat===cat).length;
  if(!confirm(count>0?`Delete "${cat}"? ${count} items will also be removed.`:`Delete "${cat}"?`))return;
  categories=categories.filter(c=>c!==cat);
  if(count>0)menuData=menuData.filter(i=>i.cat!==cat);
  saveMenu();saveCategories();saveCategoriesToFirebase();
  refreshMenuTabs();refreshAdminCatDropdown();renderCategoryManager();renderAdminList();renderMenu();
  showToast('Deleted!','success');
}

// ── Image handlers ────────────────────────────────────────────────────────
async function handleNewItemImageUpload(event){
  const file=event.target.files[0];if(!file)return;
  try{const b64=await fileToBase64(file);pendingNewItemImg=b64;
    const p=document.getElementById('adm-new-img-preview'),l=document.getElementById('adm-new-img-label');
    if(p){p.src=b64;p.style.display='block';}if(l)l.textContent='✅ '+file.name.slice(0,18);
  }catch(e){showToast('Image load failed','error');}
}
function applyNewUrlImage(){
  const url=(document.getElementById('adm-new-url-input')||{}).value?.trim()||'';
  if(!url){showToast('Enter a URL','error');return;}pendingNewItemImg=url;showToast('✅ Image URL set','success');
}
async function handleEditItemImageUpload(event,itemId){
  const file=event.target.files[0];if(!file)return;
  try{const b64=await fileToBase64(file);
    const p=document.getElementById('adm-edit-img-preview-'+itemId),l=document.getElementById('adm-edit-img-label-'+itemId);
    if(p){p.src=b64;p.dataset.pending=b64;}if(l)l.textContent='✅ '+file.name.slice(0,18);
  }catch(e){showToast('Image load failed','error');}
}
function applyUrlImage(itemId){
  const url=(document.getElementById('adm-edit-url-input-'+itemId)||{}).value?.trim()||'';
  const p=document.getElementById('adm-edit-img-preview-'+itemId);
  if(!url){showToast('Enter a URL','error');return;}
  if(p){p.src=url;p.dataset.pending=url;}showToast('✅ Image URL applied','success');
}

// ── Admin item list ───────────────────────────────────────────────────────
function adminAddItem(){
  const name=(document.getElementById('adm-name')||{}).value?.trim()||'';
  const price=parseInt((document.getElementById('adm-price')||{}).value,10)||0;
  const desc=(document.getElementById('adm-desc')||{}).value?.trim()||'';
  const cat=(document.getElementById('adm-cat')||{}).value||categories[0]||'other';
  if(!name){showToast('Enter item name','error');return;}
  if(price<1){showToast('Enter valid price','error');return;}
  const newItem={id:nextId++,name,price,desc,cat,img:pendingNewItemImg||''};
  menuData.push(newItem);saveMenu();saveMenuItemToFirebase(newItem);renderMenu();renderAdminList();
  document.getElementById('adm-name').value='';document.getElementById('adm-price').value='';document.getElementById('adm-desc').value='';
  pendingNewItemImg='';
  const p=document.getElementById('adm-new-img-preview'),l=document.getElementById('adm-new-img-label');
  if(p){p.src='';p.style.display='none';}if(l)l.textContent='Choose Image';
  showToast('"'+name+'" added!','success');
}
function adminDeleteItem(itemId){
  if(!confirm('Delete this item?'))return;
  menuData=menuData.filter(i=>i.id!==itemId);saveMenu();renderMenu();renderAdminList();
  if(firebaseOK&&firebaseDB)firebaseDB.ref('menu/'+itemId).remove().catch(()=>{});
  showToast('Item deleted','success');
}
function startEditItem(itemId){
  document.querySelectorAll('[id^="adm-item-edit-"]').forEach(el=>{if(el.id!=='adm-item-edit-'+itemId)el.style.display='none';});
  const form=document.getElementById('adm-item-edit-'+itemId);
  if(form)form.style.display=form.style.display==='none'?'block':'none';
}
function cancelEditItem(itemId){const f=document.getElementById('adm-item-edit-'+itemId);if(f)f.style.display='none';}
function saveEditItem(itemId){
  const item=menuData.find(i=>i.id===itemId);if(!item)return;
  const name=(document.getElementById('adm-edit-name-'+itemId)||{}).value?.trim()||item.name;
  const price=parseInt((document.getElementById('adm-edit-price-'+itemId)||{}).value,10)||item.price;
  const cat=(document.getElementById('adm-edit-cat-'+itemId)||{}).value||item.cat;
  const desc=(document.getElementById('adm-edit-desc-'+itemId)||{}).value?.trim()||'';
  const preview=document.getElementById('adm-edit-img-preview-'+itemId);
  if(!name){showToast('Name required','error');return;}if(!price){showToast('Price required','error');return;}
  item.name=name;item.price=price;item.cat=cat;item.desc=desc;
  if(preview&&preview.dataset.pending){item.img=preview.dataset.pending;delete preview.dataset.pending;}
  saveMenu();saveMenuItemToFirebase(item);renderMenu();renderAdminList();showToast('Saved!','success');
}
function renderAdminList(){
  const wrap=document.getElementById('adm-items-list'),countEl=document.getElementById('adm-count');
  if(!wrap)return;if(countEl)countEl.textContent=menuData.length;
  if(!menuData.length){wrap.innerHTML=`<p class="text-muted small text-center py-3">No menu items yet.</p>`;return;}
  wrap.innerHTML=menuData.map(item=>{
    const imgSrc=getItemImage(item),fallback=CATEGORY_IMAGES[item.cat]||CATEGORY_IMAGES.pizza;
    const safeName=item.name.replace(/"/g,'&quot;'),safeDesc=(item.desc||'').replace(/"/g,'&quot;');
    const catOpts=categories.map(c=>`<option value="${c}"${c===item.cat?' selected':''}>${c.charAt(0).toUpperCase()+c.slice(1)}</option>`).join('');
    return `<div style="display:flex;flex-wrap:wrap;gap:8px;align-items:center;padding:10px 0;border-bottom:1px solid #f5f5f5;">
      <img src="${imgSrc}" onerror="this.src='${fallback}'" style="width:48px;height:48px;object-fit:cover;border-radius:10px;flex-shrink:0;border:1px solid #eee;">
      <div style="flex:1;min-width:0;"><div style="font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${item.name}</div>
        <div><span class="cat-badge">${item.cat}</span>${item.desc?`<span class="ms-1 small text-muted">${item.desc.slice(0,28)}${item.desc.length>28?'…':''}</span>`:''}</div></div>
      <span style="flex-shrink:0;font-weight:700;color:var(--accent);">₹${item.price}</span>
      <button onclick="startEditItem(${item.id})" class="adm-edit-btn" style="flex-shrink:0;"><i class="bi bi-pencil-fill"></i></button>
      <button onclick="adminDeleteItem(${item.id})" class="adm-del-btn" style="flex-shrink:0;"><i class="bi bi-trash3-fill"></i></button>
      <div id="adm-item-edit-${item.id}" style="display:none;width:100%;padding-top:12px;border-top:1px dashed #eee;margin-top:8px;">
        <div class="row g-2">
          <div class="col-12"><label class="form-label small fw-bold mb-1">Name</label><input type="text" id="adm-edit-name-${item.id}" class="form-control form-control-sm" value="${safeName}"></div>
          <div class="col-6"><label class="form-label small fw-bold mb-1">Price (₹)</label><input type="number" id="adm-edit-price-${item.id}" class="form-control form-control-sm" value="${item.price}" min="1"></div>
          <div class="col-6"><label class="form-label small fw-bold mb-1">Category</label><select id="adm-edit-cat-${item.id}" class="form-select form-select-sm">${catOpts}</select></div>
          <div class="col-12"><label class="form-label small fw-bold mb-1">Description</label><input type="text" id="adm-edit-desc-${item.id}" class="form-control form-control-sm" value="${safeDesc}"></div>
          <div class="col-12">
            <label class="form-label small fw-bold mb-1">Image</label>
            <div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin-bottom:8px;">
              <img id="adm-edit-img-preview-${item.id}" src="${imgSrc}" onerror="this.src='${fallback}'" style="width:60px;height:60px;object-fit:cover;border-radius:10px;border:1px solid #eee;flex-shrink:0;">
              <label style="cursor:pointer;background:#f5f5f5;border:1.5px dashed #ccc;border-radius:10px;padding:8px 14px;font-size:12px;color:#666;">
                <span id="adm-edit-img-label-${item.id}">📷 Upload</span>
                <input type="file" accept="image/*" style="display:none;" onchange="handleEditItemImageUpload(event,${item.id})">
              </label>
            </div>
            <div style="display:flex;gap:6px;">
              <input type="text" id="adm-edit-url-input-${item.id}" class="form-control form-control-sm" placeholder="Or paste image URL" style="flex:1;">
              <button type="button" onclick="applyUrlImage(${item.id})" class="btn btn-sm" style="background:#5f259f;color:#fff;border:none;border-radius:8px;padding:5px 12px;font-size:12px;white-space:nowrap;">Apply URL</button>
            </div>
          </div>
          <div class="col-12 d-flex gap-2 mt-1">
            <button onclick="saveEditItem(${item.id})" class="btn btn-sm flex-fill" style="background:#e8500a;color:#fff;border:none;border-radius:8px;">💾 Save</button>
            <button onclick="cancelEditItem(${item.id})" class="btn btn-sm flex-fill" style="background:#eee;border:none;border-radius:8px;">✕ Cancel</button>
          </div>
        </div>
      </div>
    </div>`;
  }).join('');
}

// ── Orders list ───────────────────────────────────────────────────────────
function renderOrdersList(){
  const wrap=document.getElementById('adm-orders-list');if(!wrap)return;
  const filter=(document.getElementById('adm-order-filter')||{}).value||'all';
  const filtered=filter==='all'?orders:orders.filter(o=>o.status===filter);
  const countEl=document.getElementById('adm-orders-count');if(countEl)countEl.textContent=orders.length;
  const newCount=orders.filter(o=>o.status==='new').length;
  const badge=document.getElementById('adm-new-badge');
  if(badge){badge.textContent=newCount;badge.style.display=newCount>0?'inline-block':'none';}
  const revenue=orders.filter(o=>o.status==='delivered').reduce((s,o)=>s+o.total,0);
  const statsEl=document.getElementById('adm-order-stats');
  if(statsEl)statsEl.innerHTML=`<div class="adm-stat-pill"><i class="bi bi-receipt me-1"></i><strong>${orders.length}</strong> Total</div>
    <div class="adm-stat-pill new-pill"><i class="bi bi-bell me-1"></i><strong>${newCount}</strong> New</div>
    <div class="adm-stat-pill prep-pill"><i class="bi bi-fire me-1"></i><strong>${orders.filter(o=>o.status==='preparing').length}</strong> Preparing</div>
    <div class="adm-stat-pill done-pill"><i class="bi bi-check2-circle me-1"></i><strong>₹${revenue}</strong> Earned</div>`;
  if(!filtered.length){wrap.innerHTML=`<div style="text-align:center;padding:2.5rem 1rem;color:#999;"><i class="bi bi-inbox" style="font-size:2.5rem;display:block;margin-bottom:.75rem;opacity:.4;"></i>No orders found.</div>`;return;}
  const sC={new:'#e8500a',preparing:'#d97706',delivered:'#16a34a'};
  const sB={new:'#fff4f0',preparing:'#fffbeb',delivered:'#f0fdf4'};
  const sL={new:'🆕 New Order',preparing:'🍳 Preparing',delivered:'✅ Delivered'};
  const pI={COD:'💵',UPI:'📱',Card:'💳'};
  wrap.innerHTML=filtered.map(o=>{
    const tot=o.items.reduce((s,it)=>s+it.price*it.qty,0);
    return `<div class="adm-order-card" style="border-left:4px solid ${sC[o.status]}">
      <div class="adm-order-head">
        <div class="d-flex align-items-center gap-2 flex-wrap"><span class="adm-order-id">#${o.id}</span><span class="adm-order-time"><i class="bi bi-clock me-1"></i>${o.time}</span></div>
        <span class="adm-order-status-badge" style="background:${sB[o.status]};color:${sC[o.status]};border:1px solid ${sC[o.status]}33">${sL[o.status]}</span>
      </div>
      <div class="adm-detail-section"><div class="adm-detail-label"><i class="bi bi-person-fill me-1"></i>Customer</div>
        <div class="adm-detail-grid">
          <div class="adm-detail-row"><span class="adm-detail-key">Name</span><span class="adm-detail-val"><strong>${o.name}</strong></span></div>
          <div class="adm-detail-row"><span class="adm-detail-key">Phone</span><span class="adm-detail-val"><a href="tel:${o.phone}" style="color:var(--accent);text-decoration:none;font-weight:600;"><i class="bi bi-telephone-fill me-1"></i>${o.phone}</a></span></div>
          <div class="adm-detail-row"><span class="adm-detail-key">Address</span><span class="adm-detail-val"><i class="bi bi-geo-alt-fill me-1" style="color:#e8500a"></i>${o.address}</span></div>
        </div>
      </div>
      <div class="adm-detail-section"><div class="adm-detail-label"><i class="bi bi-credit-card-fill me-1"></i>Payment</div>
        <div class="adm-detail-grid">
          <div class="adm-detail-row"><span class="adm-detail-key">Method</span><span class="adm-detail-val"><span class="adm-pay-badge">${pI[o.payment]||'💰'} ${o.payment}</span></span></div>
          <div class="adm-detail-row"><span class="adm-detail-key">Amount</span><span class="adm-detail-val" style="font-size:1.1rem;font-weight:700;color:var(--accent)">₹${o.total}</span></div>
          ${o.utrId?`<div class="adm-detail-row"><span class="adm-detail-key">UTR</span><span class="adm-detail-val" style="font-family:monospace;font-weight:700;color:#5f259f;">${o.utrId}</span></div>`:''}
        </div>
      </div>
      <div class="adm-detail-section"><div class="adm-detail-label"><i class="bi bi-bag-fill me-1"></i>Items</div>
        <div class="adm-items-table">
          ${o.items.map(it=>`<div class="adm-item-row"><span class="adm-item-row-name">${it.name}</span><span class="adm-item-row-qty">×${it.qty}</span><span class="adm-item-row-price">₹${it.price*it.qty}</span></div>`).join('')}
          <div class="adm-item-row adm-item-total-row"><span class="adm-item-row-name" style="font-weight:700">Total</span><span class="adm-item-row-qty"></span><span class="adm-item-row-price" style="color:var(--accent);font-weight:700;">₹${tot}</span></div>
        </div>
      </div>
      ${o.note?`<div class="adm-detail-section"><div class="adm-detail-label"><i class="bi bi-chat-left-text-fill me-1"></i>Note</div><div class="adm-note-box">${o.note}</div></div>`:''}
      <div class="adm-order-actions-row">
        ${o.status==='new'?`<button class="adm-status-btn preparing" onclick="updateOrderStatus('${o.id}','preparing')"><i class="bi bi-fire me-1"></i>Start Preparing</button>`:''}
        ${o.status==='preparing'?`<button class="adm-status-btn delivered" onclick="updateOrderStatus('${o.id}','delivered')"><i class="bi bi-check2-circle me-1"></i>Mark Delivered</button>`:''}
        ${o.status==='delivered'?`<span class="adm-done-tag"><i class="bi bi-check-circle-fill me-1"></i>Completed</span>`:''}
        <button class="adm-del-btn" onclick="deleteOrder('${o.id}')"><i class="bi bi-trash3"></i> Delete</button>
      </div>
    </div>`;
  }).join('');
}
function updateOrderStatus(orderId,newStatus){
  const order=orders.find(o=>o.id===orderId);if(!order)return;
  order.status=newStatus;saveOrders();renderOrdersList();
  if(firebaseOK&&firebaseDB&&order._fbKey)firebaseDB.ref('orders/'+order._fbKey).update({status:newStatus}).catch(()=>{});
}
function deleteOrder(orderId){
  if(!confirm('Delete this order?'))return;
  const order=orders.find(o=>o.id===orderId);
  orders=orders.filter(o=>o.id!==orderId);saveOrders();renderOrdersList();
  if(firebaseOK&&firebaseDB&&order&&order._fbKey)firebaseDB.ref('orders/'+order._fbKey).remove().catch(()=>{});
}
function clearAllOrders(){
  if(!confirm('Clear ALL delivered orders?'))return;
  orders=orders.filter(o=>o.status!=='delivered');saveOrders();renderOrdersList();
}

// ── Scroll animations ─────────────────────────────────────────────────────
function observeFadeIn(){
  const obs=new IntersectionObserver(entries=>{
    entries.forEach((e,i)=>{if(e.isIntersecting){setTimeout(()=>e.target.classList.add('visible'),i*60);obs.unobserve(e.target);}});
  },{threshold:0.1});
  document.querySelectorAll('.fade-in:not(.visible)').forEach(el=>obs.observe(el));
}
window.addEventListener('scroll',()=>{
  const nav=document.getElementById('mainNav');if(!nav)return;
  nav.style.background=window.scrollY>50?'rgba(26,20,16,0.98)':'rgba(26,20,16,0.95)';
  nav.style.boxShadow=window.scrollY>50?'0 2px 20px rgba(0,0,0,0.3)':'none';
});

// ── UPI modal ─────────────────────────────────────────────────────────────
var UPI_ID='9665539828@ibl',UPI_NAME='The Laben Cafe';
function handlePaymentChange(){const m=document.getElementById('ord-payment').value;document.getElementById('upi-info-hint').style.display=m==='UPI'?'flex':'none';if(m!=='UPI')upiPaymentConfirmed=false;}
function copyUpiId(){navigator.clipboard.writeText(UPI_ID).then(()=>showToast('Copied: '+UPI_ID,'success'));}
function openUpiModal(amount){
  document.getElementById('upi-display-amount').textContent=amount;
  document.getElementById('upi-id-text').textContent=UPI_ID;
  const link='upi://pay?pa='+UPI_ID+'&pn='+encodeURIComponent(UPI_NAME)+'&am='+amount+'&cu=INR&tn=The%20Laben%20Cafe%20Order';
  document.getElementById('upi-deep-link').href=link;
  document.getElementById('upi-qr-img').src='https://api.qrserver.com/v1/create-qr-code/?size=180x180&data='+encodeURIComponent(link);
  const u=document.getElementById('upi-utr-input');if(u)u.value='';
  const er=document.getElementById('upi-utr-error');if(er)er.style.display='none';
  document.getElementById('upiModal').classList.add('active');
}
function closeUpiModal(){document.getElementById('upiModal').classList.remove('active');}
function validateUtrInput(){const i=document.getElementById('upi-utr-input'),e=document.getElementById('upi-utr-error');if(i&&e)e.style.display=(i.value.trim().length>0&&i.value.trim().length<8)?'block':'none';}
function confirmUpiPayment(){
  const ui=document.getElementById('upi-utr-input'),ue=document.getElementById('upi-utr-error'),uv=ui?ui.value.trim():'';
  if(!uv||uv.length<8){if(ue)ue.style.display='block';if(ui){ui.focus();ui.style.borderColor='#dc2626';ui.style.boxShadow='0 0 0 3px rgba(220,38,38,.15)';setTimeout(()=>{ui.style.borderColor='';ui.style.boxShadow='';},2500);}return;}
  const name=document.getElementById('ord-name').value.trim(),phone=document.getElementById('ord-phone').value.trim(),address=document.getElementById('ord-address').value.trim();
  if(!name||!phone||!address){closeUpiModal();alert('Please fill Name, Phone, and Address first.');return;}
  closeUpiModal();
  const note=document.getElementById('ord-note').value;
  const orderId='LBN'+Date.now().toString().slice(-6);
  const timeStr=new Date().toLocaleString('en-IN',{day:'2-digit',month:'short',year:'numeric',hour:'2-digit',minute:'2-digit',hour12:true});
  const newOrder={id:orderId,time:timeStr,timestamp:Date.now(),name,phone,address,payment:'UPI',utrId:uv,note:note||'',items:JSON.parse(JSON.stringify(cart)),total:getCartTotal(),status:'new'};
  orders.unshift(newOrder);saveOrders();saveOrderToFirebase(newOrder);
  showOrderConfirmation(orderId,name,phone,address,'UPI',note,getCartTotal(),uv);
  clearCart();document.getElementById('orderForm').reset();document.getElementById('upi-info-hint').style.display='none';
}

// ── Service Worker — register silently at boot ───────────────────────────────
// Works for BOTH GitHub Pages (repo site) and custom domain root sites
if ('serviceWorker' in navigator && isSecureContext()) {
  // Detect GitHub Pages repo path (e.g. /laben-cafe/) vs root domain
  const swPath = (function() {
    const p = location.pathname;
    // If hosted at root (custom domain or username.github.io root), use /
    // If hosted under a repo path like /repo-name/, use that path
    const parts = p.split('/').filter(Boolean);
    const base = parts.length > 0 && !p.endsWith('.html') ? '/' + parts[0] + '/' : '/';
    // Check if index.html is at root or in a subfolder
    // We detect by seeing if the SW file should be relative or absolute
    return base === '/' ? '/firebase-messaging-sw.js' : base + 'firebase-messaging-sw.js';
  })();

  const swScope = (function() {
    const p = location.pathname;
    const parts = p.split('/').filter(Boolean);
    return parts.length > 0 && !p.endsWith('.html') ? '/' + parts[0] + '/' : '/';
  })();

  navigator.serviceWorker.register(swPath, { scope: swScope })
    .then(reg => {
      swRegistration = reg;
      console.log('✅ SW registered at:', swPath, 'scope:', reg.scope);
      navigator.serviceWorker.addEventListener('message', e => {
        if (e.data && e.data.type === 'OPEN_ADMIN') {
          const el = document.getElementById('adminPanel');
          if (el) new bootstrap.Offcanvas(el).show();
        }
      });
      if (notifEnabled) postToSW({ type: 'START_WATCH' });
    })
    .catch(err => {
      console.warn('[SW] Boot registration failed:', err.message);
    });
}

// ── Boot ──────────────────────────────────────────────────────────────────
refreshMenuTabs();
renderMenu();
updateCartUI();
refreshAdminCatDropdown();

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => { updateNotifStatus(); initFirebase(); });
} else {
  updateNotifStatus();
  initFirebase();
}
