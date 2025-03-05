import connect from "../../../lib/mongodb/mongoose.js";
import Car from "../../../lib/models/car.model.js";

import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q");
    const fuel = searchParams.get("fuel");
    const transmission = searchParams.get("transmission");

    await connect();

    const cars = await Car.find({
      is_featured: true,
    });

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

    if (cars) {
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
