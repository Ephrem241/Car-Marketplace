import { Schema, model, models } from "mongoose";

const CarSchema = new Schema(
  {
    createdBy: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    kph: {
      type: Number,
      required: true,
    },
    carClass: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    drive: {
      type: String,
      required: true,
      enum: ["FWD", "RWD", "AWD", "4WD"],
    },
    fuel_type: {
      type: String,
      required: true,
      enum: ["Petrol", "Diesel", "Electric", "Hybrid", "Other"],
    },
    make: {
      type: String,
      required: true,
    },
    model: {
      type: String,
      required: true,
    },
    transmission: {
      type: String,
      required: true,
    },
    year: {
      type: Number,
    },
    price: {
      type: Number,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    features: [
      {
        type: String,
      },
    ],
    images: [
      {
        type: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Car = models.Car || model("Car", CarSchema);
export default Car;
