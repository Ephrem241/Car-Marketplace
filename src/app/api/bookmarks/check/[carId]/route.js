import { NextResponse } from "next/server";
import User from "../../../../../lib/models/user.model.js";
import connect from "../../../../../lib/mongodb/mongoose.js";
import { getSessionUser } from "@/utils/getSessionUser.js";
import { Types } from "mongoose";

export async function GET(request, { params }) {
  try {
    await connect();

    const { carId } = params;

    if (!carId || !Types.ObjectId.isValid(carId)) {
      return NextResponse.json({ isBookmarked: false }, { status: 400 });
    }

    const sessionUser = await getSessionUser();
    if (!sessionUser) {
      return NextResponse.json({ isBookmarked: false }, { status: 401 });
    }

    const user = await User.findOne({ clerkId: sessionUser.id }).lean();
    if (!user) {
      return NextResponse.json({ isBookmarked: false }, { status: 404 });
    }

    const carObjectId = new Types.ObjectId(carId);
    const isBookmarked = user.bookmarks.some(
      (bookmarkId) => bookmarkId.toString() === carObjectId.toString()
    );

    return NextResponse.json({ isBookmarked });
  } catch (error) {
    console.error("Error checking bookmark:", error);
    return NextResponse.json(
      { error: "Failed to check bookmark status" },
      { status: 500 }
    );
  }
}
