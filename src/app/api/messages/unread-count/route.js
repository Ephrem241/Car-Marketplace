import connect from "../../../../lib/mongodb/mongoose.js";
import Message from "../../../../lib/models/messages.model.js";
import { getSessionUser } from "../../../../utils/getSessionUser.js";
import { NextResponse } from "next/server";
import User from "../../../../lib/models/user.model.js";
import { RateLimiter } from "@/utils/rateLimit";

export const dynamic = "force-dynamic";

const limiter = new RateLimiter(60 * 1000, 100); // 100 requests per minute

export const GET = async (request) => {
  try {
    // Apply rate limiting
    try {
      await limiter.check(request, 10, "unread-count");
    } catch {
      return NextResponse.json(
        { error: "Rate limit exceeded" },
        { status: 429 }
      );
    }

    await connect();
    const sessionUser = await getSessionUser();

    if (!sessionUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user from MongoDB to check admin status
    const user = await User.findOne({ clerkId: sessionUser.clerkId }).lean();

    if (!user?.isAdmin) {
      return NextResponse.json({ error: "Not authorized" }, { status: 401 });
    }

    const count = await Message.countDocuments({
      readByAdmin: false,
    });

    return NextResponse.json(count);
  } catch (error) {
    console.error("Error in unread-count:", error);
    return NextResponse.json(
      { error: "Error fetching unread count" },
      { status: 500 }
    );
  }
};
