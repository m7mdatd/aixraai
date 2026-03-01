// ─── Firebase Configuration ───────────────────────────────────
// 1. اذهب لـ console.firebase.google.com
// 2. أنشئ مشروع جديد
// 3. اضغط "Add App" → Web
// 4. انسخ الـ config وضعه هنا

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// ⚠️ استبدل هذه القيم بإعدادات مشروعك الحقيقية
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID",
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
export default app;

// ─── Firestore Collections Structure ─────────────────────────
//
// clients/
//   {clientId}/
//     name, email, domain, plan, sk, status
//     usage, limit, conversations, satisfaction
//     created, renewal, lastActive
//
// siteContent/
//   landing/
//     hero: { badge, headline, subheadline, cta1, cta2, stats[] }
//     features: [{ icon, title, desc }]
//     plans: [{ name, price, features[] }]
//     testimonials: [{ name, role, text }]
//     cta_section: { headline, sub, cta }
//
// analytics/
//   {clientId}/
//     daily: { date, messages, conversations }
//     topQuestions: [{ q, count }]
