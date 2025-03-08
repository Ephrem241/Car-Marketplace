import connect from "../../../lib/mongodb/mongoose.js";
import Car from "../../../lib/models/car.model.js";
import { getSessionUser } from "@/utils/getSessionUser.js";
import { NextResponse } from "next/server";
// Adjust import path to your Firebase config
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";
import { storage } from "@/firebase.js";
import { getAuth } from "firebase/auth";
import { app } from "@/firebase.js";
import { signInToFirebase } from "@/utils/firebaseAuth.js";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q");
    const fuel = searchParams.get("fuel");
    const transmission = searchParams.get("transmission");

    await connect();

    const page = Math.max(1, parseInt(searchParams.get("page")) || 1);
    const pageSize = Math.min(
      50,
      Math.max(1, parseInt(searchParams.get("pageSize")) || 9)
    );

    const skip = (page - 1) * pageSize;

    const query = {};

    if (q?.trim()) {
      query.$or = [
        { make: { $regex: q.trim(), $options: "i" } },
        { model: { $regex: q.trim(), $options: "i" } },
        { description: { $regex: q.trim(), $options: "i" } },
      ];
    }

    if (fuel?.trim()) {
      query.fuel_type = fuel.trim();
    }

    if (transmission?.trim()) {
      query.transmission = transmission.trim();
    }

    const [total, cars] = await Promise.all([
      Car.countDocuments(query),
      Car.find(query).sort({ createdAt: -1 }).skip(skip).limit(pageSize).lean(),
    ]);

    if (!cars) {
      return NextResponse.json({ error: "No cars found" }, { status: 404 });
    }

    return NextResponse.json({
      total,
      cars,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    });
  } catch (error) {
    console.error("Error fetching cars:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch cars",
        details:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}

export const POST = async (request) => {
  try {
    await connect();
    const user = await getSessionUser(request);

    // Check for admin status
    if (!user?.publicMetadata?.isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get Firebase auth instance
    const auth = getAuth(app);

    // Ensure Firebase is authenticated before upload
    if (!auth.currentUser) {
      await signInToFirebase(user.id);
    }

    let carData;
    let images = [];
    const contentType = request.headers.get("content-type");

    if (contentType?.includes("application/json")) {
      // Handle JSON request
      const jsonData = await request.json();
      carData = {
        make: jsonData.make,
        model: jsonData.model,
        year: Number(jsonData.year),
        price: Number(jsonData.price),
        description: jsonData.description,
        carClass: jsonData.carClass,
        drive: jsonData.drive,
        fuel_type: jsonData.fuel_type,
        transmission: jsonData.transmission,
        kph: Number(jsonData.kph),
        mileage: Number(jsonData.mileage),
        features: jsonData.features || [],
        images: jsonData.images || [],
      };
    } else {
      // Handle FormData request
      const formData = await request.formData();
      const imageFiles = formData.getAll("images");

      // Upload images to Firebase
      const uploadPromises = imageFiles.map(async (file) => {
        if (!(file instanceof File)) return null;

        const storageRef = ref(storage, `car-images/${uuidv4()}-${file.name}`);
        const arrayBuffer = await file.arrayBuffer();
        const uint8Array = new Uint8Array(arrayBuffer);

        const metadata = {
          contentType: file.type,
          metadata: {
            lastUpload: new Date().toISOString(),
            uploadedBy: user.id,
          },
        };

        try {
          const snapshot = await uploadBytes(storageRef, uint8Array, metadata);
          return await getDownloadURL(snapshot.ref);
        } catch (error) {
          console.error("Upload error:", error);
          return null;
        }
      });

      const uploadResults = await Promise.all(uploadPromises);
      const validImageUrls = uploadResults.filter((url) => url !== null);

      carData = {
        make: formData.get("make"),
        model: formData.get("model"),
        year: Number(formData.get("year")),
        price: Number(formData.get("price")),
        description: formData.get("description"),
        carClass: formData.get("carClass"),
        drive: formData.get("drive"),
        fuel_type: formData.get("fuel_type"),
        transmission: formData.get("transmission"),
        kph: Number(formData.get("kph")),
        mileage: Number(formData.get("mileage")),
        features: formData.getAll("features"),
        images: validImageUrls,
      };
    }

    // Validate required fields
    const requiredFields = [
      "make",
      "model",
      "year",
      "price",
      "carClass",
      "drive",
      "fuel_type",
      "transmission",
      "kph",
      "mileage",
      "description",
    ];
    for (const field of requiredFields) {
      if (!carData[field]) {
        return NextResponse.json(
          { error: `${field} is required` },
          { status: 400 }
        );
      }
    }

    const year = Number(carData.year);
    if (isNaN(year) || year < 1900 || year > new Date().getFullYear() + 1) {
      return NextResponse.json({ error: "Invalid year" }, { status: 400 });
    }

    // Validate images
    if (!carData.images || carData.images.length === 0) {
      return NextResponse.json(
        { error: "At least one image is required" },
        { status: 400 }
      );
    }

    if (carData.images.length > 4) {
      return NextResponse.json(
        { error: "Maximum of 4 images allowed" },
        { status: 400 }
      );
    }

    carData.createdBy = user.publicMetadata.userMongoId;

    const newCar = new Car(carData);
    await newCar.save();

    return NextResponse.json(
      {
        message: "Car Added Successfully",
        _id: newCar._id,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error adding car:", error);
    return NextResponse.json(
      {
        error: error.message || "Failed to add car",
      },
      { status: 500 }
    );
  }
};
