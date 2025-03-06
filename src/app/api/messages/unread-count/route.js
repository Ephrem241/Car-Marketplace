import connect from "../../../../lib/mongodb/mongoose.js";
import Message from "../../../../lib/models/messages.model.js";
import { getSessionUser } from "../../../../utils/getSessionUser.js";
import { NextResponse } from "next/server";
import User from "../../../../lib/models/user.model.js";

export const dynamic = "force-dynamic";

export const GET = async (request) => {
  try {
    await connect();
    const sessionUser = await getSessionUser();

    if (!sessionUser || !sessionUser.isAdmin) {
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
