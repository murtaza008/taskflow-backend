import mongoose from "mongoose"; // mongoose library import kar rahe hain

export const connectDB = async () => {
  const MONGO_URI = process.env.MONGO_URI;
  if (!MONGO_URI) {
    console.error("Missing MONGO_URI environment variable");
    process.exit(1);
  }
  await mongoose
    .connect(MONGO_URI)
    .then(() => {
      console.log("MongoDB connected successfully");
    })
    .catch((err) => {
      console.error("MongoDB connection error:", err.message || err);
      process.exit(1);
    });
};
