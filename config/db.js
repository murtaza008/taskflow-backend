import mongoose from "mongoose"; // mongoose library import kar rahe hain

export const connectDB = async () => {
  // async function jo MongoDB se connect karega
  const MONGO_URI = // MongoDB URI set kar rahe hain, pehle env variable check kar ke
    process.env.MONGO_URI ||
    "mongodb+srv://murtazabutt7798_db_user:IG2rMpTggCUREING@task-flow.sbkrtbq.mongodb.net/?appName=task-flow"; // fallback URI
  await mongoose
    .connect(MONGO_URI) // mongoose se MongoDB ko connect kar rahe hain
    .then(() => {
      console.log("MongoDB connected successfully"); // success message console pe print kar rahe hain
    })
    .catch((err) => {
      console.error("MongoDB connection error:", err.message || err); // agar error ho to console pe show karenge
      process.exit(1); // error hain to process exit kar denge
    });
};
