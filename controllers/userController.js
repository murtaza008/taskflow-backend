import User from "../models/userModel.js"; // User model import kar rahe hain
import validator from "validator"; // validator library email validation ke liye
import bcrypt from "bcryptjs"; // bcrypt password hashing ke liye
import jwt from "jsonwebtoken"; // jwt tokens create/verify karne ke liye
const JWT_SECRET = process.env.JWT_SECRET; // JWT secret must be provided via env
const TOKEN_EXPIRES = "24h"; // token expiry set kar rahe hain
const createToken = (userId) =>
  jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: TOKEN_EXPIRES }); // token create karne wali helper
export async function registerUser(req, res) {
  // user registration handler
  const { name, email, password } = req.body; // body se name,email,password nikal rahe hain
  if (!name || !email || !password) {
    return res
      .status(400)
      .json({ success: false, message: "All fields are required" }); // required fields check
  }
  if (!validator.isEmail(email)) {
    return res.status(400).json({ success: false, message: "Invalid email" }); // email format validate
  }
  if (password.length < 8) {
    return res.status(400).json({
      success: false,
      message: "Password must be at least 8 characters long",
    }); // password length check
  }
  try {
    if (await User.findOne({ email })) {
      return res
        .status(400)
        .json({ success: false, message: "Email already registered" }); // duplicate email check
    }
    const hashed = await bcrypt.hash(password, 10); // password hash kar rahe hain
    const user = await User.create({ name, email, password: hashed }); // naya user create kar rahe hain
    const token = createToken(user._id); // JWT token bana rahe hain
    res.status(201).json({
      success: true,
      token,
      user: { name: user.name, email: user.email, id: user._id },
    }); // response me token aur user info bhej rahe hain
  } catch (error) {
    console.error("Error registering user:", error); // error ko log kar rahe hain
    res.status(500).json({ success: false, message: "Server error" }); // server error response
  }
}

export async function loginUser(req, res) {
  // user login handler
  const { email, password } = req.body; // body se credentials nikal rahe hain
  if (!email || !password) {
    return res
      .status(400)
      .json({ success: false, message: "Email and password are required" }); // input check
  }
  try {
    const user = await User.findOne({ email }); // email se user dhundh rahe hain
    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid email or password" }); // agar user nahi to unauthorized
    }
    const match = await bcrypt.compare(password, user.password); // password compare kar rahe hain
    if (!match) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid email or password" }); // agar match nahi to unauthorized
    }
    const token = createToken(user._id); // token bana rahe hain
    res.json({
      success: true,
      token,
      user: { name: user.name, email: user.email, id: user._id },
    }); // success response with token
  } catch (error) {
    console.error("Error logging in user:", error); // error log
    res.status(500).json({ success: false, message: "Server error" }); // server error
  }
}

export async function getCurrentUser(req, res) {
  // current authenticated user info
  try {
    const user = await User.findById(req.user.id).select("name email"); // DB se user fetch kar rahe hain
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User not found" }); // agar user nahi to error
    }
    res.json({ success: true, user }); // user info bhej rahe hain
  } catch (error) {
    console.error("Error fetching current user:", error); // error log
    res.status(500).json({ success: false, message: "Server error" }); // server error
  }
}

export async function updateProfile(req, res) {
  // user profile update handler
  const { name, email } = req.body; // nayi name aur email body se nikal rahe hain
  if (!name || !email || !validator.isEmail(email)) {
    return res
      .status(400)
      .json({ success: false, message: "Name and email are required" }); // validation
  }
  try {
    const exists = await User.findOne({ email, _id: { $ne: req.user.id } }); // check karo koi aur user same email use to nahi kar raha
    if (exists) {
      return res
        .status(400)
        .json({ success: false, message: "Email already in use" }); // agar kisi aur ka email hai to error
    }
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { name, email },
      { new: true, runValidators: true, select: "name email" }
    ); // user update karke updated document return kar rahe hain
    res.json({ success: true, user }); // updated user bhej rahe hain
  } catch (error) {
    console.error("Error updating profile:", error); // error log
    res.status(500).json({ success: false, message: "Server error" }); // server error
  }
}

export async function updatePassword(req, res) {
  // password update handler
  const { currentPassword, newPassword } = req.body; // body se passwords nikal rahe hain
  if (!currentPassword || !newPassword || newPassword.length < 8) {
    return res.json({ success: false, message: "Invalid password input" }); // input validation
  }
  try {
    const user = await User.findById(req.user.id).select("password"); // user ke hashed password ko fetch kar rahe hain
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" }); // agar user nahi to 404
    }
    const match = await bcrypt.compare(currentPassword, user.password); // current password match kar rahe hain
    if (!match) {
      return res
        .status(401)
        .json({ success: false, message: "Current password is incorrect" }); // agar match nahi to unauthorized
    }
    user.password = await bcrypt.hash(newPassword, 10); // new password ko hash karke user.password set kar rahe hain
    await user.save(); // changes save kar rahe hain
    res.json({ success: true, message: "Password updated successfully" }); // success response
  } catch (error) {
    console.error("Error updating password:", error); // error log
    res.status(500).json({ success: false, message: "Server error" }); // server error
  }
}
