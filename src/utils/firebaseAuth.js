import { getAuth, signInWithCustomToken } from "firebase/auth";
import { app } from "@/firebase";

export async function signInToFirebase(userId) {
  try {
    const response = await fetch("/api/auth/firebase", {
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
    await signInWithCustomToken(auth, token);
  } catch (error) {
    console.error("Firebase authentication error:", error);
    throw error;
  }
}
