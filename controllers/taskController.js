import Task from "../models/taskModel.js"; // Task model import kar rahe hain

export const createTask = async (req, res) => {
  // nayi task create karne wali handler
  try {
    const { title, description, priority, dueDate, completed } = req.body; // request body se fields nikal rahe hain
    const task = new Task({
      // Task model ka naya instance bana rahe hain
      title, // title set kar rahe hain
      description, // description set kar rahe hain
      priority, // priority set kar rahe hain
      dueDate: dueDate ? new Date(dueDate) : undefined, // due date ko Date me convert kar rahe hain
      completed: completed === "Yes" || completed === true, // completed ko boolean me convert kar rahe hain
      owner: req.user.id, // authenticated user id ko owner set kar rahe hain
    });
    const saved = await task.save(); // task ko DB me save kar rahe hain
    res.status(201).json({ success: true, task: saved }); // success response bhej rahe hain
  } catch (error) {
    res.status(400).json({ success: false, message: error.message }); // error case me 400 aur message bhej rahe hain
  }
};

export const getTasks = async (req, res) => {
  // user ke tasks fetch karne wali handler
  try {
    const tasks = await Task.find({ owner: req.user.id }).sort({
      // owner ke tasks DB se find kar rahe hain
      createdAt: -1, // newest pehle sort kar rahe hain
    });
    res.json({ success: true, tasks }); // tasks bhej rahe hain
  } catch (error) {
    res.status(400).json({ success: false, message: error.message }); // error handle kar rahe hain
  }
};

export const getTasksById = async (req, res) => {
  // single task id se fetch karne wali handler
  try {
    const task = await Task.findOne({ _id: req.params.id, owner: req.user.id }); // task ko id aur owner se find kar rahe hain
    if (!task) {
      return res
        .status(404)
        .json({ success: false, message: "Task not found" }); // agar nahi mila to 404 bhejte hain
    }
    res.json({ success: true, task }); // agar mila to task return kar rahe hain
  } catch (error) {
    res.status(500).json({ success: false, message: error.message }); // server error case
  }
};

export const updateTask = async (req, res) => {
  // task update karne wali handler
  try {
    const data = { ...req.body }; // request body ka copy bana rahe hain
    if (data.completed !== undefined) {
      // agar completed field aayi to
      data.completed = data.completed === "Yes" || data.completed === true; // boolean me convert kar dein
    }
    if (data.dueDate) {
      data.dueDate = new Date(data.dueDate);
    }
    const updated = await Task.findOneAndUpdate(
      { _id: req.params.id, owner: req.user.id }, // sirf owner ki task update karenge
      data, // updated data
      { new: true, runValidators: true }
    );
    if (!updated) {
      return res
        .status(404)
        .json({ success: false, message: "Task not found" }); // agar update nahi hua to 404
    }
    res.json({ success: true, updated }); // updated task bhej rahe hain
  } catch (error) {
    res.status(400).json({ success: false, message: error.message }); // validation ya bad request
  }
};

export const deleteTask = async (req, res) => {
  // task delete karne wali handler
  try {
    const deleted = await Task.findOneAndDelete({
      _id: req.params.id,
      owner: req.user.id, // owner check ke sath delete kar rahe hain
    });
    if (!deleted) {
      return res
        .status(404)
        .json({ success: false, message: "Task not found" }); // agar delete nahi hua to 404
    }
    res.json({ success: true, message: "Task deleted successfully" }); // success message
  } catch (error) {
    res.status(500).json({ success: false, message: error.message }); // server error
  }
};
