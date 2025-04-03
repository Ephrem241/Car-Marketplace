import { app } from "@/firebase";
import { getStorage, ref, getDownloadURL } from "firebase/storage";

const storage = getStorage(app);

export async function getImageUrl(imagePath: string): Promise<string> {
  try {
    // First try to get the URL directly from Firebase Storage
    const imageRef = ref(storage, imagePath);
    return await getDownloadURL(imageRef);
  } catch (error) {
    console.error("Error getting direct download URL:", error);

    // If direct URL fails, try getting it through our API
    try {
      const response = await fetch(
        `/api/storage/url?path=${encodeURIComponent(imagePath)}`
      );
      if (!response.ok) {
        throw new Error("Failed to get image URL from API");
      }
      const data = await response.json();
      return data.url;
    } catch (apiError) {
      console.error("Error getting URL from API:", apiError);
      throw apiError;
    }
  }
}

export function isValidImageUrl(url: string): boolean {
  return (
    url.startsWith("https://firebasestorage.googleapis.com") ||
    url.startsWith("https://res.firebasestorage.googleapis.com")
  );
}
