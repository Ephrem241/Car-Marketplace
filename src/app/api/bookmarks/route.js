import { NextResponse } from "next/server";
import connect from "../../../lib/mongodb/mongoose.js";
import { getSessionUser } from "@/utils/getSessionUser.js";
import Bookmark from "../../../lib/models/bookmark.model.js";
import { rateLimitMiddleware } from "@/utils/rateLimit";
import { addSecurityHeaders } from "@/utils/apiHeaders";

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

    // Check if user is admin
    if (sessionUser.isAdmin) {
      return addSecurityHeaders(
        NextResponse.json(
          { error: "Admins cannot bookmark cars" },
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

    const existingBookmark = await Bookmark.findOne({
      userId: sessionUser.id,
      carId,
    });

    if (existingBookmark) {
      return addSecurityHeaders(
        NextResponse.json({ error: "Car already bookmarked" }, { status: 400 })
      );
    }

    const bookmark = new Bookmark({
      userId: sessionUser.id,
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
    console.error("Error creating bookmark:", error);
    return addSecurityHeaders(
      NextResponse.json({ error: "Failed to create bookmark" }, { status: 500 })
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

    // Check if user is admin
    if (sessionUser.isAdmin) {
      return addSecurityHeaders(
        NextResponse.json(
          { error: "Admins cannot view bookmarks" },
          { status: 403 }
        )
      );
    }

    const bookmarks = await Bookmark.find({ userId: sessionUser.id })
      .populate("carId")
      .sort({ createdAt: -1 });

    return addSecurityHeaders(NextResponse.json(bookmarks));
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
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // Check if user is admin
    if (sessionUser.isAdmin) {
      return NextResponse.json(
        { error: "Admins cannot delete bookmarks" },
        { status: 403 }
      );
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
