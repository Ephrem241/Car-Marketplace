import { signInWithCustomToken } from "firebase/auth";
import { auth } from "@/firebase";

export async function signInToFirebase() {
  try {
    // 1. Removed invalid useUser() hook
    if (auth.currentUser) return auth.currentUser;

    // 2. Fixed try/catch structure
    const response = await fetch("/api/auth/firebase", { method: "POST" });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to get Firebase token");
    }

    const { token } = await response.json();

    if (!token) {
      throw new Error("No token received from server");
    }

    const userCredential = await signInWithCustomToken(auth, token);
    return userCredential.user;
  } catch (error) {
    console.error("Firebase auth error:", error);
    throw error;
  }
}
