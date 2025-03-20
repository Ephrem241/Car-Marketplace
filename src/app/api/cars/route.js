import connect from "../../../lib/mongodb/mongoose.js";
import Car from "../../../lib/models/car.model.js";
import { getSessionUser } from "@/utils/getSessionUser.js";
import { NextResponse } from "next/server";

import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";
import { storage } from "@/firebase.js";
import { getAuth } from "firebase/auth";
import { app } from "@/firebase.js";
import { signInToFirebase } from "@/utils/firebaseAuth.js";
import { validateCarData, validateImageFile } from "@/utils/validation";
import { rateLimitMiddleware } from "@/utils/rateLimit";
import { auth, currentUser } from "@clerk/nextjs/server";

export async function GET(request) {
  try {
    const rateLimitResponse = await rateLimitMiddleware(
      request,
      100,
      "car-list"
    );
    if (rateLimitResponse) return rateLimitResponse;

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
    const rateLimitResponse = await rateLimitMiddleware(
      request,
      10,
      "car-create"
    );
    if (rateLimitResponse) return rateLimitResponse;

    await connect();

    // Get the authenticated user from Clerk
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check for admin status in Clerk metadata
    const user = await currentUser();
    if (!user?.publicMetadata?.isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let carData;
    const contentType = request.headers.get("content-type");

    if (contentType?.includes("application/json")) {
      const jsonData = await request.json();
      const validation = validateCarData(jsonData);
      if (!validation.isValid) {
        return NextResponse.json(
          { error: "Validation failed", details: validation.errors },
          { status: 400 }
        );
      }
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
        link: jsonData.link,
      };
    } else {
      const auth = getAuth(app);
      const firebaseUser = !auth.currentUser
        ? await signInToFirebase()
        : auth.currentUser;

      if (!firebaseUser) {
        return NextResponse.json(
          { error: "Failed to authenticate with storage service" },
          { status: 500 }
        );
      }

      const formData = await request.formData();
      const imageFiles = formData.getAll("images");

      for (const file of imageFiles) {
        if (!(file instanceof File)) continue;
        const validation = validateImageFile(file);
        if (!validation.isValid) {
          return NextResponse.json(
            { error: "Image validation failed", details: validation.errors },
            { status: 400 }
          );
        }
      }

      const uploadPromises = imageFiles.map(async (file) => {
        if (!(file instanceof File)) return null;

        try {
          const storageRef = ref(
            storage,
            `car-images/${uuidv4()}-${file.name}`
          );
          const arrayBuffer = await file.arrayBuffer();
          const uint8Array = new Uint8Array(arrayBuffer);

          const metadata = {
            contentType: file.type,
            metadata: {
              lastUpload: new Date().toISOString(),
              uploadedBy: userId,
            },
          };

          const snapshot = await uploadBytes(storageRef, uint8Array, metadata);
          return await getDownloadURL(snapshot.ref);
        } catch (error) {
          console.error("Upload error:", error);
          return null;
        }
      });

      const uploadResults = await Promise.all(uploadPromises);
      const validImageUrls = uploadResults.filter((url) => url !== null);

      if (validImageUrls.length === 0) {
        return NextResponse.json(
          { error: "Failed to upload images" },
          { status: 500 }
        );
      }

      const formDataObj = Object.fromEntries(formData.entries());
      const validation = validateCarData({
        ...formDataObj,
        images: validImageUrls,
        features: formData.getAll("features"),
      });

      if (!validation.isValid) {
        return NextResponse.json(
          { error: "Validation failed", details: validation.errors },
          { status: 400 }
        );
      }

      carData = {
        make: formDataObj.make,
        model: formDataObj.model,
        year: Number(formDataObj.year),
        price: Number(formDataObj.price),
        description: formDataObj.description,
        carClass: formDataObj.carClass,
        drive: formDataObj.drive,
        fuel_type: formDataObj.fuel_type,
        transmission: formDataObj.transmission,
        kph: Number(formDataObj.kph),
        mileage: Number(formDataObj.mileage),
        features: formData.getAll("features"),
        images: validImageUrls,
        link: formDataObj.link,
      };
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
        details:
          process.env.NODE_ENV === "development" ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
};
