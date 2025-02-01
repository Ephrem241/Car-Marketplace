import { Schema, model, models } from "mongoose";
const postSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    kph: { type: Number, required: true },
    class: { type: String, required: true },
    description: { type: String, required: true },
    drive: { type: String, required: true },
    fuel_type: { type: String, required: true },
    make: { type: String, required: true },
    model: { type: String, required: true },
    transmission: { type: String, required: true },
    year: { type: Number, required: true },
    price: { type: Number, required: true },
    isFeatured: { type: Boolean, default: false },
    features: { type: [String], required: true },
    images: { type: [String], required: true },
  },

  {
    timestamps: true,
  }
);

const Post = models.Post || model("Post", postSchema);
export default Post;
