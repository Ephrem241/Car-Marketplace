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
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please fill a valid email address",
      ],
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
      match: [
        /^[a-zA-Z0-9_-]+$/,
        "Username can only contain letters, numbers, underscores and hyphens",
      ],
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
