import {
  cert,
  initializeApp as initializeFirebaseAdmin,
} from "firebase-admin/app";
import { getStorage } from "firebase-admin/storage";

let app;

export function initAdmin() {
  if (!app) {
    app = initializeFirebaseAdmin({
      credential: cert({
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY
          ? JSON.parse(`"${process.env.FIREBASE_ADMIN_PRIVATE_KEY}"`)
          : undefined,
      }),
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    });
  }
  return app;
}

export const adminStorage = getStorage(app);
