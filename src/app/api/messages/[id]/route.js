import connect from "../../../../lib/mongodb/mongoose.js";
import Message from "../../../../lib/models/messages.model.js";
import { getSessionUser } from "../../../../utils/getSessionUser.js";
import { NextResponse } from "next/server";

// PUT /api/messages/[id]
export const PUT = async (request, { params }) => {
  try {
    await connect();
    const sessionUser = await getSessionUser();

    if (!sessionUser) {
      return new Response("Unauthorized", { status: 401 });
    }

    const { id } = params;
    const { readByAdmin } = await request.json();

    const message = await Message.findById(id);
    if (!message) {
      return new Response("Message not found", { status: 404 });
    }

    if (sessionUser.isAdmin) {
      message.readByAdmin = readByAdmin;
      message.readByAdminUser = sessionUser.id;
      message.readAt = new Date();
      await message.save();
      return NextResponse.json({ readByAdmin });
    }

    return new Response("Unauthorized", { status: 403 });
  } catch (error) {
    console.error("Error updating message:", error);
    return new Response("Something went wrong", { status: 500 });
  }
};

// DELETE /api/messages/[id]
export const DELETE = async (request, { params }) => {
  try {
    await connect();
    const sessionUser = await getSessionUser();

    if (!sessionUser) {
      return new Response("Unauthorized", { status: 401 });
    }

    const { id } = params;
    const message = await Message.findById(id);
    if (!message) {
      return new Response("Message not found", { status: 404 });
    }

    // Allow the sender or an admin to delete the message
    if (sessionUser.isAdmin || message.sender.toString() === sessionUser.id) {
      await Message.findByIdAndDelete(id);
      return new Response("Message deleted successfully", {
        status: 200,
        headers: {
          "Cache-Control": "no-cache",
        },
      });
    }

    return new Response("Unauthorized", { status: 403 });
  } catch (error) {
    console.error("Error deleting message:", error);
    return new Response("Something went wrong", { status: 500 });
  }
};
