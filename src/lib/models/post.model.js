import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    make: {
      type: String,
      required: true,
    },
    model: {
      type: String,
      required: true,
    },
    year: {
      type: Number,
      required: true,
    },
    mileage: {
      type: Number,
      required: true,
    },
    catagory: {
      type: String,
      default: "uncategorized",
    },
    transmission: {
      type: String,
      enum: ["Manual", "Automatic"],
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    features: {
      type: [String],
      enum: [
        "Air Conditioning",
        "GPS",
        "Leather Seats",
        "Heated Seats",
        "Sunroof",
        "Backup Camera",
      ],
      default: [],
    },
    images: {
      type: [String], // URLs of uploaded images
      validate: [arrayLimit, "{PATH} exceeds the limit of 4 images"],
    },
    slug: {
      type: String,
      unique: true,
      required: true,
    },
  },
  { timestamps: true }
);

// Custom validator to limit the number of images
function arrayLimit(val) {
  return val.length <= 4;
}

const Post = mongoose.models.Post || mongoose.model("Post", postSchema);
export default Post;
