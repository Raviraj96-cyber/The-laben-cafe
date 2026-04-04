// ===== MENU DATA =====
const CATEGORY_IMAGES = {
  coffee:   'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?w=400&q=80',
  fries:    'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80',
  sandwich: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=400&q=80',
  pizza:    'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80',
  burger:   'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80',
  maggi:    'https://images.unsplash.com/photo-1555126634-323283e090fa?w=400&q=80',
};

const ITEM_IMAGES = {
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
  { id:1,  name:'Cold Coffee With Crush',             desc:'Refreshing cold coffee with crush syrup',          price:70,  cat:'coffee'   },
  { id:2,  name:'Cold Coffee With Icecream',          desc:'Chilled coffee topped with a scoop of ice cream',  price:80,  cat:'coffee'   },
  { id:3,  name:'Hot Coffee',                         desc:'Classic warm brew, comforting & rich',             price:30,  cat:'coffee'   },
  { id:4,  name:'Black Coffee',                       desc:'Strong, pure espresso-style black coffee',         price:30,  cat:'coffee'   },
  { id:5,  name:'Salted Fries',                       desc:'Crispy golden fries with seasoned salt',           price:70,  cat:'fries'    },
  { id:6,  name:'Peri-Peri Fries',                    desc:'Spicy peri-peri seasoned crispy fries',            price:80,  cat:'fries'    },
  { id:7,  name:'Peri-Peri Fries With Masala',        desc:'Peri-peri fries with extra masala kick',           price:90,  cat:'fries'    },
  { id:8,  name:'Veg Sandwich',                       desc:'Fresh veggies in toasted bread',                   price:60,  cat:'sandwich' },
  { id:9,  name:'Cheese Corn Sandwich',               desc:'Melted cheese and sweet corn grilled sandwich',    price:90,  cat:'sandwich' },
  { id:10, name:'Cheese Chilli Sandwich',             desc:'Spicy chilli & gooey cheese in crispy bread',      price:90,  cat:'sandwich' },
  { id:11, name:'Plane Cheese Pizza',                 desc:'Classic mozzarella on homemade sauce base',        price:130, cat:'pizza'    },
  { id:12, name:'Veg Pizza',                          desc:'Loaded with fresh seasonal vegetables',            price:150, cat:'pizza'    },
  { id:13, name:'Cheese Corn Pizza',                  desc:'Sweet corn and extra cheese on thin crust',        price:150, cat:'pizza'    },
  { id:14, name:'Cheese Paneer Pizza',                desc:'Chunky paneer cubes with melted cheese',           price:150, cat:'pizza'    },
  { id:15, name:'Aloo Tikki Burger',                  desc:'Spiced aloo tikki patty in a soft bun',            price:70,  cat:'burger'   },
  { id:16, name:'Aloo Tikki Cheese Burger',           desc:'Tikki patty with melted cheese slice',             price:90,  cat:'burger'   },
  { id:17, name:'Laben Café Special Maharaja Burger', desc:'Our signature mega burger — a must try!',          price:120, cat:'burger'   },
  { id:18, name:'Plane Maggi',                        desc:'Simple, comforting classic Maggi noodles',         price:80,  cat:'maggi'    },
  { id:19, name:'Masala Maggi',                       desc:'Extra spicy masala Maggi loaded with flavour',     price:90,  cat:'maggi'    },
  { id:20, name:'Cheese Corn Maggi',                  desc:'Creamy cheese and sweet corn Maggi',               price:100, cat:'maggi'    },
  { id:21, name:'Cheese Chilli Maggi',                desc:'Spicy chilli and melted cheese Maggi',             price:100, cat:'maggi'    },
];

// ===== STATE =====
let menuData   = JSON.parse(localStorage.getItem('laben_menu')   || 'null') || JSON.parse(JSON.stringify(DEFAULT_MENU));
let cart       = JSON.parse(localStorage.getItem('laben_cart')   || '[]');
let orders     = JSON.parse(localStorage.getItem('laben_orders') || '[]');
let nextId     = menuData.reduce((a, b) => Math.max(a, b.id), 0) + 1;
let currentCat = 'all';
let adminTab   = 'orders';
let upiPaymentConfirmed = false;
let firebaseDB = null;
let firebaseOK = false;

function saveMenu()   { localStorage.setItem('laben_menu',   JSON.stringify(menuData)); }
function saveCart()   { localStorage.setItem('laben_cart',   JSON.stringify(cart));     }
function saveOrders() { localStorage.setItem('laben_orders', JSON.stringify(orders));   }

// ===== TOAST =====
function showToast(msg, type) {
  const old = document.getElementById('laben-toast');
  if (old) old.remove();
  const colors = { success:'#16a34a', warning:'#d97706', error:'#dc2626', info:'#2563eb' };
  const t = document.createElement('div');
  t.id = 'laben-toast';
  t.style.cssText = 'position:fixed;bottom:24px;left:50%;transform:translateX(-50%);' +
    'background:' + (colors[type]||'#333') + ';color:#fff;padding:11px 22px;border-radius:50px;' +
    'font-size:13px;font-weight:600;z-index:99999;box-shadow:0 4px 20px rgba(0,0,0,.25);' +
    'font-family:Poppins,sans-serif;white-space:nowrap;transition:opacity .4s;';
  t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(() => { t.style.opacity = '0'; setTimeout(() => t.remove(), 400); }, 3500);
}

// ===== FIREBASE INIT (uses compat SDK loaded via <script> in index.html) =====
function initFirebase() {
  try {
    if (typeof firebase === 'undefined') {
      console.warn('⚠️ Firebase SDK not loaded');
      showToast('⚠️ Firebase SDK missing — check index.html script tags', 'warning');
      return;
    }

    const cfg = {
      apiKey:            "AIzaSyAQ_8cq9DWzXb5bgl2SpY5xI5TYKd-6dfA",
      authDomain:        "laben-cafe.firebaseapp.com",
      databaseURL:       "https://laben-cafe-default-rtdb.asia-southeast1.firebasedatabase.app",
      projectId:         "laben-cafe",
      storageBucket:     "laben-cafe.firebasestorage.app",
      messagingSenderId: "236045385314",
      appId:             "1:236045385314:web:a363accd4d0b9f0fe35b3b"
    };

    if (!firebase.apps.length) firebase.initializeApp(cfg);
    firebaseDB = firebase.database();
    firebaseOK = true;
    console.log('✅ Firebase initialized');
    showToast('🔥 Firebase connected!', 'success');

    // Realtime sync of orders
    firebaseDB.ref('orders').on('value', snapshot => {
      const data = snapshot.val();
      if (data) {
        const fbArr = Object.entries(data)
          .map(([k, v]) => ({ ...v, _fbKey: k }))
          .sort((a, b) => (b.timestamp||0) - (a.timestamp||0));

        fbArr.forEach(fbO => {
          const local = orders.find(o => o.id === fbO.id);
          if (!local) orders.unshift(fbO);
          else { local.status = fbO.status; local._fbKey = fbO._fbKey; }
        });
        saveOrders();

        const dash = document.getElementById('admin-dashboard');
        if (dash && dash.style.display !== 'none') renderOrdersList();
        console.log('✅ Firebase orders synced:', fbArr.length);
      }
    }, err => {
      console.error('❌ Firebase read error:', err.code, err.message);
      showToast('❌ Firebase error: ' + err.message, 'error');
    });

  } catch(e) {
    console.error('❌ Firebase init failed:', e.message);
    showToast('⚠️ Firebase init failed: ' + e.message, 'error');
  }
}

function saveOrderToFirebase(order) {
  if (!firebaseOK || !firebaseDB) {
    console.warn('⚠️ Firebase not ready — order saved locally');
    return;
  }
  firebaseDB.ref('orders').push(order)
    .then(() => { console.log('✅ Saved to Firebase:', order.id); showToast('✅ Order sent to cloud!', 'success'); })
    .catch(err => { console.error('❌ Firebase write failed:', err.code, err.message); showToast('❌ Firebase write failed — check DB rules!', 'error'); });
}

// ===== RENDER MENU =====
function getItemImage(item) {
  return ITEM_IMAGES[item.name] || CATEGORY_IMAGES[item.cat] || CATEGORY_IMAGES.pizza;
}

function renderMenu() {
  const grid  = document.getElementById('menu-grid');
  const items = currentCat === 'all' ? menuData : menuData.filter(i => i.cat === currentCat);
  if (items.length === 0) {
    grid.innerHTML = `<div class="col-12 text-center text-muted py-5"><i class="bi bi-search fs-2 d-block mb-2"></i>No items in this category.</div>`;
    return;
  }
  grid.innerHTML = items.map(item => {
    const imgSrc   = getItemImage(item);
    const fallback = CATEGORY_IMAGES[item.cat] || CATEGORY_IMAGES.pizza;
    const catLabel = item.cat.charAt(0).toUpperCase() + item.cat.slice(1);
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
            <button class="btn-add-cart" onclick="addToCart(${item.id})" title="Add to cart"><i class="bi bi-plus-lg"></i></button>
          </div>
        </div>
      </div>
    </div>`;
  }).join('');
  observeFadeIn();
}

document.querySelectorAll('.menu-tab').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.menu-tab').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentCat = btn.dataset.cat;
    renderMenu();
  });
});

// ===== CART =====
function addToCart(itemId) {
  const item = menuData.find(i => i.id === itemId);
  if (!item) return;
  const ex = cart.find(c => c.id === itemId);
  if (ex) ex.qty++;
  else cart.push({ id: item.id, name: item.name, price: item.price, qty: 1 });
  saveCart(); updateCartUI(); showAddedFeedback(itemId);
}

function removeFromCart(itemId) {
  const idx = cart.findIndex(c => c.id === itemId);
  if (idx === -1) return;
  if (cart[idx].qty > 1) cart[idx].qty--;
  else cart.splice(idx, 1);
  saveCart(); updateCartUI();
}

function clearCart() { cart = []; saveCart(); updateCartUI(); }
function getCartTotal() { return cart.reduce((s, c) => s + c.price * c.qty, 0); }

function updateCartUI() {
  const totalQty = cart.reduce((s, c) => s + c.qty, 0);
  document.getElementById('cart-count').textContent = totalQty;
  const list = document.getElementById('cart-items-list');
  if (cart.length === 0) {
    list.innerHTML = `<div class="cart-empty"><i class="bi bi-bag-x"></i>Your cart is empty.<br><small class="text-muted">Add items from the menu!</small></div>`;
  } else {
    list.innerHTML = cart.map(c => `
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
        <strong style="min-width:52px;text-align:right;color:var(--accent)">₹${c.price * c.qty}</strong>
      </div>`).join('');
  }
  document.getElementById('cart-total').textContent = getCartTotal();
  const summaryBox = document.getElementById('order-summary-box');
  if (cart.length === 0) {
    summaryBox.innerHTML = `<p class="mb-0 text-muted">Your cart is empty. Add items from the menu above.</p>`;
  } else {
    summaryBox.innerHTML = `
      <strong class="d-block mb-2"><i class="bi bi-bag me-1"></i>Order Summary</strong>
      ${cart.map(c => `<div class="d-flex justify-content-between"><span>${c.name} × ${c.qty}</span><span>₹${c.price * c.qty}</span></div>`).join('')}
      <hr class="my-2">
      <div class="d-flex justify-content-between fw-bold"><span>Total</span><span style="color:var(--accent)">₹${getCartTotal()}</span></div>`;
  }
}

function showAddedFeedback(itemId) {
  const btn = document.querySelector(`.btn-add-cart[onclick="addToCart(${itemId})"]`);
  if (!btn) return;
  btn.style.background = '#16a34a';
  btn.innerHTML = '<i class="bi bi-check-lg"></i>';
  setTimeout(() => { btn.style.background = ''; btn.innerHTML = '<i class="bi bi-plus-lg"></i>'; }, 900);
}

function scrollToOrder() {
  const oc = bootstrap.Offcanvas.getInstance(document.getElementById('cartPanel'));
  if (oc) oc.hide();
  setTimeout(() => document.getElementById('order').scrollIntoView({ behavior: 'smooth' }), 300);
}

// ===== ORDER =====
function placeOrder(e) {
  e.preventDefault();
  if (cart.length === 0) { alert('Your cart is empty! Please add some items first.'); return; }
  const payment = document.getElementById('ord-payment').value;
  if (payment === 'UPI' && !upiPaymentConfirmed) { openUpiModal(getCartTotal()); return; }

  const name    = document.getElementById('ord-name').value;
  const phone   = document.getElementById('ord-phone').value;
  const address = document.getElementById('ord-address').value;
  const note    = document.getElementById('ord-note').value;
  const orderId = 'LBN' + Date.now().toString().slice(-6);
  const timeStr = new Date().toLocaleString('en-IN', { day:'2-digit', month:'short', year:'numeric', hour:'2-digit', minute:'2-digit', hour12:true });

  const newOrder = { id:orderId, time:timeStr, timestamp:Date.now(), name, phone, address, payment, note:note||'', items:JSON.parse(JSON.stringify(cart)), total:getCartTotal(), status:'new' };
  orders.unshift(newOrder);
  saveOrders();
  saveOrderToFirebase(newOrder);
  showOrderConfirmation(orderId, name, phone, address, payment, note, getCartTotal());
  upiPaymentConfirmed = false;
  clearCart();
  document.getElementById('orderForm').reset();
  document.getElementById('upi-info-hint').style.display = 'none';
}

function showOrderConfirmation(orderId, name, phone, address, payment, note, total, utrId) {
  const conf = document.getElementById('order-confirmation');
  conf.style.display = 'block';
  conf.innerHTML = `
    <div class="order-success">
      <i class="bi bi-check-circle-fill me-2"></i>
      <strong>Order Placed Successfully!</strong><br>
      <span class="small">Order ID: <strong>${orderId}</strong></span><br>
      <span class="small">Name: ${name} | Phone: ${phone}</span><br>
      <span class="small">Delivery to: ${address}</span><br>
      <span class="small">Payment: ${payment} | Total: <strong>₹${total}</strong></span>
      ${utrId ? `<br><span class="small">UTR/Txn ID: <strong style="font-family:monospace;color:#5f259f">${utrId}</strong></span>` : ''}
      ${note ? `<br><span class="small">Note: ${note}</span>` : ''}
      <br><span class="small text-success">We'll call you to confirm your order shortly. 🙏</span>
    </div>`;
  conf.scrollIntoView({ behavior: 'smooth' });
}

// ===== ADMIN =====
function adminLogin() {
  const u = document.getElementById('adm-user').value;
  const p = document.getElementById('adm-pass').value;
  if (u === 'admin' && p === 'laben123') {
    document.getElementById('admin-login-wrap').style.display = 'none';
    document.getElementById('admin-dashboard').style.display  = 'block';
    switchAdminTab('orders');
  } else {
    document.getElementById('adm-err').style.display = 'block';
  }
}

function switchAdminTab(tab) {
  adminTab = tab;
  document.querySelectorAll('.adm-tab-btn').forEach(b => b.classList.remove('active'));
  document.getElementById('adm-tab-' + tab).classList.add('active');
  document.getElementById('adm-panel-orders').style.display = tab === 'orders' ? 'block' : 'none';
  document.getElementById('adm-panel-menu').style.display   = tab === 'menu'   ? 'block' : 'none';
  if (tab === 'orders') renderOrdersList();
  if (tab === 'menu')   renderAdminList();
}

function adminLogout() {
  document.getElementById('admin-login-wrap').style.display = 'block';
  document.getElementById('admin-dashboard').style.display  = 'none';
  document.getElementById('adm-user').value = '';
  document.getElementById('adm-pass').value = '';
}

function adminAddItem() {
  const name  = document.getElementById('adm-name').value.trim();
  const price = parseFloat(document.getElementById('adm-price').value);
  const desc  = document.getElementById('adm-desc').value.trim();
  const cat   = document.getElementById('adm-cat').value;
  if (!name || !price) { alert('Please enter item name and price.'); return; }
  menuData.push({ id: nextId++, name, desc: desc||'', price, cat });
  saveMenu(); renderAdminList(); renderMenu();
  document.getElementById('adm-name').value  = '';
  document.getElementById('adm-price').value = '';
  document.getElementById('adm-desc').value  = '';
}

function adminDeleteItem(id) {
  if (!confirm('Remove this item from the menu?')) return;
  menuData = menuData.filter(i => i.id !== id);
  saveMenu(); renderAdminList(); renderMenu();
}

function renderAdminList() {
  document.getElementById('adm-count').textContent = menuData.length;
  document.getElementById('adm-items-list').innerHTML = menuData.map(item => `
    <div class="adm-item">
      <div class="adm-item-info">
        <div class="adm-item-name">${item.name}</div>
        <div class="adm-item-meta">
          <span class="cat-badge">${item.cat}</span>
          ${item.desc ? `<span class="ms-1">${item.desc.slice(0,35)}${item.desc.length>35?'...':''}</span>` : ''}
        </div>
      </div>
      <span class="adm-item-price">₹${item.price}</span>
      <button class="adm-del-btn" onclick="adminDeleteItem(${item.id})" title="Delete"><i class="bi bi-trash3-fill"></i></button>
    </div>`).join('');
}

function renderOrdersList() {
  const wrap     = document.getElementById('adm-orders-list');
  const filter   = (document.getElementById('adm-order-filter')||{}).value || 'all';
  const filtered = filter === 'all' ? orders : orders.filter(o => o.status === filter);

  document.getElementById('adm-orders-count').textContent = orders.length;
  const newCount = orders.filter(o => o.status === 'new').length;
  const badge = document.getElementById('adm-new-badge');
  badge.textContent   = newCount;
  badge.style.display = newCount > 0 ? 'inline-block' : 'none';

  const revenue = orders.filter(o => o.status === 'delivered').reduce((s,o) => s+o.total, 0);
  const statsEl = document.getElementById('adm-order-stats');
  if (statsEl) statsEl.innerHTML = `
    <div class="adm-stat-pill"><i class="bi bi-receipt me-1"></i><strong>${orders.length}</strong> Total</div>
    <div class="adm-stat-pill new-pill"><i class="bi bi-bell me-1"></i><strong>${orders.filter(o=>o.status==='new').length}</strong> New</div>
    <div class="adm-stat-pill prep-pill"><i class="bi bi-fire me-1"></i><strong>${orders.filter(o=>o.status==='preparing').length}</strong> Preparing</div>
    <div class="adm-stat-pill done-pill"><i class="bi bi-check2-circle me-1"></i><strong>₹${revenue}</strong> Earned</div>`;

  if (filtered.length === 0) {
    wrap.innerHTML = `<div style="text-align:center;padding:2.5rem 1rem;color:var(--muted);font-size:.9rem;"><i class="bi bi-inbox" style="font-size:2.5rem;display:block;margin-bottom:.75rem;opacity:.4;"></i>No orders found.</div>`;
    return;
  }

  const sC = { new:'#e8500a', preparing:'#d97706', delivered:'#16a34a' };
  const sB = { new:'#fff4f0', preparing:'#fffbeb', delivered:'#f0fdf4' };
  const sL = { new:'🆕 New Order', preparing:'🍳 Preparing', delivered:'✅ Delivered' };
  const pI = { COD:'💵', UPI:'📱', Card:'💳' };

  wrap.innerHTML = filtered.map(o => {
    const tot = o.items.reduce((s,it) => s+(it.price*it.qty), 0);
    return `
    <div class="adm-order-card" id="order-card-${o.id}" style="border-left:4px solid ${sC[o.status]}">
      <div class="adm-order-head">
        <div class="d-flex align-items-center gap-2 flex-wrap">
          <span class="adm-order-id">#${o.id}</span>
          <span class="adm-order-time"><i class="bi bi-clock me-1"></i>${o.time}</span>
        </div>
        <span class="adm-order-status-badge" style="background:${sB[o.status]};color:${sC[o.status]};border:1px solid ${sC[o.status]}33">${sL[o.status]}</span>
      </div>
      <div class="adm-detail-section">
        <div class="adm-detail-label"><i class="bi bi-person-fill me-1"></i>Customer Details</div>
        <div class="adm-detail-grid">
          <div class="adm-detail-row"><span class="adm-detail-key">Name</span><span class="adm-detail-val"><strong>${o.name}</strong></span></div>
          <div class="adm-detail-row"><span class="adm-detail-key">Phone</span><span class="adm-detail-val"><a href="tel:${o.phone}" style="color:var(--accent);text-decoration:none;font-weight:600;"><i class="bi bi-telephone-fill me-1"></i>${o.phone}</a></span></div>
          <div class="adm-detail-row"><span class="adm-detail-key">Address</span><span class="adm-detail-val"><i class="bi bi-geo-alt-fill me-1" style="color:#e8500a"></i>${o.address}</span></div>
        </div>
      </div>
      <div class="adm-detail-section">
        <div class="adm-detail-label"><i class="bi bi-credit-card-fill me-1"></i>Payment Details</div>
        <div class="adm-detail-grid">
          <div class="adm-detail-row"><span class="adm-detail-key">Method</span><span class="adm-detail-val"><span class="adm-pay-badge">${pI[o.payment]||'💰'} ${o.payment}</span></span></div>
          <div class="adm-detail-row"><span class="adm-detail-key">Amount</span><span class="adm-detail-val" style="font-size:1.1rem;font-weight:700;color:var(--accent)">₹${o.total}</span></div>
          ${o.utrId ? `<div class="adm-detail-row"><span class="adm-detail-key">UTR ID</span><span class="adm-detail-val" style="font-family:monospace;font-weight:700;color:#5f259f;">${o.utrId}</span></div>` : ''}
        </div>
      </div>
      <div class="adm-detail-section">
        <div class="adm-detail-label"><i class="bi bi-bag-fill me-1"></i>Order Items</div>
        <div class="adm-items-table">
          ${o.items.map(it=>`<div class="adm-item-row"><span class="adm-item-row-name">${it.name}</span><span class="adm-item-row-qty">×${it.qty}</span><span class="adm-item-row-price">₹${it.price*it.qty}</span></div>`).join('')}
          <div class="adm-item-row adm-item-total-row"><span class="adm-item-row-name" style="font-weight:700">Total</span><span class="adm-item-row-qty"></span><span class="adm-item-row-price" style="color:var(--accent);font-weight:700;font-size:1rem">₹${tot}</span></div>
        </div>
      </div>
      ${o.note ? `<div class="adm-detail-section"><div class="adm-detail-label"><i class="bi bi-chat-left-text-fill me-1"></i>Special Instructions</div><div class="adm-note-box">${o.note}</div></div>` : ''}
      <div class="adm-order-actions-row">
        ${o.status==='new'       ? `<button class="adm-status-btn preparing" onclick="updateOrderStatus('${o.id}','preparing')"><i class="bi bi-fire me-1"></i>Start Preparing</button>` : ''}
        ${o.status==='preparing' ? `<button class="adm-status-btn delivered" onclick="updateOrderStatus('${o.id}','delivered')"><i class="bi bi-check2-circle me-1"></i>Mark Delivered</button>` : ''}
        ${o.status==='delivered' ? `<span class="adm-done-tag"><i class="bi bi-check-circle-fill me-1"></i>Order Completed</span>` : ''}
        <button class="adm-del-btn" onclick="deleteOrder('${o.id}')" title="Delete order"><i class="bi bi-trash3"></i> Delete</button>
      </div>
    </div>`;
  }).join('');
}

function updateOrderStatus(orderId, newStatus) {
  const order = orders.find(o => o.id === orderId);
  if (!order) return;
  order.status = newStatus;
  saveOrders();
  renderOrdersList();
  if (firebaseOK && firebaseDB && order._fbKey) {
    firebaseDB.ref('orders/' + order._fbKey).update({ status: newStatus })
      .catch(err => console.warn('Firebase update error:', err.message));
  }
}

function deleteOrder(orderId) {
  if (!confirm('Delete this order?')) return;
  const order = orders.find(o => o.id === orderId);
  orders = orders.filter(o => o.id !== orderId);
  saveOrders();
  renderOrdersList();
  if (firebaseOK && firebaseDB && order && order._fbKey) {
    firebaseDB.ref('orders/' + order._fbKey).remove()
      .catch(err => console.warn('Firebase delete error:', err.message));
  }
}

function clearAllOrders() {
  if (!confirm('Clear ALL delivered orders?')) return;
  orders = orders.filter(o => o.status !== 'delivered');
  saveOrders();
  renderOrdersList();
}

// ===== SCROLL ANIMATIONS =====
function observeFadeIn() {
  const els = document.querySelectorAll('.fade-in');
  const obs = new IntersectionObserver(entries => {
    entries.forEach((e, i) => {
      if (e.isIntersecting) { setTimeout(() => e.target.classList.add('visible'), i * 60); obs.unobserve(e.target); }
    });
  }, { threshold: 0.1 });
  els.forEach(el => obs.observe(el));
}

window.addEventListener('scroll', () => {
  const nav = document.getElementById('mainNav');
  if (window.scrollY > 50) { nav.style.background = 'rgba(26,20,16,0.98)'; nav.style.boxShadow = '0 2px 20px rgba(0,0,0,0.3)'; }
  else { nav.style.background = 'rgba(26,20,16,0.95)'; nav.style.boxShadow = 'none'; }
});

// ===== UPI =====
var UPI_ID = "9665539828@ibl", UPI_NAME = "The Laben Cafe";

function handlePaymentChange() {
  var m = document.getElementById('ord-payment').value;
  document.getElementById('upi-info-hint').style.display = m === 'UPI' ? 'flex' : 'none';
  if (m !== 'UPI') upiPaymentConfirmed = false;
}

function copyUpiId() {
  navigator.clipboard.writeText(UPI_ID).then(() => showToast('Copied: ' + UPI_ID, 'success'));
}

function openUpiModal(amount) {
  document.getElementById('upi-display-amount').textContent = amount;
  document.getElementById('upi-id-text').textContent        = UPI_ID;
  var link = 'upi://pay?pa=' + UPI_ID + '&pn=' + encodeURIComponent(UPI_NAME) + '&am=' + amount + '&cu=INR&tn=The%20Laben%20Cafe%20Order';
  document.getElementById('upi-deep-link').href = link;
  document.getElementById('upi-qr-img').src     = 'https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=' + encodeURIComponent(link);
  var utrInput = document.getElementById('upi-utr-input');
  if (utrInput) utrInput.value = '';
  var utrError = document.getElementById('upi-utr-error');
  if (utrError) utrError.style.display = 'none';
  document.getElementById('upiModal').classList.add('active');
}

function closeUpiModal() { document.getElementById('upiModal').classList.remove('active'); }

function validateUtrInput() {
  var i = document.getElementById('upi-utr-input'), e = document.getElementById('upi-utr-error');
  if (i && e) e.style.display = (i.value.trim().length > 0 && i.value.trim().length < 8) ? 'block' : 'none';
}

function confirmUpiPayment() {
  var utrInput = document.getElementById('upi-utr-input');
  var utrError = document.getElementById('upi-utr-error');
  var utrValue = utrInput ? utrInput.value.trim() : '';

  if (!utrValue || utrValue.length < 8) {
    if (utrError) utrError.style.display = 'block';
    if (utrInput) {
      utrInput.focus();
      utrInput.style.borderColor = '#dc2626';
      utrInput.style.boxShadow   = '0 0 0 3px rgba(220,38,38,.15)';
      setTimeout(() => { utrInput.style.borderColor = ''; utrInput.style.boxShadow = ''; }, 2500);
    }
    return; // ❌ BLOCKED
  }

  var name    = document.getElementById('ord-name').value.trim();
  var phone   = document.getElementById('ord-phone').value.trim();
  var address = document.getElementById('ord-address').value.trim();
  if (!name || !phone || !address) {
    closeUpiModal();
    alert('Please fill in your Name, Phone, and Address before confirming payment.');
    return;
  }

  closeUpiModal();
  var note    = document.getElementById('ord-note').value;
  var orderId = 'LBN' + Date.now().toString().slice(-6);
  var timeStr = new Date().toLocaleString('en-IN', { day:'2-digit', month:'short', year:'numeric', hour:'2-digit', minute:'2-digit', hour12:true });

  var newOrder = { id:orderId, time:timeStr, timestamp:Date.now(), name, phone, address, payment:'UPI', utrId:utrValue, note:note||'', items:JSON.parse(JSON.stringify(cart)), total:getCartTotal(), status:'new' };
  orders.unshift(newOrder);
  saveOrders();
  saveOrderToFirebase(newOrder);

  showOrderConfirmation(orderId, name, phone, address, 'UPI', note, getCartTotal(), utrValue);
  clearCart();
  document.getElementById('orderForm').reset();
  document.getElementById('upi-info-hint').style.display = 'none';
}

// ===== INIT =====
renderMenu();
updateCartUI();
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initFirebase);
else initFirebase();
