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

    const user = await User.findOneAndUpdate(
      { clerkId: id },
      {
        $set: {
          firstName: first_name,
          lastName: last_name,
          profilePicture: image_url,
          email: email_addresses[0].email_address,
          username,
        },
      },
      { new: true, upsert: true }
    );
    return user;
  } catch (error) {
    console.error("Error creating or updating user:", error);
    throw error;
  }
};

export const deleteUser = async (id) => {
  try {
    await connect();
    const result = await User.findOneAndDelete({ clerkId: id });
    return result;
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  }
};
