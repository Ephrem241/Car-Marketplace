import mongoose from "mongoose";

const bookmarkSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    carId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Car",
      required: true,
    },
  },
  { timestamps: true }
);

// Create compound index to prevent duplicate bookmarks
bookmarkSchema.index({ userId: 1, carId: 1 }, { unique: true });

const Bookmark =
  mongoose.models.Bookmark || mongoose.model("Bookmark", bookmarkSchema);

export default Bookmark;
