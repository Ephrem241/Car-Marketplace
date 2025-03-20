import User from "../models/user.model.js";
import connect from "../mongodb/mongoose.js";

export const createOrUpdateUser = async (
  id,
  first_name,
  last_name,
  image_url,
  email_addresses,
  username
) => {
  try {
    await connect();
    console.log("Creating/updating user:", {
      id,
      first_name,
      last_name,
      email: email_addresses[0]?.email_address,
      username,
    });

    // Check if user already exists
    const existingUser = await User.findOne({ clerkId: id });
    console.log("Existing user:", existingUser);

    // Check if this is the first user in the system
    const totalUsers = await User.countDocuments();
    const isFirstUser = totalUsers === 0;

    const userData = {
      clerkId: id,
      firstName: first_name,
      lastName: last_name,
      profilePicture: image_url,
      email: email_addresses[0]?.email_address,
      username:
        username || `${first_name.toLowerCase()}-${last_name.toLowerCase()}`,
      isAdmin: existingUser?.isAdmin || isFirstUser,
    };

    console.log("Creating/updating user with data:", {
      ...userData,
      isFirstUser,
      totalUsers,
    });

    const user = await User.findOneAndUpdate(
      { clerkId: id },
      { $set: userData },
      { new: true, upsert: true }
    );

    console.log("User created/updated:", user);
    return user;
  } catch (error) {
    console.error("Error creating or updating user:", error);
    throw error;
  }
};

export const deleteUser = async (id) => {
  try {
    await connect();
    console.log("Deleting user:", id);
    const result = await User.findOneAndDelete({ clerkId: id });
    console.log("User deleted:", result);
    return result;
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  }
};
