import mongoose from "mongoose";

let initialized = false;

export const connect = async () => {
  mongoose.set("strictQuery", true);
  if (initialized) {
    console.log("Already connected to MongoDB");
    return;
  }
  if (!process.env.MONGODB_URI) {
    console.log("MONGODB_URI is not defined");
    return;
  }
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: "car-marketplace",
    });
    console.log("Connected to MongoDB");
    initialized = true;
  } catch (error) {
    console.log("Error connecting to MongoDB:", error);
    throw error;
  }
};
