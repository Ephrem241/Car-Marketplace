import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getStorage } from "firebase-admin/storage";
import { getAuth } from "firebase-admin/auth";

// Initialize Firebase Admin
function initAdmin() {
  const apps = getApps();
  if (!apps.length) {
    // Handle the private key properly, replacing escaped newlines
    const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY
      ? process.env.FIREBASE_ADMIN_PRIVATE_KEY.replace(/\\n/g, "\n")
      : undefined;

    if (!privateKey) {
      throw new Error("FIREBASE_ADMIN_PRIVATE_KEY is not configured");
    }

    return initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
        privateKey: privateKey,
      }),
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    });
  }

  return apps[0];
}

// Initialize the admin app
const adminApp = initAdmin();

// Export admin services
export const adminAuth = getAuth(adminApp);
export const adminStorage = getStorage(adminApp);

export { adminApp };
