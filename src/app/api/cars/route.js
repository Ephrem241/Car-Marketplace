import connect from "../../../lib/mongodb/mongoose.js";
import Car from "../../../lib/models/car.model.js";
import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { rateLimitMiddleware } from "@/utils/rateLimit";
import { validateCarData } from "@/utils/validation";

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
    if (fuel?.trim()) query.fuel_type = fuel.trim();
    if (transmission?.trim()) query.transmission = transmission.trim();

    const [total, cars] = await Promise.all([
      Car.countDocuments(query),
      Car.find(query).sort({ createdAt: -1 }).skip(skip).limit(pageSize).lean(),
    ]);

    return NextResponse.json(
      { total, cars, page, pageSize, totalPages: Math.ceil(total / pageSize) },
      {
        status: 200,
        headers: {
          "Cache-Control": "public, max-age=60, stale-while-revalidate=30",
        },
      }
    );
  } catch (error) {
    console.error("Error fetching cars:", error);
    return NextResponse.json(
      { error: "Failed to fetch cars" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const rateLimitResponse = await rateLimitMiddleware(
      request,
      10,
      "car-create"
    );
    if (rateLimitResponse) return rateLimitResponse;

    // Check content length
    const contentLength = request.headers.get("content-length");
    if (contentLength && parseInt(contentLength) > 100000) {
      return NextResponse.json({ error: "Payload too large" }, { status: 413 });
    }

    await connect();

    const { userId } = auth();
    const user = await currentUser();
    if (!userId || !user?.publicMetadata?.isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (!user?.publicMetadata?.userMongoId) {
      return NextResponse.json(
        { error: "User identity configuration error" },
        { status: 500 }
      );
    }

    // Check content type
    const contentType = request.headers.get("content-type");
    if (!contentType?.includes("application/json")) {
      return NextResponse.json(
        { error: "Invalid content type - only JSON accepted" },
        { status: 415 }
      );
    }

    const jsonData = await request.json();
    const validation = validateCarData(jsonData);
    if (!validation.isValid) {
      return NextResponse.json(
        { error: "Validation failed", details: validation.errors },
        { status: 400 }
      );
    }

    const sanitizeString = (str) => str.replace(/[<>$]/g, "");
    const sanitizedData = Object.fromEntries(
      Object.entries(jsonData).map(([key, value]) => [
        key,
        typeof value === "string" ? sanitizeString(value) : value,
      ])
    );

    if (jsonData.images && jsonData.images.length > 0) {
      sanitizedData.images = jsonData.images;
    }

    const newCar = new Car({
      ...sanitizedData,
      createdBy: user.publicMetadata.userMongoId,
    });
    await newCar.save();

    return NextResponse.json(
      { message: "Car Added Successfully", _id: newCar._id },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error adding car:", error);
    return NextResponse.json({ error: "Failed to add car" }, { status: 500 });
  }
}
