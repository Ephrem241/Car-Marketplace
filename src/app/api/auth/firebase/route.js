import { NextResponse } from "next/server";
import { getAuth } from "firebase-admin/auth";
import { initializeApp, getApps, cert } from "firebase-admin/app";
import { auth, currentUser } from "@clerk/nextjs/server";

// Initialize Firebase Admin if not already initialized
const FIREBASE_ADMIN_APPS = getApps();

if (!FIREBASE_ADMIN_APPS.length) {
  // Handle the private key properly
  const privateKey = process.env.FIREBASE_PRIVATE_KEY
    ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n")
    : undefined;

  try {
    initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: privateKey,
      }),
    });
  } catch (error) {
    console.error("Firebase admin initialization error:", error);
    throw error;
  }
}

export async function POST(request) {
  try {
    // Get the current user from Clerk
    const user = await currentUser();

    if (!user) {
      return NextResponse.json(
        { error: "User must be authenticated with Clerk" },
        { status: 401 }
      );
    }

    // Generate a custom token using the Clerk user ID
    const customToken = await getAuth().createCustomToken(user.id, {
      // Add Clerk user metadata as custom claims
      email: user.emailAddresses[0]?.emailAddress,
      firstName: user.firstName,
      lastName: user.lastName,
      role: "user",
    });

    return NextResponse.json({ token: customToken });
  } catch (error) {
    console.error("Firebase token generation error:", error);
    return NextResponse.json(
      {
        error: "Authentication failed",
        details:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}
