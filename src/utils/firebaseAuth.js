import { getAuth, signInWithCustomToken } from "firebase/auth";
import { app } from "@/firebase";

export async function signInToFirebase(userId) {
  try {
    // Get a custom token from your backend
    const response = await fetch("/api/auth/firebase-token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId }),
    });

    if (!response.ok) {
      throw new Error("Failed to get Firebase token");
    }

    const { token } = await response.json();
    const auth = getAuth(app);

    // Sign in with the custom token
    await signInWithCustomToken(auth, token);
  } catch (error) {
    console.error("Firebase auth error:", error);
    throw error;
  }
}
