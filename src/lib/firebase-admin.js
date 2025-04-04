import {
  cert,
  initializeApp as initializeFirebaseAdmin,
} from "firebase-admin/app";
import { getStorage } from "firebase-admin/storage";

let app;
let storage;

export function initAdmin() {
  if (!app) {
    // Handle the private key properly, replacing escaped newlines
    const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY
      ? process.env.FIREBASE_ADMIN_PRIVATE_KEY.replace(/\\n/g, "\n")
      : undefined;

    if (!privateKey) {
      throw new Error("FIREBASE_ADMIN_PRIVATE_KEY is not configured");
    }

    app = initializeFirebaseAdmin({
      credential: cert({
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
        privateKey: privateKey,
      }),
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    });
    storage = getStorage(app);
  }
  return app;
}

export function getAdminStorage() {
  if (!storage) {
    initAdmin();
  }
  return storage;
}

// Export storage instance for backward compatibility
export const adminStorage = {
  get bucket() {
    return getAdminStorage().bucket();
  },
};
