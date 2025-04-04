import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { adminAuth } from "@/lib/firebase-admin";

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
    const customToken = await adminAuth.createCustomToken(user.id, {
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
