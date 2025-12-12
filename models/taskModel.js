import mongoose from "mongoose"; // mongoose import kar rahe hain
const taskSchema = new mongoose.Schema({
  // task schema define kar rahe hain
  title: {
    type: String, // title string hona chahiye
    required: true, // title required hai
  },
  description: {
    type: String, // description string
    default: "", // agar missing ho to empty string
  },
  priority: {
    type: String, // priority string
    enum: ["Low", "Medium", "High"], // allowed values
    default: "Low", // default value
  },
  dueDate: {
    type: Date, // due date type Date
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId, // owner as ObjectId
    ref: "User", // reference User model
    required: true, // owner required
  },
  completed: {
    type: Boolean, // completed boolean
    default: false, // default false
  },
  createdAt: {
    type: Date, // creation timestamp
    default: Date.now, // default current date
  },
});

const Task = mongoose.models.Task || mongoose.model("Task", taskSchema); // model create kar rahe hain
export default Task; // model export kar rahe hain
