import connect from "../../../lib/mongodb/mongoose.js";
import Message from "../../../lib/models/messages.model.js";
import { getSessionUser } from "@/utils/getSessionUser.js";
import { NextResponse } from "next/server";
import { Types } from "mongoose";
import { rateLimit } from "@/utils/rateLimit";

export const dynamic = "force-dynamic";

const limiter = rateLimit({
  interval: 60 * 1000, // 1 minute
  uniqueTokenPerInterval: 500,
});

// GET /api/messages

export async function GET() {
  try {
    await connect();

    const sessionUser = await getSessionUser();
    if (!sessionUser || !sessionUser.isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const messages = await Message.find({})
      .populate("sender", "username email firstName lastName")
      .populate("recipient", "username email firstName lastName")
      .populate("car", "make model price")
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json(messages);
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch messages" },
      { status: 500 }
    );
  }
}

// POST /api/messages

export const POST = async (request) => {
  try {
    // Apply rate limiting
    try {
      await limiter.check(request, 10, "message-send"); // 10 requests per minute
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

    const { name, email, phone, message, recipient, car } =
      await request.json();

    // Validate required fields
    if (!name || !email || !message || !recipient || !car) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Validate phone format if provided
    if (phone) {
      const phoneRegex = /^\+?[\d\s-]{10,}$/;
      if (!phoneRegex.test(phone)) {
        return NextResponse.json(
          { error: "Invalid phone format" },
          { status: 400 }
        );
      }
    }

    if (!Types.ObjectId.isValid(recipient)) {
      return NextResponse.json(
        { error: "Invalid recipient ID" },
        { status: 400 }
      );
    }

    if (!Types.ObjectId.isValid(car)) {
      return NextResponse.json({ error: "Invalid car ID" }, { status: 400 });
    }

    if (sessionUser.id.toString() === recipient) {
      return NextResponse.json(
        { error: "Cannot send message to yourself" },
        { status: 400 }
      );
    }

    if (sessionUser.isAdmin) {
      return NextResponse.json(
        { error: "Admins cannot send messages" },
        { status: 403 }
      );
    }

    const newMessage = new Message({
      sender: sessionUser.id,
      recipient,
      car,
      email,
      phone,
      name,
      body: message,
      readByAdmin: false,
      readByAdminUser: null,
      readAt: null,
    });

    await newMessage.validate(); // Explicit validation
    const savedMessage = await newMessage.save();

    return NextResponse.json({
      message: "Message sent successfully",
      data: savedMessage,
    });
  } catch (error) {
    console.error("Message creation error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to send message" },
      { status: 500 }
    );
  }
};
