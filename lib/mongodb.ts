// lib/mongodb.ts
import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error("⚠️ Please define MONGODB_URI environment variable");
}

// ✅ Global cache with proper type declaration
interface MongooseCache {
  conn: mongoose.Connection | null;
  promise: Promise<mongoose.Mongoose> | null;
}

// ✅ Extend global type safely
declare global {
  var mongoose: MongooseCache | undefined;
}

// ✅ Initialize cache
const cached: MongooseCache = global.mongoose || { conn: null, promise: null };

if (!global.mongoose) {
  global.mongoose = cached;
}

export async function connectDB(): Promise<mongoose.Connection> {
  // ✅ If already connected, return cached connection
  if (cached.conn) {
    console.log("✅ Using cached MongoDB connection");
    return cached.conn;
  }

  // ✅ If connection is in progress, wait for it
  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      maxPoolSize: 10,
    };

    console.log("🔄 Connecting to MongoDB...");
    cached.promise = mongoose
      .connect(MONGODB_URI, opts)
      .then((mongooseInstance) => {
        console.log("✅ MongoDB Connected Successfully!");
        return mongooseInstance;
      })
      .catch((err) => {
        console.error("❌ MongoDB Connection Error:", err);
        cached.promise = null;
        throw err;
      });
  }

  try {
    const mongooseInstance = await cached.promise;
    cached.conn = mongooseInstance.connection;
  } catch (error) {
    cached.promise = null;
    throw error;
  }

  return cached.conn;
}

// ✅ Optional: Disconnect function (for testing)
export async function disconnectDB(): Promise<void> {
  if (cached.conn) {
    await mongoose.disconnect();
    cached.conn = null;
    cached.promise = null;
    console.log("🔌 MongoDB Disconnected");
  }
}