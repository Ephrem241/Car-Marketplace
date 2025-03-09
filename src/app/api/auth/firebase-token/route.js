import { NextResponse } from "next/server";
import { getAuth } from "firebase-admin/auth";
import { initAdmin } from "@/firebase-admin";
import { auth, currentUser } from "@clerk/nextjs/server";
import { rateLimitMiddleware } from "@/utils/rateLimit";

// Initialize Firebase Admin if not already initialized
initAdmin();

export async function POST(request) {
  try {
    // Apply rate limiting
    const rateLimitResponse = await rateLimitMiddleware(
      request,
      50,
      "firebase-token"
    );
    if (rateLimitResponse) return rateLimitResponse;

    // Get the authenticated user from Clerk
    const { userId } = auth();
    const user = await currentUser();

    if (!userId || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Generate a custom token using the Clerk user ID
    const customToken = await getAuth().createCustomToken(userId);

    return NextResponse.json({ token: customToken });
  } catch (error) {
    console.error("Firebase token generation error:", error);
    return NextResponse.json(
      {
        error: "Failed to generate Firebase token",
        details:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}
