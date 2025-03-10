import connect from "../../../../lib/mongodb/mongoose.js";
import Car from "../../../../lib/models/car.model.js";
import { NextResponse } from "next/server";

// Simple in-memory rate limiting
const REQUESTS_PER_MINUTE = 60;
const requestCounts = new Map();

function isRateLimited(ip) {
  const now = Date.now();
  const minute = Math.floor(now / 60000);
  const key = `${ip}-${minute}`;

  const count = requestCounts.get(key) || 0;
  if (count >= REQUESTS_PER_MINUTE) {
    return true;
  }

  requestCounts.set(key, count + 1);
  return false;
}

// Validate search parameters
function validateSearchParams(params) {
  const errors = [];

  // Validate price range
  const minPrice = parseInt(params.get("minPrice"));
  const maxPrice = parseInt(params.get("maxPrice"));
  if (minPrice && maxPrice && minPrice > maxPrice) {
    errors.push("Invalid price range");
  }

  // Validate year range
  const minYear = parseInt(params.get("minYear"));
  const maxYear = parseInt(params.get("maxYear"));
  const currentYear = new Date().getFullYear();
  if (minYear && maxYear && minYear > maxYear) {
    errors.push("Invalid year range");
  }
  if ((minYear && minYear < 1900) || minYear > currentYear + 1) {
    errors.push("Invalid minimum year");
  }
  if ((maxYear && maxYear < 1900) || maxYear > currentYear + 1) {
    errors.push("Invalid maximum year");
  }

  // Validate sort parameters
  const validSortFields = ["createdAt", "price", "year", "relevance"];
  const sort = params.get("sort");
  if (sort && !validSortFields.includes(sort)) {
    errors.push("Invalid sort field");
  }

  const validOrders = ["asc", "desc"];
  const order = params.get("order");
  if (order && !validOrders.includes(order)) {
    errors.push("Invalid sort order");
  }

  return errors;
}

// GET /api/cars/search

export const GET = async (request) => {
  try {
    // Rate limiting
    const ip = request.headers.get("x-forwarded-for") || "127.0.0.1";
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }

    const { searchParams } = new URL(request.url);

    // Validate parameters
    const validationErrors = validateSearchParams(searchParams);
    if (validationErrors.length > 0) {
      return NextResponse.json(
        { error: "Invalid parameters", details: validationErrors },
        { status: 400 }
      );
    }

    await connect();

    const searchQuery = searchParams.get("q") || "";
    const fuel = searchParams.get("fuel") || "";
    const transmission = searchParams.get("transmission") || "";
    const carClass = searchParams.get("class") || "";
    const minPrice = parseInt(searchParams.get("minPrice")) || 0;
    const maxPrice =
      parseInt(searchParams.get("maxPrice")) || Number.MAX_SAFE_INTEGER;
    const minYear = parseInt(searchParams.get("minYear")) || 1900;
    const maxYear =
      parseInt(searchParams.get("maxYear")) || new Date().getFullYear() + 1;
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 24;
    const sort = searchParams.get("sort") || "createdAt";
    const order = searchParams.get("order") || "desc";

    const query = {
      price: { $gte: minPrice, $lte: maxPrice },
      year: { $gte: minYear, $lte: maxYear },
    };

    // Add search conditions only if parameters have actual values
    if (searchQuery.trim()) {
      // Create an array of search conditions with different weights
      query.$or = [
        // Exact matches (highest priority)
        { make: { $regex: `^${searchQuery}$`, $options: "i" } },
        { model: { $regex: `^${searchQuery}$`, $options: "i" } },

        // Starts with (high priority)
        { make: { $regex: `^${searchQuery}`, $options: "i" } },
        { model: { $regex: `^${searchQuery}`, $options: "i" } },

        // Contains (medium priority)
        { make: { $regex: searchQuery, $options: "i" } },
        { model: { $regex: searchQuery, $options: "i" } },

        // Description (lowest priority)
        { description: { $regex: searchQuery, $options: "i" } },
      ];
    }

    if (fuel.trim()) {
      query.fuel_type = fuel;
    }

    if (transmission.trim()) {
      query.transmission = transmission;
    }

    if (carClass.trim()) {
      query.carClass = carClass;
    }

    const sortOptions = {};
    // Handle special sort cases
    if (sort === "relevance" && searchQuery.trim()) {
      // When sorting by relevance, we'll use the order of our $or conditions
      sortOptions.score = { $meta: "textScore" };
    } else {
      sortOptions[sort] = order === "desc" ? -1 : 1;
    }

    const skip = (page - 1) * limit;

    // Select specific fields to return
    const projection = {
      make: 1,
      model: 1,
      year: 1,
      price: 1,
      fuel_type: 1,
      transmission: 1,
      carClass: 1,
      mileage: 1,
      images: { $slice: 1 }, // Only return the first image
      description: 1,
      createdAt: 1,
    };

    const cars = await Car.find(query)
      .select(projection)
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
      filters: {
        minPrice,
        maxPrice,
        minYear,
        maxYear,
        fuel,
        transmission,
        carClass,
      },
    });
  } catch (error) {
    console.error("Error searching cars:", error);
    return NextResponse.json(
      { error: "Error searching cars" },
      { status: 500 }
    );
  }
};
