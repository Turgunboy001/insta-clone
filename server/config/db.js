import mongoose from "mongoose";

let cached = global._mongoose;
if (!cached) cached = global._mongoose = { conn: null, promise: null };

const connectDB = async () => {
  if (cached.conn) return cached.conn;

  if (!process.env.MONGODB_URL) {
    throw new Error("MONGODB_URL is not set");
  }

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(`${process.env.MONGODB_URL}/pingup`, {
        serverSelectionTimeoutMS: 8000,
      })
      .then((m) => {
        console.log("Database connected");
        return m;
      })
      .catch((err) => {
        cached.promise = null;
        throw err;
      });
  }

  cached.conn = await cached.promise;
  return cached.conn;
};

export default connectDB;
