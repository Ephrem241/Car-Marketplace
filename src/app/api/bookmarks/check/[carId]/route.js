import { NextResponse } from "next/server";
import connect from "../../../../../lib/mongodb/mongoose.js";
import { getSessionUser } from "@/utils/getSessionUser.js";
import { Types } from "mongoose";
import Bookmark from "../../../../../lib/models/bookmark.model.js";
import { addSecurityHeaders } from "@/utils/apiHeaders";
import { rateLimitMiddleware } from "@/utils/rateLimit";

export async function GET(request, { params }) {
  try {
    // Apply rate limiting
    const rateLimitResponse = await rateLimitMiddleware(
      request,
      20,
      "bookmark-check"
    );
    if (rateLimitResponse) return rateLimitResponse;

    await connect();

    const { carId } = params;

    if (!carId || !Types.ObjectId.isValid(carId)) {
      return addSecurityHeaders(
        NextResponse.json({ isBookmarked: false }, { status: 400 })
      );
    }

    const sessionUser = await getSessionUser();
    if (!sessionUser) {
      return addSecurityHeaders(
        NextResponse.json({ isBookmarked: false }, { status: 401 })
      );
    }

    const bookmark = await Bookmark.findOne({
      userId: sessionUser.id,
      carId: new Types.ObjectId(carId),
    }).lean();

    return addSecurityHeaders(NextResponse.json({ isBookmarked: !!bookmark }));
  } catch (error) {
    console.error("Error checking bookmark:", error);
    return addSecurityHeaders(
      NextResponse.json(
        { error: "Failed to check bookmark status" },
        { status: 500 }
      )
    );
  }
}
