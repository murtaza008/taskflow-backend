import mongoose from "mongoose"; // mongoose library import kar rahe hain
import dotenv from "dotenv";

dotenv.config();

let isConnected = false; // connection status track karne ke liye flag

export const connectDB = async () => {
  // async function jo MongoDB se connect karega

  // Agar pehle se connected hain to dobara connect karne ki zaroorat nahi
  if (isConnected || mongoose.connection.readyState === 1) {
    return;
  }

  const MONGO_URI = process.env.MONGO_URI; // MongoDB URI env variable se le rahe hain

  if (!MONGO_URI) {
    throw new Error("MONGO_URI environment variable is not set");
  }

  try {
    await mongoose.connect(MONGO_URI); // mongoose se MongoDB ko connect kar rahe hain
    isConnected = true;
    console.log("MongoDB connected successfully");
  } catch (err) {
    console.error("MongoDB connection error:", err.message || err);
    // Serverless environment me process.exit use nahi karte, error throw kar dete hain
    throw err;
  }
};
