import { NextResponse } from "next/server";
import connect from "../../../../../lib/mongodb/mongoose.js";
import { getSessionUser } from "@/utils/getSessionUser.js";
import { Types } from "mongoose";
import Bookmark from "../../../../../lib/models/bookmark.model.js";

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

    const bookmark = await Bookmark.findOne({
      userId: sessionUser.id,
      carId: new Types.ObjectId(carId),
    }).lean();

    return NextResponse.json({ isBookmarked: !!bookmark });
  } catch (error) {
    console.error("Error checking bookmark:", error);
    return NextResponse.json(
      { error: "Failed to check bookmark status" },
      { status: 500 }
    );
  }
}
