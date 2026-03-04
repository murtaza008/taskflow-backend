import express from "express"; // express import
import {
  registerUser,
  loginUser,
  getCurrentUser,
  updateProfile,
  updatePassword,
} from "../controllers/userController.js"; // user controllers import
import authMiddleware from "../middleware/auth.js"; // auth middleware import

const userRouter = express.Router(); // router instance bana rahe hain

userRouter.post("/register", registerUser); // register route
userRouter.post("/login", loginUser); // login route

userRouter.get("/me", authMiddleware, getCurrentUser); // current user info route with auth
userRouter.put("/profile", authMiddleware, updateProfile); // profile update with auth
userRouter.put("/password", authMiddleware, updatePassword); // password update with auth

export default userRouter; // export router
