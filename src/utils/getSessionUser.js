import { currentUser } from "@clerk/nextjs/server";
import { headers } from "next/headers";
import User from "../lib/models/user.model.js";
import connect from "../lib/mongodb/mongoose.js";

export const getSessionUser = async () => {
  try {
    // Get headers first and await them
    await headers();

    // Then get the current user
    const user = await currentUser();

    if (!user) {
      console.log("No Clerk user found");
      return null;
    }

    // Connect to MongoDB
    await connect();

    // Get the MongoDB user data and convert to plain object
    const userMongoId = await User.findOne({ clerkId: user.id }).lean();

    if (!userMongoId) {
      console.log("No MongoDB user found for Clerk ID:", user.id);
      return null;
    }

    // Create a plain object with only the necessary fields
    const sessionUser = {
      id: userMongoId._id.toString(), // Convert ObjectId to string
      clerkId: user.id,
      isAdmin: userMongoId.isAdmin,
      email: user.emailAddresses[0]?.emailAddress,
      username: user.username || userMongoId.username,
    };

    return sessionUser;
  } catch (error) {
    console.error("Error in getSessionUser:", error);
    return null;
  }
};
