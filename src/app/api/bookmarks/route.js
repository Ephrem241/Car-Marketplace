import { NextResponse } from "next/server";
import connect from "../../../lib/mongodb/mongoose.js";
import { getSessionUser } from "@/utils/getSessionUser.js";
import Bookmark from "../../../lib/models/bookmark.model.js";
import { rateLimitMiddleware } from "@/utils/rateLimit";
import { addSecurityHeaders } from "@/utils/apiHeaders";
import User from "../../../lib/models/user.model.js";

export const dynamic = "force-dynamic";

// POST /api/bookmarks
export async function POST(request) {
  try {
    // Apply rate limiting
    const rateLimitResponse = await rateLimitMiddleware(
      request,
      10,
      "bookmark-create"
    );
    if (rateLimitResponse) return rateLimitResponse;

    await connect();
    const sessionUser = await getSessionUser();

    if (!sessionUser) {
      return addSecurityHeaders(
        NextResponse.json({ error: "Not authenticated" }, { status: 401 })
      );
    }

    // Get user from MongoDB to check admin status
    const user = await User.findOne({ clerkId: sessionUser.clerkId }).lean();

    if (!user) {
      return addSecurityHeaders(
        NextResponse.json({ error: "User not found" }, { status: 401 })
      );
    }

    if (user.isAdmin) {
      return addSecurityHeaders(
        NextResponse.json(
          { error: "Bookmarks not available for admin users" },
          { status: 403 }
        )
      );
    }

    const { carId } = await request.json();

    if (!carId) {
      return addSecurityHeaders(
        NextResponse.json({ error: "Car ID is required" }, { status: 400 })
      );
    }

    // Use findOneAndDelete for atomic operation
    const deletedBookmark = await Bookmark.findOneAndDelete({
      userId: sessionUser.clerkId || sessionUser.id,
      carId,
    });

    // If bookmark was found and deleted, return unbookmarked status
    if (deletedBookmark) {
      return addSecurityHeaders(
        NextResponse.json(
          {
            isBookmarked: false,
            message: "Car unbookmarked successfully",
          },
          { status: 200 }
        )
      );
    }

    // If no bookmark was found, create one
    const bookmark = new Bookmark({
      userId: sessionUser.clerkId || sessionUser.id,
      carId,
    });

    await bookmark.save();
    return addSecurityHeaders(
      NextResponse.json(
        {
          isBookmarked: true,
          message: "Car bookmarked successfully",
        },
        { status: 201 }
      )
    );
  } catch (error) {
    console.error("Error managing bookmark:", error);
    return addSecurityHeaders(
      NextResponse.json({ error: "Failed to manage bookmark" }, { status: 500 })
    );
  }
}

// GET /api/bookmarks
export async function GET(request) {
  try {
    // Apply rate limiting
    const rateLimitResponse = await rateLimitMiddleware(
      request,
      20,
      "bookmark-list"
    );
    if (rateLimitResponse) return rateLimitResponse;

    await connect();
    const sessionUser = await getSessionUser();

    if (!sessionUser) {
      return addSecurityHeaders(
        NextResponse.json({ error: "Not authenticated" }, { status: 401 })
      );
    }

    // Get user from MongoDB to check admin status
    const user = await User.findOne({ clerkId: sessionUser.clerkId }).lean();

    if (!user) {
      return addSecurityHeaders(
        NextResponse.json({ error: "User not found" }, { status: 401 })
      );
    }

    if (user.isAdmin) {
      return addSecurityHeaders(
        NextResponse.json(
          { error: "Bookmarks not available for admin users" },
          { status: 403 }
        )
      );
    }

    // Find bookmarks and populate car data
    const bookmarks = await Bookmark.find({
      userId: sessionUser.clerkId || sessionUser.id,
    })
      .populate({
        path: "carId",
        select:
          "make model year price fuel_type transmission carClass mileage images description createdAt",
      })
      .sort({ createdAt: -1 })
      .lean();

    // Filter out any bookmarks where car data couldn't be populated
    const validBookmarks = bookmarks.filter((bookmark) => bookmark.carId);

    if (bookmarks.length > 0 && validBookmarks.length === 0) {
      console.error("No valid bookmarks found with populated car data");
      return addSecurityHeaders(
        NextResponse.json({ error: "Failed to load car data" }, { status: 500 })
      );
    }

    return addSecurityHeaders(NextResponse.json(validBookmarks));
  } catch (error) {
    console.error("Error fetching bookmarks:", error);
    return addSecurityHeaders(
      NextResponse.json({ error: "Failed to fetch bookmarks" }, { status: 500 })
    );
  }
}

export async function DELETE(request) {
  try {
    // Apply rate limiting
    const rateLimitResponse = await rateLimitMiddleware(
      request,
      10,
      "bookmark-delete"
    );
    if (rateLimitResponse) return rateLimitResponse;

    await connect();
    const sessionUser = await getSessionUser();

    if (!sessionUser) {
      return addSecurityHeaders(
        NextResponse.json({ error: "Not authenticated" }, { status: 401 })
      );
    }

    // Get user from MongoDB to check admin status
    const user = await User.findOne({ clerkId: sessionUser.clerkId }).lean();

    if (!user) {
      return addSecurityHeaders(
        NextResponse.json({ error: "User not found" }, { status: 401 })
      );
    }

    if (user.isAdmin) {
      return addSecurityHeaders(
        NextResponse.json(
          { error: "Bookmarks not available for admin users" },
          { status: 403 }
        )
      );
    }

    const { carId } = await request.json();

    if (!carId) {
      return addSecurityHeaders(
        NextResponse.json({ error: "Car ID is required" }, { status: 400 })
      );
    }

    const result = await Bookmark.findOneAndDelete({
      userId: sessionUser.clerkId || sessionUser.id,
      carId,
    });

    if (!result) {
      return addSecurityHeaders(
        NextResponse.json({ error: "Bookmark not found" }, { status: 404 })
      );
    }

    return addSecurityHeaders(
      NextResponse.json({ message: "Bookmark removed successfully" })
    );
  } catch (error) {
    console.error("Error removing bookmark:", error);
    return addSecurityHeaders(
      NextResponse.json({ error: "Failed to remove bookmark" }, { status: 500 })
    );
  }
}
