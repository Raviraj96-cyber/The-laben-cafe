// firebase-config.js

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyAQ_8cq9DWzXb5bgl2SpY5xI5TYKd-6dfA",
  authDomain: "laben-cafe.firebaseapp.com",
  databaseURL: "https://laben-cafe-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "laben-cafe",
  storageBucket: "laben-cafe.firebasestorage.app",
  messagingSenderId: "236045385314",
  appId: "1:236045385314:web:a363accd4d0b9f0fe35b3b",
  measurementId: "G-9FDYBQXZQZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Realtime Database
const database = getDatabase(app);

// Test write function
function writeTestData() {
  set(ref(database, 'test/firstEntry'), {
    name: "Cafe Test",
    createdAt: new Date().toISOString()
  });
  console.log("Test data written to Realtime Database");
}

writeTestData();
