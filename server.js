import express from "express"; // express framework import kar rahe hain
import cors from "cors"; // CORS middleware import kar rahe hain taa ke client requests allowed hon
import "dotenv/config"; // .env variables ko load karne ke liye dotenv/config use kar rahe hain
import { connectDB } from "./config/db.js"; // database connection function import kar rahe hain
import userRouter from "./routes/userRoute.js"; // user related routes import kar rahe hain
import taskRouter from "./routes/taskRoute.js"; // task related routes import kar rahe hain

const app = express(); // express app ka instance bana rahe hain

app.use(cors()); // CORS middleware app pe laga rahe hain
app.use(express.json()); // JSON body parsing middleware laga rahe hain
app.use(express.urlencoded({ extended: true })); // urlencoded body parsing middleware laga rahe hain

// Database se connect karne wali function ko call kar rahe hain
// Vercel ke serverless environment me bhi yeh function reuseable rahega
connectDB();

// Routes mount kar rahe hain
app.use("/api/user", userRouter); // /api/user route ke liye userRouter attach kar rahe hain
app.use("/api/tasks", taskRouter); // /api/tasks route ke liye taskRouter attach kar rahe hain

// Root path pe simple health check route
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Local development ke liye server ko yahan se listen kara rahe hain
// Vercel ke serverless functions me yeh block execute nahi hoga
if (process.env.NODE_ENV !== "production" && !process.env.VERCEL) {
  const PORT = process.env.PORT || 3000; // server port set kar rahe hain (env se ya default 3000)
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}

// Vercel serverless function ke liye Express app ko export kar rahe hain
export default app;
