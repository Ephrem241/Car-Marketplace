import { NextResponse } from "next/server";
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import { storage } from "@/firebase.js";
import { v4 as uuidv4 } from "uuid";

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const fileBuffer = Buffer.from(await file.arrayBuffer());
    const fileType = file.type || "image/jpeg";

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(fileType)) {
      return NextResponse.json({ error: "Invalid file type" }, { status: 400 });
    }

    const storageRef = ref(storage, `cars/${uuidv4()}`);
    const metadata = { contentType: fileType };

    const uploadTask = uploadBytesResumable(storageRef, fileBuffer, metadata);

    await new Promise((resolve, reject) => {
      uploadTask.on(
        "state_changed",
        null,
        (error) => reject(error),
        () => resolve()
      );
    });

    const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);

    return NextResponse.json({ url: downloadURL }, { status: 200 });
  } catch (error) {
    console.error("File upload error:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
