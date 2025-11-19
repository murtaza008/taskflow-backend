import express from "express"; // express framework import kar rahe hain
import cors from "cors"; // CORS middleware import kar rahe hain taa ke client requests allowed hon
import "dotenv/config"; // .env variables ko load karne ke liye dotenv/config use kar rahe hain
import { connectDB } from "./config/db.js"; // database connection function import kar rahe hain
import userRouter from "./routes/userRoute.js"; // user related routes import kar rahe hain
import taskRouter from "./routes/taskRoute.js"; // task related routes import kar rahe hain
import serverless from "serverless-http";
const app = express(); // express app ka instance bana rahe hain
const PORT = process.env.PORT || 3000; // server port set kar rahe hain (env se ya default 3000)
app.use(cors()); // CORS middleware app pe laga rahe hain
app.use(express.json()); // JSON body parsing middleware laga rahe hain
app.use(express.urlencoded({ extended: true })); // urlencoded body parsing middleware laga rahe hain

connectDB(); // database se connect karne wali function ko call kar rahe hain
// Mount routers to accept requests both with and without the `/api` prefix.
// This makes the deployment robust when frontend/base URLs differ.
app.use(["/api/user", "/user"], userRouter);
app.use(["/api/tasks", "/tasks"], taskRouter);
app.get("/", (req, res) => {
  // root path pe simple health check route define kar rahe hain
  res.send("API is running..."); // response bhejne se server chal raha hai ye bataya ja raha hai
});

// When deploying to serverless platforms like Vercel, the platform expects
// an exported handler instead of starting a long-running listener. Avoid
// calling `app.listen()` when running on Vercel; export the app so the
// platform can invoke it as a function. Locally (or if VERCEL isn't set),
// we still start the server for development.
if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}

// Export a serverless handler for platforms like Vercel.
const handler = serverless(app);
export default handler;
