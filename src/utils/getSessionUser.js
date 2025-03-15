import { currentUser } from "@clerk/nextjs/server";
import { headers } from "next/headers";
import User from "../lib/models/user.model.js";
import connect from "../lib/mongodb/mongoose.js";

export async function getSessionUser() {
  try {
    // Get headers first and await them
    const headersList = await headers();

    // Then get the current user
    const user = await currentUser();

    if (!user) {
      console.log("No Clerk user found");
      return null;
    }

    // Connect to MongoDB
    await connect();

    // Get the MongoDB user data and convert to plain object
    const mongoUser = await User.findOne({ clerkId: user.id }).lean();

    if (!mongoUser) {
      console.log("No MongoDB user found for Clerk ID:", user.id);
      return null;
    }

    // Create a session user with data from both Clerk and MongoDB
    return {
      id: mongoUser._id.toString(),
      clerkId: user.id,
      email: user.emailAddresses[0]?.emailAddress,
      username: mongoUser.username,
      firstName: mongoUser.firstName,
      lastName: mongoUser.lastName,
      isAdmin: mongoUser.isAdmin,
      profilePicture: mongoUser.profilePicture,
    };
  } catch (error) {
    console.error("Error in getSessionUser:", error);
    return null;
  }
}
