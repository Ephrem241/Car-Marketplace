import mongoose from "mongoose";

let initialized = false;

const connect = async () => {
  mongoose.set("strictQuery", true);

  // Check if MONGODB_URI is set

  if (initialized) {
    console.log("Already connected to MongoDB");
    return;
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");
    initialized = true;
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
};

export default connect;
