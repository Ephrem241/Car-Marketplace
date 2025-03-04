import connect from "../../../lib/mongodb/mongoose.js";
import Message from "../../../lib/models/messages.model.js";
import { getSessionUser } from "@/utils/getSessionUser.js";
import { NextResponse } from "next/server";
import { Mongoose } from "mongoose";

export const dynamic = "force-dynamic";

// GET /api/messages

export async function GET() {
  try {
    await connect();

    const messages = await Message.find({})
      .populate("sender", "username email firstName lastName")
      .populate("recipient", "username email firstName lastName")
      .populate("car", "title price")
      .sort({ createdAt: -1 })
      .lean();

    console.log("API: Found messages:", messages.length);

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
    await connect();

    const sessionUser = await getSessionUser();

    // Add debug logging

    if (!sessionUser) {
      return new Response("Unauthorized", { status: 401 });
    }

    const { name, email, phone, message, recipient, car } =
      await request.json();

    if (!recipient) {
      return NextResponse.json(
        { error: "Recipient is required" },
        { status: 400 }
      );
    }

    // Make sure recipient is a valid MongoDB ObjectId
    if (!Mongoose.Types.ObjectId.isValid(recipient)) {
      return NextResponse.json(
        { error: "Invalid recipient ID" },
        { status: 400 }
      );
    }

    // Use MongoDB ID
    if (sessionUser.id.toString() === recipient) {
      return new Response("Can not send message to yourself", { status: 400 });
    }

    // Check if user is admin
    if (sessionUser.isAdmin) {
      return new Response("Admins cannot send messages", { status: 403 });
    }

    const newMessage = new Message({
      sender: sessionUser.id,
      recipient,
      car,
      email,
      phone,
      name,
      body: message,
      readByAdmin: false, // Make sure this is set
      readByAdminUser: null,
      readAt: null,
    });

    const savedMessage = await newMessage.save();
    // Debug logging

    return NextResponse.json({
      message: "Message sent successfully",
      data: savedMessage,
    });
  } catch (error) {
    console.error("Message creation error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
};
