import { Schema, model, models } from "mongoose";

const UserSchema = new Schema(
  {
    clerkId: {
      type: String,
      required: true,
      unique: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
      minlength: [3, "Username must be at least 3 characters long"],
      maxlength: [30, "Username cannot exceed 30 characters"],
    },

    profilePicture: {
      type: String,
      required: false,
    },

    isAdmin: {
      type: Boolean,
      default: false,
    },
    bookmarks: [
      {
        type: Schema.Types.ObjectId,
        ref: "Car",
      },
    ],
  },
  { timestamps: true }
);

const User = models.User || model("User", UserSchema);
export default User;
