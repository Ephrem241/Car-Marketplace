import { initializeApp, getApps, cert } from "firebase-admin/app";

export function initAdmin() {
  try {
    if (getApps().length) return;

    const privateKey = process.env.FIREBASE_PRIVATE_KEY
      ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n")
      : undefined;

    if (!privateKey) {
      throw new Error("FIREBASE_PRIVATE_KEY environment variable is not set");
    }

    if (!process.env.FIREBASE_PROJECT_ID) {
      throw new Error("FIREBASE_PROJECT_ID environment variable is not set");
    }

    if (!process.env.FIREBASE_CLIENT_EMAIL) {
      throw new Error("FIREBASE_CLIENT_EMAIL environment variable is not set");
    }

    return initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey,
      }),
    });
  } catch (error) {
    console.error("Firebase Admin initialization error:", error);
    throw error;
  }
}
