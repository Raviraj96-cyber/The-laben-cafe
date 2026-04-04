// =====================================================================
// THE LABEN CAFÉ — app.js
// Features:
//  • FCM push notifications (arrive even when browser is closed)
//  • Menu image upload & change per item (stored in Firebase Storage)
//  • Add/edit/delete menu items with images
//  • Category manager (add/rename/delete)
//  • Full order management with Firebase sync
// =====================================================================

// ===== YOUR FCM VAPID KEY =====
// Get this from Firebase Console → Project Settings → Cloud Messaging → Web Push certificates
// Click "Generate key pair" and paste the key here
const FCM_VAPID_KEY = 'YOUR_VAPID_KEY_HERE';
// IMPORTANT: Replace above with your actual VAPID key from Firebase Console
// Firebase Console → Project Settings → Cloud Messaging tab → Web Push certificates

// ===== FIREBASE CONFIG =====
const FIREBASE_CONFIG = {
  apiKey:            "AIzaSyAQ_8cq9DWzXb5bgl2SpY5xI5TYKd-6dfA",
  authDomain:        "laben-cafe.firebaseapp.com",
  databaseURL:       "https://laben-cafe-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId:         "laben-cafe",
  storageBucket:     "laben-cafe.firebasestorage.app",
  messagingSenderId: "236045385314",
  appId:             "1:236045385314:web:a363accd4d0b9f0fe35b3b"
};

// ===== CATEGORY FALLBACK IMAGES =====
const CATEGORY_IMAGES = {
  coffee:   'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?w=400&q=80',
  fries:    'https://images.unsplash.com/photo-1585325701956-60dd9c8553bc?w=400&q=80',
  sandwich: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=400&q=80',
  pizza:    'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80',
  burger:   'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80',
  maggi:    'https://images.unsplash.com/photo-1555126634-323283e090fa?w=400&q=80',
};

// ===== LOCAL ITEM IMAGES (before Firebase storage upload) =====
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

// ===== STATE =====
let menuData   = JSON.parse(localStorage.getItem('laben_menu')       || 'null') || JSON.parse(JSON.stringify(DEFAULT_MENU));
let categories = JSON.parse(localStorage.getItem('laben_categories') || 'null') || [...DEFAULT_CATEGORIES];
let cart       = JSON.parse(localStorage.getItem('laben_cart')       || '[]');
let orders     = JSON.parse(localStorage.getItem('laben_orders')     || '[]');
let nextId     = menuData.reduce((a,b) => Math.max(a,b.id), 0) + 1;
let currentCat = 'all';
let upiPaymentConfirmed = false;
let firebaseDB  = null;
let firebaseStorage = null;
let firebaseMessaging = null;
let firebaseOK  = false;
let fcmToken    = null;
let seenOrderIds = new Set(orders.map(o => o.id));

// Pending image for new item being added
let pendingNewItemImg = '';

function saveMenu()       { localStorage.setItem('laben_menu',       JSON.stringify(menuData));   }
function saveCategories() { localStorage.setItem('laben_categories', JSON.stringify(categories)); }
function saveCart()       { localStorage.setItem('laben_cart',       JSON.stringify(cart));       }
function saveOrders()     { localStorage.setItem('laben_orders',     JSON.stringify(orders));     }

// ===== TOAST =====
function showToast(msg, type) {
  const old = document.getElementById('laben-toast');
  if (old) old.remove();
  const colors = { success:'#16a34a', warning:'#d97706', error:'#dc2626', info:'#2563eb' };
  const t = document.createElement('div');
  t.id = 'laben-toast';
  t.style.cssText = 'position:fixed;bottom:24px;left:50%;transform:translateX(-50%);' +
    'background:'+(colors[type]||'#333')+';color:#fff;padding:11px 22px;border-radius:50px;' +
    'font-size:13px;font-weight:600;z-index:99999;box-shadow:0 4px 20px rgba(0,0,0,.25);' +
    'font-family:Poppins,sans-serif;white-space:nowrap;transition:opacity .4s;';
  t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(() => { t.style.opacity='0'; setTimeout(()=>t.remove(),400); }, 3500);
}

// ===== FIREBASE INIT =====
function initFirebase() {
  try {
    if (typeof firebase === 'undefined') {
      showToast('⚠️ Firebase SDK missing','warning'); return;
    }
    if (!firebase.apps.length) firebase.initializeApp(FIREBASE_CONFIG);
    firebaseDB  = firebase.database();
    firebaseOK  = true;

    // Firebase Storage (for images)
    if (firebase.storage) {
      firebaseStorage = firebase.storage();
      console.log('✅ Firebase Storage ready');
    }

    // Firebase Cloud Messaging
    if (firebase.messaging && firebase.messaging.isSupported()) {
      firebaseMessaging = firebase.messaging();
      console.log('✅ FCM ready');

      // Handle foreground messages
      firebaseMessaging.onMessage(payload => {
        console.log('Foreground FCM message:', payload);
        const data = payload.data || {};
        showToast('🛎️ New Order: ' + (data.body || 'Check admin panel'), 'info');
      });
    } else {
      console.warn('FCM not supported in this browser');
    }

    console.log('✅ Firebase initialized');
    showToast('🔥 Firebase connected!', 'success');

    // Real-time order listener
    firebaseDB.ref('orders').on('value', snapshot => {
      const data = snapshot.val();
      if (!data) return;
      const fbArr = Object.entries(data)
        .map(([k,v]) => ({...v, _fbKey:k}))
        .sort((a,b) => (b.timestamp||0)-(a.timestamp||0));

      let hasNew = false;
      fbArr.forEach(fbO => {
        const local = orders.find(o => o.id === fbO.id);
        if (!local) {
          orders.unshift(fbO);
          if (seenOrderIds.size > 0 && !seenOrderIds.has(fbO.id)) hasNew = true;
          seenOrderIds.add(fbO.id);
        } else { local.status=fbO.status; local._fbKey=fbO._fbKey; }
      });

      saveOrders();
      const dash = document.getElementById('admin-dashboard');
      if (dash && dash.style.display!=='none') renderOrdersList();
      if (hasNew) showToast('🛎️ New order received!','info');
    }, err => showToast('❌ Firebase error: '+err.message,'error'));

    // Category sync
    firebaseDB.ref('categories').on('value', snap => {
      const data = snap.val();
      if (data && Array.isArray(data)) {
        categories = data; saveCategories();
        refreshMenuTabs(); refreshAdminCatDropdown();
      }
    });

    // Menu sync from Firebase (picks up image changes)
    firebaseDB.ref('menu').on('value', snap => {
      const data = snap.val();
      if (data) {
        const fbMenu = Array.isArray(data) ? data : Object.values(data);
        if (fbMenu.length > 0) {
          // Merge Firebase menu with local (Firebase wins for img field)
          fbMenu.forEach(fbItem => {
            const local = menuData.find(i => i.id === fbItem.id);
            if (local) { if (fbItem.img) local.img = fbItem.img; }
            else menuData.push(fbItem);
          });
          saveMenu();
          renderMenu();
        }
      }
    });

    // Open admin panel if redirected from notification tap
    if (window.location.search.includes('openAdmin=1')) {
      setTimeout(() => {
        const adminEl = document.getElementById('adminPanel');
        if (adminEl) new bootstrap.Offcanvas(adminEl).show();
      }, 800);
    }

  } catch(e) {
    console.error('Firebase init failed:', e);
    showToast('⚠️ Firebase failed: '+e.message,'error');
  }
}

function saveOrderToFirebase(order) {
  if (!firebaseOK||!firebaseDB) return;
  firebaseDB.ref('orders').push(order)
    .then(()=>showToast('✅ Order saved to cloud!','success'))
    .catch(()=>showToast('❌ Firebase write failed!','error'));
}

function saveMenuItemToFirebase(item) {
  if (!firebaseOK||!firebaseDB) return;
  firebaseDB.ref('menu/'+item.id).set(item).catch(e=>console.warn('Menu save error:',e));
}

function saveCategoriesToFirebase() {
  if (!firebaseOK||!firebaseDB) return;
  firebaseDB.ref('categories').set(categories).catch(e=>console.warn(e));
}

// ===== FCM TOKEN & SUBSCRIPTION =====
async function subscribeToPushNotifications() {
  if (!firebaseMessaging) {
    showToast('❌ FCM not available in this browser','error');
    updateNotifStatus(); return false;
  }

  try {
    const perm = await Notification.requestPermission();
    if (perm !== 'granted') {
      showToast('❌ Notification permission denied','error');
      updateNotifStatus(); return false;
    }

    // Get FCM token — this is the device's unique push address
    const token = await firebaseMessaging.getToken({ vapidKey: FCM_VAPID_KEY });
    if (token) {
      fcmToken = token;
      // Save token to Firebase so your server/Cloud Function can send to it
      await firebaseDB.ref('fcm_tokens/' + token.slice(-20)).set({
        token:     token,
        device:    navigator.userAgent.slice(0,80),
        timestamp: Date.now()
      });
      console.log('✅ FCM Token saved:', token.slice(0,20)+'...');
      showToast('🔔 Notifications enabled! Works even when browser is closed.','success');
      updateNotifStatus();
      return true;
    } else {
      showToast('❌ Could not get FCM token. Check VAPID key.','error');
      return false;
    }
  } catch(err) {
    console.error('FCM subscribe error:', err);
    showToast('❌ Notification setup failed: '+err.message,'error');
    updateNotifStatus();
    return false;
  }
}

function updateNotifStatus() {
  const el  = document.getElementById('notif-status-text');
  const btn = document.getElementById('notif-enable-btn');
  if (!el) return;

  const fcmAvailable = !!(firebaseMessaging);

  if (!('Notification' in window)) {
    el.innerHTML = '❌ Not supported in this browser';
    el.style.color = '#dc2626';
    if (btn) btn.style.display = 'none';
  } else if (Notification.permission === 'granted' && fcmToken) {
    el.innerHTML = '✅ <strong>Active</strong> — Alerts arrive even when browser is closed, like WhatsApp';
    el.style.color = '#16a34a';
    if (btn) btn.style.display = 'none';
  } else if (Notification.permission === 'denied') {
    el.innerHTML = '❌ <strong>Blocked</strong> — Open browser/phone Settings → Notifications → Allow for this site';
    el.style.color = '#dc2626';
    if (btn) { btn.style.display=''; btn.textContent='⚙️ Go to Settings'; }
  } else if (!fcmAvailable) {
    el.innerHTML = '⚠️ Add VAPID key in app.js (line 14) to enable background notifications';
    el.style.color = '#d97706';
    if (btn) btn.style.display = 'none';
  } else {
    el.innerHTML = '🔔 Tap <strong>Enable</strong> — get order alerts like WhatsApp even when phone is locked';
    el.style.color = '#d97706';
    if (btn) { btn.style.display=''; btn.textContent='🔔 Enable Notifications'; }
  }
}

// ===== IMAGE HELPERS =====
// Convert uploaded file to base64 string (stored in Firebase)
function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    // Resize & compress before storing
    const reader = new FileReader();
    reader.onload = e => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX = 400;
        let w = img.width, h = img.height;
        if (w > MAX) { h = Math.round(h * MAX / w); w = MAX; }
        if (h > MAX) { w = Math.round(w * MAX / h); h = MAX; }
        canvas.width = w; canvas.height = h;
        canvas.getContext('2d').drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL('image/jpeg', 0.75));
      };
      img.onerror = reject;
      img.src = e.target.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function getItemImage(item) {
  if (item.img && item.img.length > 10) return item.img; // custom uploaded image
  return LOCAL_ITEM_IMAGES[item.name] || CATEGORY_IMAGES[item.cat] || CATEGORY_IMAGES.pizza;
}

// ===== MENU TABS =====
function refreshMenuTabs() {
  const tabsEl = document.getElementById('menuTabs');
  if (!tabsEl) return;
  const icons = {coffee:'☕',fries:'🍟',sandwich:'🥪',pizza:'🍕',burger:'🍔',maggi:'🍜'};
  tabsEl.innerHTML = ['all',...categories].map(cat => {
    const label = cat==='all' ? 'All Items' : cat.charAt(0).toUpperCase()+cat.slice(1);
    const icon  = icons[cat] ? icons[cat]+' ' : '';
    return `<li class="nav-item"><button class="menu-tab${cat===currentCat?' active':''}" data-cat="${cat}">${icon}${label}</button></li>`;
  }).join('');
  tabsEl.querySelectorAll('.menu-tab').forEach(btn => {
    btn.addEventListener('click', () => {
      tabsEl.querySelectorAll('.menu-tab').forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');
      currentCat = btn.dataset.cat;
      renderMenu();
    });
  });
}

// ===== RENDER MENU =====
function renderMenu() {
  const grid  = document.getElementById('menu-grid');
  const items = currentCat==='all' ? menuData : menuData.filter(i=>i.cat===currentCat);
  if (!items.length) {
    grid.innerHTML=`<div class="col-12 text-center text-muted py-5"><i class="bi bi-search fs-2 d-block mb-2"></i>No items in this category.</div>`;
    return;
  }
  grid.innerHTML = items.map(item => {
    const imgSrc   = getItemImage(item);
    const fallback = CATEGORY_IMAGES[item.cat]||CATEGORY_IMAGES.pizza;
    const catLabel = item.cat.charAt(0).toUpperCase()+item.cat.slice(1);
    return `
    <div class="col-6 col-md-4 col-lg-3 fade-in">
      <div class="menu-card">
        <div class="menu-card-img">
          <img src="${imgSrc}" alt="${item.name}" loading="lazy" onerror="this.onerror=null;this.src='${fallback}';">
          <span class="menu-card-cat">${catLabel}</span>
        </div>
        <div class="menu-card-body">
          <div class="menu-card-name">${item.name}</div>
          <div class="menu-card-desc">${item.desc}</div>
          <div class="menu-card-footer">
            <span class="menu-card-price">₹${item.price}</span>
            <button class="btn-add-cart" onclick="addToCart(${item.id})"><i class="bi bi-plus-lg"></i></button>
          </div>
        </div>
      </div>
    </div>`;
  }).join('');
  observeFadeIn();
}

// ===== CART =====
function addToCart(itemId) {
  const item = menuData.find(i=>i.id===itemId);
  if (!item) return;
  const ex = cart.find(c=>c.id===itemId);
  if (ex) ex.qty++; else cart.push({id:item.id,name:item.name,price:item.price,qty:1});
  saveCart(); updateCartUI(); showAddedFeedback(itemId);
}
function removeFromCart(itemId) {
  const idx = cart.findIndex(c=>c.id===itemId);
  if (idx===-1) return;
  if (cart[idx].qty>1) cart[idx].qty--; else cart.splice(idx,1);
  saveCart(); updateCartUI();
}
function clearCart() { cart=[]; saveCart(); updateCartUI(); }
function getCartTotal() { return cart.reduce((s,c)=>s+c.price*c.qty,0); }

function updateCartUI() {
  const qty = cart.reduce((s,c)=>s+c.qty,0);
  document.getElementById('cart-count').textContent = qty;
  const list = document.getElementById('cart-items-list');
  if (!cart.length) {
    list.innerHTML=`<div class="cart-empty"><i class="bi bi-bag-x"></i>Your cart is empty.<br><small class="text-muted">Add items from the menu!</small></div>`;
  } else {
    list.innerHTML = cart.map(c=>`
      <div class="cart-item-row">
        <div class="cart-item-info">
          <div class="cart-item-name">${c.name}</div>
          <div class="cart-item-price">₹${c.price} each</div>
        </div>
        <div class="cart-qty-controls">
          <button class="qty-btn" onclick="removeFromCart(${c.id})"><i class="bi bi-dash"></i></button>
          <span class="qty-num">${c.qty}</span>
          <button class="qty-btn" onclick="addToCart(${c.id})"><i class="bi bi-plus"></i></button>
        </div>
        <strong style="min-width:52px;text-align:right;color:var(--accent)">₹${c.price*c.qty}</strong>
      </div>`).join('');
  }
  document.getElementById('cart-total').textContent = getCartTotal();
  const sb = document.getElementById('order-summary-box');
  if (!cart.length) {
    sb.innerHTML=`<p class="mb-0 text-muted">Your cart is empty. Add items from the menu above.</p>`;
  } else {
    sb.innerHTML=`
      <strong class="d-block mb-2"><i class="bi bi-bag me-1"></i>Order Summary</strong>
      ${cart.map(c=>`<div class="d-flex justify-content-between"><span>${c.name} × ${c.qty}</span><span>₹${c.price*c.qty}</span></div>`).join('')}
      <hr class="my-2">
      <div class="d-flex justify-content-between fw-bold"><span>Total</span><span style="color:var(--accent)">₹${getCartTotal()}</span></div>`;
  }
}

function showAddedFeedback(itemId) {
  const btn = document.querySelector(`.btn-add-cart[onclick="addToCart(${itemId})"]`);
  if (!btn) return;
  btn.style.background='#16a34a'; btn.innerHTML='<i class="bi bi-check-lg"></i>';
  setTimeout(()=>{btn.style.background='';btn.innerHTML='<i class="bi bi-plus-lg"></i>';},900);
}

function scrollToOrder() {
  const oc = bootstrap.Offcanvas.getInstance(document.getElementById('cartPanel'));
  if (oc) oc.hide();
  setTimeout(()=>document.getElementById('order').scrollIntoView({behavior:'smooth'}),300);
}

// ===== ORDER =====
function placeOrder(e) {
  e.preventDefault();
  if (!cart.length) { alert('Your cart is empty!'); return; }
  const payment = document.getElementById('ord-payment').value;
  if (payment==='UPI'&&!upiPaymentConfirmed) { openUpiModal(getCartTotal()); return; }
  const name=document.getElementById('ord-name').value;
  const phone=document.getElementById('ord-phone').value;
  const address=document.getElementById('ord-address').value;
  const note=document.getElementById('ord-note').value;
  const orderId='LBN'+Date.now().toString().slice(-6);
  const timeStr=new Date().toLocaleString('en-IN',{day:'2-digit',month:'short',year:'numeric',hour:'2-digit',minute:'2-digit',hour12:true});
  const newOrder={id:orderId,time:timeStr,timestamp:Date.now(),name,phone,address,payment,note:note||'',items:JSON.parse(JSON.stringify(cart)),total:getCartTotal(),status:'new'};
  orders.unshift(newOrder); seenOrderIds.add(orderId);
  saveOrders(); saveOrderToFirebase(newOrder);
  showOrderConfirmation(orderId,name,phone,address,payment,note,getCartTotal());
  upiPaymentConfirmed=false; clearCart();
  document.getElementById('orderForm').reset();
  document.getElementById('upi-info-hint').style.display='none';
}

function showOrderConfirmation(orderId,name,phone,address,payment,note,total,utrId) {
  const conf=document.getElementById('order-confirmation');
  conf.style.display='block';
  conf.innerHTML=`
    <div class="order-success">
      <i class="bi bi-check-circle-fill me-2"></i><strong>Order Placed Successfully!</strong><br>
      <span class="small">Order ID: <strong>${orderId}</strong></span><br>
      <span class="small">Name: ${name} | Phone: ${phone}</span><br>
      <span class="small">Delivery to: ${address}</span><br>
      <span class="small">Payment: ${payment} | Total: <strong>₹${total}</strong></span>
      ${utrId?`<br><span class="small">UTR: <strong style="font-family:monospace;color:#5f259f">${utrId}</strong></span>`:''}
      ${note?`<br><span class="small">Note: ${note}</span>`:''}
      <br><span class="small text-success">We'll call you shortly to confirm. 🙏</span>
    </div>`;
  conf.scrollIntoView({behavior:'smooth'});
}

// ===== ADMIN =====
function adminLogin() {
  const u=document.getElementById('adm-user').value;
  const p=document.getElementById('adm-pass').value;
  if (u==='admin'&&p==='laben123') {
    document.getElementById('admin-login-wrap').style.display='none';
    document.getElementById('admin-dashboard').style.display='block';
    updateNotifStatus();
    switchAdminTab('orders');
  } else { document.getElementById('adm-err').style.display='block'; }
}

function adminLogout() {
  document.getElementById('admin-login-wrap').style.display='block';
  document.getElementById('admin-dashboard').style.display='none';
  document.getElementById('adm-user').value='';
  document.getElementById('adm-pass').value='';
}

function switchAdminTab(tab) {
  document.querySelectorAll('.adm-tab-btn').forEach(b=>b.classList.remove('active'));
  document.getElementById('adm-tab-'+tab).classList.add('active');
  ['orders','menu','catmgr'].forEach(t => {
    document.getElementById('adm-panel-'+t).style.display = t===tab?'block':'none';
  });
  if (tab==='orders') renderOrdersList();
  if (tab==='menu')   renderAdminList();
  if (tab==='catmgr') renderCategoryManager();
}

// ===== CATEGORY MANAGER =====
function refreshAdminCatDropdown() {
  const sel=document.getElementById('adm-cat');
  if (!sel) return;
  sel.innerHTML=categories.map(c=>`<option value="${c}">${c.charAt(0).toUpperCase()+c.slice(1)}</option>`).join('');
}

function renderCategoryManager() {
  const wrap=document.getElementById('adm-cat-list');
  if (!wrap) return;
  if (!categories.length) { wrap.innerHTML=`<p class="text-muted small text-center py-3">No categories yet.</p>`; return; }
  wrap.innerHTML=categories.map(cat => {
    const count=menuData.filter(i=>i.cat===cat).length;
    return `
    <div class="adm-cat-row">
      <div style="display:flex;align-items:center;gap:8px;flex:1;">
        <span style="font-weight:600;text-transform:capitalize;">${cat}</span>
        <span class="cat-badge">${count} item${count!==1?'s':''}</span>
      </div>
      <div style="display:flex;gap:6px;">
        <button onclick="startRenameCat('${cat}')" class="adm-edit-btn"><i class="bi bi-pencil-fill"></i> Rename</button>
        <button onclick="deleteCategory('${cat}')" class="adm-del-btn"><i class="bi bi-trash3-fill"></i></button>
      </div>
    </div>
    <div id="cat-rename-${cat}" style="display:none;padding:8px 0 10px;border-bottom:1px dashed #eee;">
      <div style="display:flex;gap:6px;align-items:center;">
        <input type="text" id="cat-rename-input-${cat}" value="${cat}" class="form-control form-control-sm" style="max-width:200px;">
        <button onclick="saveCategoryRename('${cat}')" class="btn btn-sm" style="background:#e8500a;color:#fff;border:none;border-radius:8px;padding:4px 12px;font-size:12px;">Save</button>
        <button onclick="cancelCatRename('${cat}')" class="btn btn-sm" style="background:#eee;border:none;border-radius:8px;padding:4px 10px;font-size:12px;">✕</button>
      </div>
    </div>`;
  }).join('');
}

function startRenameCat(cat) { document.getElementById('cat-rename-'+cat).style.display='block'; document.getElementById('cat-rename-input-'+cat).focus(); }
function cancelCatRename(cat) { document.getElementById('cat-rename-'+cat).style.display='none'; }

function saveCategoryRename(oldCat) {
  const input=document.getElementById('cat-rename-input-'+oldCat);
  const newCat=input.value.trim().toLowerCase().replace(/\s+/g,'');
  if (!newCat) { showToast('Enter valid name','error'); return; }
  if (newCat===oldCat) { cancelCatRename(oldCat); return; }
  if (categories.includes(newCat)) { showToast('Already exists!','warning'); return; }
  categories[categories.indexOf(oldCat)]=newCat;
  menuData.forEach(i=>{ if(i.cat===oldCat)i.cat=newCat; });
  saveMenu(); saveCategories(); saveCategoriesToFirebase();
  refreshMenuTabs(); refreshAdminCatDropdown(); renderCategoryManager(); renderMenu();
  showToast('Renamed to "'+newCat+'"','success');
}

function addCategory() {
  const input=document.getElementById('adm-new-cat-input');
  const newCat=input.value.trim().toLowerCase().replace(/\s+/g,'');
  if (!newCat) { showToast('Enter a name','error'); return; }
  if (categories.includes(newCat)) { showToast('Already exists!','warning'); return; }
  categories.push(newCat);
  saveCategories(); saveCategoriesToFirebase();
  refreshMenuTabs(); refreshAdminCatDropdown(); renderCategoryManager();
  input.value=''; showToast('"'+newCat+'" added!','success');
}

function deleteCategory(cat) {
  const count=menuData.filter(i=>i.cat===cat).length;
  if (!confirm(count>0?`Delete "${cat}"? ${count} items will be removed!`:`Delete "${cat}"?`)) return;
  categories=categories.filter(c=>c!==cat);
  if (count>0) menuData=menuData.filter(i=>i.cat!==cat);
  saveMenu(); saveCategories(); saveCategoriesToFirebase();
  refreshMenuTabs(); refreshAdminCatDropdown(); renderCategoryManager(); renderAdminList(); renderMenu();
  showToast('Deleted!','success');
}

// ===== IMAGE UPLOAD HANDLER =====
async function handleNewItemImageUpload(event) {
  const file = event.target.files[0];
  if (!file) return;
  const preview = document.getElementById('adm-new-img-preview');
  const label   = document.getElementById('adm-new-img-label');
  try {
    label.textContent = 'Uploading...';
    pendingNewItemImg = await fileToBase64(file);
    if (preview) { preview.src=pendingNewItemImg; preview.style.display='block'; }
    label.textContent = '✅ Image ready';
    showToast('Image ready!','success');
  } catch(e) {
    showToast('Image upload failed','error');
    label.textContent = '📷 Choose Image';
  }
}

async function handleEditItemImageUpload(event, itemId) {
  const file = event.target.files[0];
  if (!file) return;
  const preview = document.getElementById('adm-edit-img-preview-'+itemId);
  const label   = document.getElementById('adm-edit-img-label-'+itemId);
  try {
    if (label) label.textContent = 'Uploading...';
    const base64 = await fileToBase64(file);
    if (preview) { preview.src=base64; preview.style.display='block'; }
    if (label) label.textContent = '✅ Image ready';
    // Store temporarily on the input element
    event.target._base64 = base64;
    showToast('Image ready!','success');
  } catch(e) {
    showToast('Image upload failed','error');
  }
}

// ===== ADMIN MENU ITEMS =====
function adminAddItem() {
  const name  = document.getElementById('adm-name').value.trim();
  const price = parseFloat(document.getElementById('adm-price').value);
  const desc  = document.getElementById('adm-desc').value.trim();
  const cat   = document.getElementById('adm-cat').value;
  if (!name||!price) { alert('Please enter item name and price.'); return; }
  const newItem = {id:nextId++, name, desc:desc||'', price, cat, img: pendingNewItemImg||''};
  menuData.push(newItem);
  saveMenu(); saveMenuItemToFirebase(newItem); renderAdminList(); renderMenu();
  document.getElementById('adm-name').value='';
  document.getElementById('adm-price').value='';
  document.getElementById('adm-desc').value='';
  pendingNewItemImg='';
  const preview=document.getElementById('adm-new-img-preview');
  const label=document.getElementById('adm-new-img-label');
  const fileInput=document.getElementById('adm-new-img-input');
  if (preview) { preview.src=''; preview.style.display='none'; }
  if (label)   label.textContent='📷 Choose Image';
  if (fileInput) fileInput.value='';
  showToast('"'+name+'" added!','success');
}

function adminDeleteItem(id) {
  if (!confirm('Remove this item?')) return;
  menuData=menuData.filter(i=>i.id!==id);
  saveMenu(); renderAdminList(); renderMenu();
  if (firebaseOK&&firebaseDB) firebaseDB.ref('menu/'+id).remove().catch(e=>console.warn(e));
  showToast('Item removed','success');
}

function startEditItem(id) {
  document.getElementById('adm-item-display-'+id).style.display='none';
  document.getElementById('adm-item-edit-'+id).style.display='block';
}
function cancelEditItem(id) {
  document.getElementById('adm-item-display-'+id).style.display='flex';
  document.getElementById('adm-item-edit-'+id).style.display='none';
}

async function saveEditItem(id) {
  const nameVal  = document.getElementById('adm-edit-name-'+id).value.trim();
  const priceVal = parseFloat(document.getElementById('adm-edit-price-'+id).value);
  const descVal  = document.getElementById('adm-edit-desc-'+id).value.trim();
  const catVal   = document.getElementById('adm-edit-cat-'+id).value;
  const imgInput = document.getElementById('adm-edit-img-input-'+id);

  if (!nameVal) { showToast('Name cannot be empty','error'); return; }
  if (!priceVal||priceVal<1) { showToast('Enter a valid price','error'); return; }

  const item = menuData.find(i=>i.id===id);
  if (!item) return;

  item.name=nameVal; item.price=priceVal; item.desc=descVal; item.cat=catVal;

  // If new image was uploaded
  if (imgInput && imgInput._base64) {
    item.img = imgInput._base64;
  }

  saveMenu(); saveMenuItemToFirebase(item); renderAdminList(); renderMenu();
  showToast('Item updated!','success');
}

function renderAdminList() {
  document.getElementById('adm-count').textContent=menuData.length;
  const catOptions=categories.map(c=>`<option value="${c}">${c.charAt(0).toUpperCase()+c.slice(1)}</option>`).join('');

  document.getElementById('adm-items-list').innerHTML = menuData.map(item => {
    const imgSrc = getItemImage(item);
    const fallback = CATEGORY_IMAGES[item.cat]||CATEGORY_IMAGES.pizza;
    return `
    <div class="adm-item" id="adm-item-wrap-${item.id}">

      <!-- DISPLAY ROW -->
      <div id="adm-item-display-${item.id}" style="display:flex;align-items:center;gap:10px;width:100%;">
        <img src="${imgSrc}" onerror="this.src='${fallback}'"
          style="width:48px;height:48px;object-fit:cover;border-radius:10px;flex-shrink:0;border:1px solid #eee;">
        <div class="adm-item-info" style="flex:1;min-width:0;">
          <div class="adm-item-name" style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${item.name}</div>
          <div class="adm-item-meta">
            <span class="cat-badge">${item.cat}</span>
            ${item.desc?`<span class="ms-1 small text-muted">${item.desc.slice(0,28)}${item.desc.length>28?'...':''}</span>`:''}
          </div>
        </div>
        <span class="adm-item-price" style="flex-shrink:0;">₹${item.price}</span>
        <button onclick="startEditItem(${item.id})" class="adm-edit-btn" style="flex-shrink:0;"><i class="bi bi-pencil-fill"></i></button>
        <button onclick="adminDeleteItem(${item.id})" class="adm-del-btn" style="flex-shrink:0;"><i class="bi bi-trash3-fill"></i></button>
      </div>

      <!-- EDIT FORM -->
      <div id="adm-item-edit-${item.id}" style="display:none;width:100%;padding-top:12px;border-top:1px dashed #eee;margin-top:8px;">
        <div class="row g-2">
          <div class="col-12">
            <label class="form-label small fw-bold mb-1">Item Name</label>
            <input type="text" id="adm-edit-name-${item.id}" class="form-control form-control-sm" value="${item.name.replace(/"/g,'&quot;')}">
          </div>
          <div class="col-6">
            <label class="form-label small fw-bold mb-1">Price (₹)</label>
            <input type="number" id="adm-edit-price-${item.id}" class="form-control form-control-sm" value="${item.price}" min="1">
          </div>
          <div class="col-6">
            <label class="form-label small fw-bold mb-1">Category</label>
            <select id="adm-edit-cat-${item.id}" class="form-select form-select-sm">${catOptions.replace(`value="${item.cat}"`,`value="${item.cat}" selected`)}</select>
          </div>
          <div class="col-12">
            <label class="form-label small fw-bold mb-1">Description</label>
            <input type="text" id="adm-edit-desc-${item.id}" class="form-control form-control-sm" value="${item.desc.replace(/"/g,'&quot;')}">
          </div>
          <!-- IMAGE UPLOAD -->
          <div class="col-12">
            <label class="form-label small fw-bold mb-1">Change Image</label>
            <div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap;">
              <img id="adm-edit-img-preview-${item.id}" src="${imgSrc}"
                onerror="this.src='${fallback}'"
                style="width:60px;height:60px;object-fit:cover;border-radius:10px;border:1px solid #eee;">
              <label style="cursor:pointer;background:#f5f5f5;border:1.5px dashed #ccc;border-radius:10px;padding:8px 14px;font-size:12px;color:#666;transition:all .2s;">
                <span id="adm-edit-img-label-${item.id}">📷 Upload New Image</span>
                <input type="file" id="adm-edit-img-input-${item.id}" accept="image/*" style="display:none;"
                  onchange="handleEditItemImageUpload(event,${item.id})">
              </label>
              <span class="small text-muted">JPG/PNG/WEBP · Auto-compressed</span>
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

// ===== ORDERS =====
function renderOrdersList() {
  const wrap=document.getElementById('adm-orders-list');
  const filter=(document.getElementById('adm-order-filter')||{}).value||'all';
  const filtered=filter==='all'?orders:orders.filter(o=>o.status===filter);
  document.getElementById('adm-orders-count').textContent=orders.length;
  const newCount=orders.filter(o=>o.status==='new').length;
  const badge=document.getElementById('adm-new-badge');
  badge.textContent=newCount; badge.style.display=newCount>0?'inline-block':'none';
  const revenue=orders.filter(o=>o.status==='delivered').reduce((s,o)=>s+o.total,0);
  const statsEl=document.getElementById('adm-order-stats');
  if (statsEl) statsEl.innerHTML=`
    <div class="adm-stat-pill"><i class="bi bi-receipt me-1"></i><strong>${orders.length}</strong> Total</div>
    <div class="adm-stat-pill new-pill"><i class="bi bi-bell me-1"></i><strong>${orders.filter(o=>o.status==='new').length}</strong> New</div>
    <div class="adm-stat-pill prep-pill"><i class="bi bi-fire me-1"></i><strong>${orders.filter(o=>o.status==='preparing').length}</strong> Preparing</div>
    <div class="adm-stat-pill done-pill"><i class="bi bi-check2-circle me-1"></i><strong>₹${revenue}</strong> Earned</div>`;
  if (!filtered.length) { wrap.innerHTML=`<div style="text-align:center;padding:2.5rem 1rem;color:#999;"><i class="bi bi-inbox" style="font-size:2.5rem;display:block;margin-bottom:.75rem;opacity:.4;"></i>No orders found.</div>`; return; }
  const sC={new:'#e8500a',preparing:'#d97706',delivered:'#16a34a'};
  const sB={new:'#fff4f0',preparing:'#fffbeb',delivered:'#f0fdf4'};
  const sL={new:'🆕 New Order',preparing:'🍳 Preparing',delivered:'✅ Delivered'};
  const pI={COD:'💵',UPI:'📱',Card:'💳'};
  wrap.innerHTML=filtered.map(o=>{
    const tot=o.items.reduce((s,it)=>s+(it.price*it.qty),0);
    return `
    <div class="adm-order-card" style="border-left:4px solid ${sC[o.status]}">
      <div class="adm-order-head">
        <div class="d-flex align-items-center gap-2 flex-wrap">
          <span class="adm-order-id">#${o.id}</span>
          <span class="adm-order-time"><i class="bi bi-clock me-1"></i>${o.time}</span>
        </div>
        <span class="adm-order-status-badge" style="background:${sB[o.status]};color:${sC[o.status]};border:1px solid ${sC[o.status]}33">${sL[o.status]}</span>
      </div>
      <div class="adm-detail-section">
        <div class="adm-detail-label"><i class="bi bi-person-fill me-1"></i>Customer</div>
        <div class="adm-detail-grid">
          <div class="adm-detail-row"><span class="adm-detail-key">Name</span><span class="adm-detail-val"><strong>${o.name}</strong></span></div>
          <div class="adm-detail-row"><span class="adm-detail-key">Phone</span><span class="adm-detail-val"><a href="tel:${o.phone}" style="color:var(--accent);text-decoration:none;font-weight:600;"><i class="bi bi-telephone-fill me-1"></i>${o.phone}</a></span></div>
          <div class="adm-detail-row"><span class="adm-detail-key">Address</span><span class="adm-detail-val"><i class="bi bi-geo-alt-fill me-1" style="color:#e8500a"></i>${o.address}</span></div>
        </div>
      </div>
      <div class="adm-detail-section">
        <div class="adm-detail-label"><i class="bi bi-credit-card-fill me-1"></i>Payment</div>
        <div class="adm-detail-grid">
          <div class="adm-detail-row"><span class="adm-detail-key">Method</span><span class="adm-detail-val"><span class="adm-pay-badge">${pI[o.payment]||'💰'} ${o.payment}</span></span></div>
          <div class="adm-detail-row"><span class="adm-detail-key">Amount</span><span class="adm-detail-val" style="font-size:1.1rem;font-weight:700;color:var(--accent)">₹${o.total}</span></div>
          ${o.utrId?`<div class="adm-detail-row"><span class="adm-detail-key">UTR</span><span class="adm-detail-val" style="font-family:monospace;font-weight:700;color:#5f259f;">${o.utrId}</span></div>`:''}
        </div>
      </div>
      <div class="adm-detail-section">
        <div class="adm-detail-label"><i class="bi bi-bag-fill me-1"></i>Items</div>
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

function updateOrderStatus(orderId,newStatus) {
  const order=orders.find(o=>o.id===orderId);
  if (!order) return;
  order.status=newStatus; saveOrders(); renderOrdersList();
  if (firebaseOK&&firebaseDB&&order._fbKey)
    firebaseDB.ref('orders/'+order._fbKey).update({status:newStatus}).catch(e=>console.warn(e));
}

function deleteOrder(orderId) {
  if (!confirm('Delete this order?')) return;
  const order=orders.find(o=>o.id===orderId);
  orders=orders.filter(o=>o.id!==orderId);
  saveOrders(); renderOrdersList();
  if (firebaseOK&&firebaseDB&&order&&order._fbKey)
    firebaseDB.ref('orders/'+order._fbKey).remove().catch(e=>console.warn(e));
}

function clearAllOrders() {
  if (!confirm('Clear ALL delivered orders?')) return;
  orders=orders.filter(o=>o.status!=='delivered');
  saveOrders(); renderOrdersList();
}

// ===== SCROLL ANIMATIONS =====
function observeFadeIn() {
  const els=document.querySelectorAll('.fade-in:not(.visible)');
  const obs=new IntersectionObserver(entries=>{
    entries.forEach((e,i)=>{
      if(e.isIntersecting){setTimeout(()=>e.target.classList.add('visible'),i*60);obs.unobserve(e.target);}
    });
  },{threshold:0.1});
  els.forEach(el=>obs.observe(el));
}

window.addEventListener('scroll',()=>{
  const nav=document.getElementById('mainNav');
  if(window.scrollY>50){nav.style.background='rgba(26,20,16,0.98)';nav.style.boxShadow='0 2px 20px rgba(0,0,0,0.3)';}
  else{nav.style.background='rgba(26,20,16,0.95)';nav.style.boxShadow='none';}
});

// ===== UPI =====
var UPI_ID="9665539828@ibl",UPI_NAME="The Laben Cafe";
function handlePaymentChange(){var m=document.getElementById('ord-payment').value;document.getElementById('upi-info-hint').style.display=m==='UPI'?'flex':'none';if(m!=='UPI')upiPaymentConfirmed=false;}
function copyUpiId(){navigator.clipboard.writeText(UPI_ID).then(()=>showToast('Copied: '+UPI_ID,'success'));}
function openUpiModal(amount){
  document.getElementById('upi-display-amount').textContent=amount;
  document.getElementById('upi-id-text').textContent=UPI_ID;
  var link='upi://pay?pa='+UPI_ID+'&pn='+encodeURIComponent(UPI_NAME)+'&am='+amount+'&cu=INR&tn=The%20Laben%20Cafe%20Order';
  document.getElementById('upi-deep-link').href=link;
  document.getElementById('upi-qr-img').src='https://api.qrserver.com/v1/create-qr-code/?size=180x180&data='+encodeURIComponent(link);
  var u=document.getElementById('upi-utr-input');if(u)u.value='';
  var er=document.getElementById('upi-utr-error');if(er)er.style.display='none';
  document.getElementById('upiModal').classList.add('active');
}
function closeUpiModal(){document.getElementById('upiModal').classList.remove('active');}
function validateUtrInput(){var i=document.getElementById('upi-utr-input'),e=document.getElementById('upi-utr-error');if(i&&e)e.style.display=(i.value.trim().length>0&&i.value.trim().length<8)?'block':'none';}
function confirmUpiPayment(){
  var ui=document.getElementById('upi-utr-input'),ue=document.getElementById('upi-utr-error'),uv=ui?ui.value.trim():'';
  if(!uv||uv.length<8){if(ue)ue.style.display='block';if(ui){ui.focus();ui.style.borderColor='#dc2626';ui.style.boxShadow='0 0 0 3px rgba(220,38,38,.15)';setTimeout(()=>{ui.style.borderColor='';ui.style.boxShadow='';},2500);}return;}
  var name=document.getElementById('ord-name').value.trim(),phone=document.getElementById('ord-phone').value.trim(),address=document.getElementById('ord-address').value.trim();
  if(!name||!phone||!address){closeUpiModal();alert('Please fill Name, Phone, Address first.');return;}
  closeUpiModal();
  var note=document.getElementById('ord-note').value,orderId='LBN'+Date.now().toString().slice(-6);
  var timeStr=new Date().toLocaleString('en-IN',{day:'2-digit',month:'short',year:'numeric',hour:'2-digit',minute:'2-digit',hour12:true});
  var newOrder={id:orderId,time:timeStr,timestamp:Date.now(),name,phone,address,payment:'UPI',utrId:uv,note:note||'',items:JSON.parse(JSON.stringify(cart)),total:getCartTotal(),status:'new'};
  orders.unshift(newOrder);seenOrderIds.add(orderId);saveOrders();saveOrderToFirebase(newOrder);
  showOrderConfirmation(orderId,name,phone,address,'UPI',note,getCartTotal(),uv);
  clearCart();document.getElementById('orderForm').reset();document.getElementById('upi-info-hint').style.display='none';
}

// ===== INIT =====
// Register FCM Service Worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/firebase-messaging-sw.js').then(reg => {
    console.log('✅ FCM SW registered');
    // Handle message from SW to open admin panel
    navigator.serviceWorker.addEventListener('message', e => {
      if (e.data&&e.data.type==='OPEN_ADMIN') {
        const adminEl=document.getElementById('adminPanel');
        if (adminEl) new bootstrap.Offcanvas(adminEl).show();
      }
    });
  }).catch(err => console.warn('FCM SW failed:', err));
}

refreshMenuTabs();
renderMenu();
updateCartUI();
refreshAdminCatDropdown();
if (document.readyState==='loading') document.addEventListener('DOMContentLoaded',initFirebase);
else initFirebase();
