import { NextResponse } from "next/server";
import connect from "../../../lib/mongodb/mongoose.js";
import User from "../../../lib/models/user.model.js";
import Car from "../../../lib/models/car.model.js";
import { getSessionUser } from "@/utils/getSessionUser.js";
import { Types } from "mongoose";

export const dynamic = "force-dynamic";

// POST /api/bookmarks
export async function POST(request) {
  try {
    await connect();

    const { carId } = await request.json();

    // Validate carId format
    if (!Types.ObjectId.isValid(carId)) {
      return NextResponse.json(
        { error: "Invalid car ID format" },
        { status: 400 }
      );
    }

    const sessionUser = await getSessionUser();

    if (!sessionUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Add check for admin role
    if (sessionUser.role === "admin") {
      return NextResponse.json(
        { error: "Admins cannot bookmark cars" },
        { status: 403 }
      );
    }

    // Find user by clerkId instead of userId
    const user = await User.findOne({ clerkId: sessionUser.id });

    if (!user) {
      // Create new user with all required fields from session
      const fallbackUsername = sessionUser.email
        ? sessionUser.email.split("@")[0]
        : sessionUser.id;

      const newUser = new User({
        clerkId: sessionUser.id,
        email: sessionUser.email,
        firstName: sessionUser.firstName,
        lastName: sessionUser.lastName,
        username: sessionUser.username || fallbackUsername,
        bookmarks: [carId],
      });
      await newUser.save();
      return NextResponse.json({
        success: true,
        isBookmarked: true,
        message: "User created and car bookmarked",
      });
    }

    // Check if car exists
    const car = await Car.findById(carId);
    if (!car) {
      return NextResponse.json({ error: "Car not found" }, { status: 404 });
    }

    // Convert carId to ObjectId for comparison
    const carObjectId = new Types.ObjectId(carId);

    // Check if car is already bookmarked
    const isBookmarked = user.bookmarks.some((id) => id.equals(carObjectId));

    // Update bookmarks using findOneAndUpdate
    const updateOperation = isBookmarked
      ? { $pull: { bookmarks: carObjectId } }
      : { $push: { bookmarks: carObjectId } };

    await User.findOneAndUpdate({ clerkId: sessionUser.id }, updateOperation, {
      runValidators: false,
    });

    return NextResponse.json({
      success: true,
      isBookmarked: !isBookmarked,
      message: isBookmarked ? "Bookmark removed" : "Car bookmarked",
    });
  } catch (error) {
    console.error("Bookmark error:", error.message);
    return NextResponse.json(
      {
        error: "Something went wrong",
        details: error.message,
      },
      { status: 500 }
    );
  }
}

// GET /api/bookmarks
export async function GET(request) {
  try {
    await connect();

    const sessionUser = await getSessionUser();

    if (!sessionUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await User.findOne({ clerkId: sessionUser.id });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const searchParams = request.nextUrl.searchParams;
    const page = Math.max(1, parseInt(searchParams.get("page")) || 1); // Ensure minimum of 1
    const limit = Math.min(
      Math.max(1, parseInt(searchParams.get("limit")) || 10),
      50
    ); // Between 1 and 50
    const skip = (page - 1) * limit;

    const bookmarkedCars = await Car.find({
      _id: { $in: user.bookmarks },
    })
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Car.countDocuments({
      _id: { $in: user.bookmarks },
    });

    return NextResponse.json({
      cars: bookmarkedCars,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("GET bookmarks error:", error);
    return NextResponse.json(
      {
        error: "Something went wrong",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
