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
      min: [0, "Speed cannot be negative"],
      max: [500, "Speed cannot exceed 500 KPH"],
    },
    carClass: {
      type: String,
      required: true,
      enum: ["Economy", "Luxury", "Sports", "SUV", "Truck", "Van"],
    },
    description: {
      type: String,
      required: true,
      minLength: [10, "Description must be at least 10 characters long"],
      maxLength: [2000, "Description cannot exceed 2000 characters"],
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
      trim: true,
    },
    model: {
      type: String,
      required: true,
      trim: true,
    },
    transmission: {
      type: String,
      required: true,
      enum: ["a", "m"],
    },
    year: {
      type: Number,
      required: true,
      min: [1900, "Year must be after 1900"],
      max: [new Date().getFullYear() + 1, "Year cannot be in the future"],
    },
    price: {
      type: Number,
      required: true,
      min: [0, "Price cannot be negative"],
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    features: [
      {
        type: String,
        trim: true,
      },
    ],
    images: [
      {
        type: String,
        required: true,
        validate: {
          validator: function (v) {
            return /^https?:\/\/.+/.test(v);
          },
          message: "Invalid image URL format",
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Add index for better search performance
CarSchema.index({ make: 1, model: 1, year: -1 });
CarSchema.index({ price: 1 });
CarSchema.index({ isFeatured: 1 });

const Car = models.Car || model("Car", CarSchema);
export default Car;
