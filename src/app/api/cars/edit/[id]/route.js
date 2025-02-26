import connect from "../../../../../lib/mongodb/mongoose.js";
import { currentUser } from "@clerk/nextjs/server";
import Car from "../../../../../lib/models/car.model.js";
import { NextResponse } from "next/server";

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
