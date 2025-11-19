import mongoose from "mongoose"; // mongoose import kar rahe hain

const userSchema = new mongoose.Schema({
  // user schema define kar rahe hain
  name: {
    type: String, // name string hona chahiye
    required: true, // required field
  },
  email: {
    type: String, // email string
    required: true, // required
    unique: true, // unique hona chahiye
  },
  password: {
    type: String, // hashed password string
    required: true, // required
  },
});

const userModel = mongoose.models.user || mongoose.model("user", userSchema); // model create ya reuse kar rahe hain

export default userModel; // user model export kar rahe hain
