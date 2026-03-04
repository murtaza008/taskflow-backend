import express from "express"; // express import kar rahe hain
import authMiddleware from "../middleware/auth.js"; // auth middleware import kar rahe hain
import {
  createTask,
  getTasks,
  getTasksById,
  updateTask,
  deleteTask,
} from "../controllers/taskController.js"; // task controllers import
const taskRouter = express.Router(); // router instance bana rahe hain

taskRouter
  .route("/gp") // /gp route define kar rahe hain (maybe gp = get/post)
  .get(authMiddleware, getTasks) // GET pe auth check aur tasks fetch
  .post(authMiddleware, createTask); // POST pe auth check aur task create
taskRouter
  .route("/:id/gp") // single task routes with id
  .get(authMiddleware, getTasksById) // GET single task
  .put(authMiddleware, updateTask) // PUT update task
  .delete(authMiddleware, deleteTask); // DELETE task

export default taskRouter; // router export kar rahe hain
