import jwt from "jsonwebtoken"; // JWT library import kar rahe hain
import User from "../models/userModel.js"; // User model import kar rahe hain

const JWT_SECRET = process.env.JWT_SECRET; // JWT secret must be provided via env

export default async function authMiddleware(req, res, next) {
  // authentication middleware
  const authHeader = req.headers.authorization; // authorization header read kar rahe hain
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    // header check
    return res.status(401).json({ success: false, message: "Unauthorized" }); // agar header missing ho to unauthorized
  }
  const token = authHeader.split(" ")[1]; // token string nikal rahe hain
  try {
    const payload = jwt.verify(token, JWT_SECRET); // token verify kar rahe hain
    const user = await User.findById(payload.id).select("-password"); // user fetch kar rahe hain password exclude karke
    if (!user) {
      return res.status(401).json({ success: false, message: "Unauthorized" }); // agar user nahi to unauthorized
    }
    req.user = user; // req.user me user attach kar rahe hain taake handlers use kar saken
    next(); // next middleware/route handler ko call kar rahe hain
  } catch (error) {
    console.error("Error in auth middleware:", error); // error log kar rahe hain
    return res.status(401).json({ success: false, message: "Unauthorized" }); // token invalid ho to unauthorized
  }
}
