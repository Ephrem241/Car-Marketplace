import connect from "../../../../lib/mongodb/mongoose.js";
import Car from "../../../../lib/models/car.model.js";
import { NextResponse } from "next/server";

// GET /api/cars/search

export const GET = async (request) => {
  try {
    await connect();

    const { searchParams } = new URL(request.url);
    const searchQuery = searchParams.get("q") || "";
    const fuel = searchParams.get("fuel") || "";
    const transmission = searchParams.get("transmission") || "";
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 50;
    const sort = searchParams.get("sort") || "createdAt";
    const order = searchParams.get("order") || "desc";

    const query = {};

    // Add search conditions only if parameters have actual values
    if (searchQuery.trim()) {
      query.$or = [
        { make: { $regex: searchQuery, $options: "i" } },
        { model: { $regex: searchQuery, $options: "i" } },
        { description: { $regex: searchQuery, $options: "i" } },
      ];
    }

    if (fuel.trim()) {
      query.fuel_type = fuel;
    }

    if (transmission.trim()) {
      query.transmission = transmission;
    }

    const sortOptions = {};
    sortOptions[sort] = order === "desc" ? -1 : 1;

    const skip = (page - 1) * limit;

    const cars = await Car.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Car.countDocuments(query);

    // Return both cars and total count
    return NextResponse.json({
      cars,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("Error searching cars:", error);
    return NextResponse.json(
      { error: "Error searching cars" },
      { status: 500 }
    );
  }
};
