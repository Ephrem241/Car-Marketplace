import { cert, initializeApp as initAdmin } from "firebase-admin/app";
import { getStorage } from "firebase-admin/storage";

const adminApp = initAdmin({
  credential: cert({
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY
      ? JSON.parse(`"${process.env.FIREBASE_ADMIN_PRIVATE_KEY}"`)
      : undefined,
  }),
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
});

export const adminStorage = getStorage(adminApp);
