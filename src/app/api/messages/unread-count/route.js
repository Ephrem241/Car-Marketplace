import connect from "../../../../lib/mongodb/mongoose.js";
import Message from "../../../../lib/models/messages.model.js";
import { getSessionUser } from "@/utils/getSessionUser.js";
import { NextResponse } from "next/server";
import { headers } from "next/headers";

export const dynamic = "force-dynamic";

export const GET = async (request) => {
  headers();

  try {
    await connect();
    const sessionUser = await getSessionUser();

    if (!sessionUser) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    if (!sessionUser.isAdmin) {
      return NextResponse.json({ error: "Not an admin" }, { status: 401 });
    }

    const count = await Message.countDocuments({
      readByAdmin: false,
    });

    return NextResponse.json(count);
  } catch (error) {
    return NextResponse.json(
      { error: "Error fetching unread count" },
      { status: 500 }
    );
  }
};
