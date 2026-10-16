import mongoose from "mongoose";
import env from "./env.js";

const connectDB = async () => {
  try {
    if (!env.MONGODB_URI) {
      throw new Error("MONGODB_URI is not defined in .env");
    }

    const connection = await mongoose.connect(env.MONGODB_URI);

    console.log(
      `MongoDB connected: ${connection.connection.host}`
    );
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

export default connectDB;