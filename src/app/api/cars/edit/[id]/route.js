import connect from "../../../../../lib/mongodb/mongoose.js";
import { currentUser } from "@clerk/nextjs/server";
import Car from "../../../../../lib/models/car.model.js";
import { NextResponse } from "next/server";
import rateLimit from "express-rate-limit";

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});

export async function PUT(request, { params }) {
  const user = await currentUser();

  try {
    await connect();

    const data = await request.json();

    // Enhanced admin check
    if (!user?.publicMetadata?.isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Validation improved
    const requiredFields = ["make", "model", "year", "price", "kph"];
    const missingFields = requiredFields.filter((field) => !data[field]);
    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing fields: ${missingFields.join(", ")}` },
        { status: 400 }
      );
    }

    // Numeric validation with type conversion
    const numericFields = ["year", "price", "kph"];
    for (const field of numericFields) {
      const value = Number(data[field]);
      if (isNaN(value) || value < 0) {
        return NextResponse.json(
          { error: `${field} must be a valid positive number` },
          { status: 400 }
        );
      }
      data[field] = value;
    }

    // Enhanced image validation
    if (data.images && data.images.some((url) => !/^https?:\/\//i.test(url))) {
      return NextResponse.json(
        { error: "Invalid image URL format" },
        { status: 400 }
      );
    }

    // Validate image count
    if (data.images && data.images.length > 4) {
      return NextResponse.json(
        { error: "Maximum of 4 images allowed" },
        { status: 400 }
      );
    }

    // Field whitelisting
    const validFields = [
      "make",
      "model",
      "year",
      "price",
      "kph",
      "carClass",
      "drive",
      "fuel_type",
      "transmission",
      "features",
      "images",
      "description",
    ];

    const sanitizedData = Object.keys(data).reduce((acc, key) => {
      if (validFields.includes(key)) acc[key] = data[key];
      return acc;
    }, {});

    const updatedCar = await Car.findByIdAndUpdate(params.id, data, {
      new: true,
      runValidators: true,
    });

    if (!updatedCar) {
      return NextResponse.json({ error: "Car not found" }, { status: 404 });
    }

    return NextResponse.json(updatedCar);
  } catch (error) {
    console.error("Update error:", error);
    return NextResponse.json(
      { error: error.message || "Server error" },
      { status: 500 }
    );
  }
}

// Add client-side image size and format validation
const validateImage = (file) => {
  const maxSize = 5 * 1024 * 1024; // 5MB
  if (file.size > maxSize) {
    throw new Error("Image size must be less than 5MB");
  }
};

// Add form reset after successful submission
const resetForm = () => {
  setFields({
    kph: "",
    carClass: "",
    // ... other fields
  });
  setFiles([]);
};
