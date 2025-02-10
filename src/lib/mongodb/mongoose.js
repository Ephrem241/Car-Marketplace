import mongoose from "mongoose";

// Cache connection to handle hot-reloads
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = {
    conn: null,
    promise: null,
  };
}

const connect = async () => {
  // 1. Check for existing connection
  if (cached.conn) {
    console.debug("Using existing MongoDB connection");
    return cached.conn;
  }

  // 2. Validate environment variables
  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI not defined in environment variables");
  }

  // 3. Set mongoose options
  const options = {
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
    maxPoolSize: 10,
    minPoolSize: 2,
    family: 4,
  };

  try {
    // 4. Create new connection promise
    cached.promise = mongoose
      .connect(process.env.MONGODB_URI, options)
      .then((mongoose) => {
        console.log("Successfully connected to MongoDB");
        return mongoose;
      });

    // 5. Await connection and store in cache
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (error) {
    // 6. Handle connection errors
    console.error("MongoDB connection error:", error);

    // Reset connection cache on failure
    cached.conn = null;
    cached.promise = null;

    throw new Error(`MongoDB connection failed: ${error.message}`);
  }
};

// Configure mongoose global settings
mongoose.set("strictQuery", true);
mongoose.set("bufferCommands", false);

// Handle connection events
mongoose.connection.on("connected", () => {
  console.log("Mongoose connected to DB");
});

mongoose.connection.on("error", (err) => {
  console.error("Mongoose connection error:", err);
});

mongoose.connection.on("disconnected", () => {
  console.warn("Mongoose connection disconnected");
});

// Handle process termination
const shutdown = async (signal) => {
  console.log(`${signal} received: closing MongoDB connection`);
  await mongoose.connection.close();
  process.exit(0);
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

export default connect;
