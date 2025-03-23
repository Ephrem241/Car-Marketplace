import { NextResponse } from "next/server";
import connect from "../../../../../lib/mongodb/mongoose.js";
import { getSessionUser } from "@/utils/getSessionUser.js";
import { Types } from "mongoose";
import Bookmark from "../../../../../lib/models/bookmark.model.js";
import { addSecurityHeaders } from "@/utils/apiHeaders";
import { rateLimitMiddleware } from "@/utils/rateLimit";

// Add timeout promise
const timeoutPromise = (ms) =>
  new Promise((_, reject) =>
    setTimeout(() => reject(new Error("Request timeout")), ms)
  );

export async function GET(request, { params }) {
  try {
    // Set 5 second timeout
    const timeout = 5000;

    // Race between the actual operation and timeout
    const result = await Promise.race([
      (async () => {
        // Apply rate limiting
        const rateLimitResponse = await rateLimitMiddleware(
          request,
          20,
          "bookmark-check"
        );
        if (rateLimitResponse) return rateLimitResponse;

        // Connect to DB with timeout
        await connect();

        const { carId } = params;

        if (!carId || !Types.ObjectId.isValid(carId)) {
          return addSecurityHeaders(
            NextResponse.json(
              {
                error: "Invalid car ID format",
                isBookmarked: false,
              },
              { status: 400 }
            )
          );
        }

        const sessionUser = await getSessionUser();
        if (!sessionUser) {
          return addSecurityHeaders(
            NextResponse.json(
              {
                error: "Authentication required",
                isBookmarked: false,
              },
              { status: 401 }
            )
          );
        }

        // Add admin check
        if (sessionUser.publicMetadata?.isAdmin) {
          return addSecurityHeaders(
            NextResponse.json(
              {
                error: "Admins are not allowed to bookmark cars",
                isBookmarked: false,
              },
              { status: 403 }
            )
          );
        }

        // Optimize query with projection and lean
        const bookmark = await Bookmark.findOne(
          {
            userId: sessionUser.clerkId || sessionUser.id,
            carId: new Types.ObjectId(carId),
          },
          { _id: 1 }, // Only fetch _id field
          {
            lean: true,
            maxTimeMS: 3000,
            // Add cache options here
          }
        );

        return addSecurityHeaders(
          NextResponse.json({
            isBookmarked: !!bookmark,
            message: bookmark ? "Car is bookmarked" : "Car is not bookmarked",
          })
        );
      })(),
      timeoutPromise(timeout),
    ]);

    return result;
  } catch (error) {
    console.error("Error checking bookmark:", error);

    // Return specific error for timeout
    if (error.message === "Request timeout") {
      return addSecurityHeaders(
        NextResponse.json({ error: "Request timed out" }, { status: 408 })
      );
    }

    return addSecurityHeaders(
      NextResponse.json(
        { error: "Failed to check bookmark status" },
        { status: 500 }
      )
    );
  }
}
