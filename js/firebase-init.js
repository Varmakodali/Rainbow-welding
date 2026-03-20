import { initializeApp } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-analytics.js";
import { getFirestore, collection, addDoc, getDocs } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAcSLEbTDjqqNy7ghUYgLY3D_znPQKdfvs",
  authDomain: "rainbow-welding.firebaseapp.com",
  projectId: "rainbow-welding",
  storageBucket: "rainbow-welding.firebasestorage.app",
  messagingSenderId: "560062426459",
  appId: "1:560062426459:web:eb803b03a9cefcbc5f3e7e",
  measurementId: "G-YM17SSVWYL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

// Make available globally so app.js can use them without being a module itself
window.firebaseApp = app;
window.firebaseDb = db;
window.firebaseAddDoc = addDoc;
window.firebaseCollection = collection;
window.firebaseGetDocs = getDocs;

console.log("Firebase successfully initialized.");
