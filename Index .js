// ===== Firebase Cloud Function =====
// File: functions/index.js
// Sends push notification to your phone when new order arrives

const functions = require('firebase-functions');
const admin     = require('firebase-admin');
admin.initializeApp();

exports.sendOrderNotification = functions.database
  .ref('/orders/{orderId}')
  .onCreate(async (snapshot) => {
    const order = snapshot.val();
    if (!order) return null;

    // Get all saved FCM tokens (your admin phones)
    const tokensSnap = await admin.database().ref('fcm_tokens').once('value');
    const tokensData = tokensSnap.val();
    if (!tokensData) return null;

    const tokens = Object.values(tokensData).map(t => t.token).filter(Boolean);
    if (!tokens.length) return null;

    // Send push to all admin devices
    const response = await admin.messaging().sendEachForMulticast({
      tokens,
      data: {
        title: '🛎️ New Order #' + order.id,
        body:  '👤 ' + order.name + ' · ₹' + order.total + ' · ' + order.payment + '\n📍 ' + order.address,
        tag:   'order-' + order.id
      },
      android: { priority: 'high' },
      apns:    { headers: { 'apns-priority': '10' } }
    });

    console.log('Sent to', response.successCount, '/', tokens.length, 'devices');

    // Remove invalid tokens
    const bad = [];
    response.responses.forEach((r, i) => {
      if (!r.success) bad.push(tokens[i]);
    });
    if (bad.length) {
      const removes = Object.entries(tokensData)
        .filter(([, v]) => bad.includes(v.token))
        .map(([k]) => admin.database().ref('fcm_tokens/' + k).remove());
      await Promise.all(removes);
    }
    return null;
  });
