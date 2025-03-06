import { NextResponse } from "next/server";
import connect from "../../../lib/mongodb/mongoose.js";
import User from "../../../lib/models/user.model.js";
import Car from "../../../lib/models/car.model.js";
import { getSessionUser } from "@/utils/getSessionUser.js";
import { Types } from "mongoose";
import Bookmark from "../../../lib/models/bookmark.model.js";

export const dynamic = "force-dynamic";

// POST /api/bookmarks
export async function POST(request) {
  try {
    await connect();
    const sessionUser = await getSessionUser();

    if (!sessionUser) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { carId } = await request.json();

    if (!carId) {
      return NextResponse.json(
        { error: "Car ID is required" },
        { status: 400 }
      );
    }

    const existingBookmark = await Bookmark.findOne({
      userId: sessionUser.id,
      carId,
    });

    if (existingBookmark) {
      return NextResponse.json(
        { error: "Car already bookmarked" },
        { status: 400 }
      );
    }

    const bookmark = new Bookmark({
      userId: sessionUser.id,
      carId,
    });

    await bookmark.save();
    return NextResponse.json(bookmark, { status: 201 });
  } catch (error) {
    console.error("Error creating bookmark:", error);
    return NextResponse.json(
      { error: "Failed to create bookmark" },
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
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const bookmarks = await Bookmark.find({ userId: sessionUser.id })
      .populate("carId")
      .sort({ createdAt: -1 });

    return NextResponse.json(bookmarks);
  } catch (error) {
    console.error("Error fetching bookmarks:", error);
    return NextResponse.json(
      { error: "Failed to fetch bookmarks" },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    await connect();
    const sessionUser = await getSessionUser();

    if (!sessionUser) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { carId } = await request.json();

    if (!carId) {
      return NextResponse.json(
        { error: "Car ID is required" },
        { status: 400 }
      );
    }

    const result = await Bookmark.findOneAndDelete({
      userId: sessionUser.id,
      carId,
    });

    if (!result) {
      return NextResponse.json(
        { error: "Bookmark not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Bookmark removed successfully" });
  } catch (error) {
    console.error("Error removing bookmark:", error);
    return NextResponse.json(
      { error: "Failed to remove bookmark" },
      { status: 500 }
    );
  }
}
