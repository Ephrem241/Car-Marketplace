import { getAuth, signInWithCustomToken } from "firebase/auth";
import { app } from "@/firebase";

export async function signInToFirebase() {
  try {
    const auth = getAuth(app);

    // Get the custom token from your backend
    const response = await fetch("/api/auth/firebase-token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to get Firebase token");
    }

    const { token } = await response.json();

    // Sign in to Firebase with the custom token
    await signInWithCustomToken(auth, token);

    return auth.currentUser;
  } catch (error) {
    console.error("Firebase auth error:", error);
    // Don't throw, just return null - let the calling code handle the absence of authentication
    return null;
  }
}
