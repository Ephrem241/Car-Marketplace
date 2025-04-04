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

    const user = await User.findOne({ clerkId: sessionUser.clerkId }).lean();

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const query = user.isAdmin
      ? { readByAdmin: false }
      : { recipient: user._id, readByAdmin: false };

    const count = await Message.countDocuments(query);

    return NextResponse.json(count);
  } catch (error) {
    console.error("Error in unread-count:", error);
    return NextResponse.json(
      { error: "Error fetching unread count" },
      { status: 500 }
    );
  }
};
