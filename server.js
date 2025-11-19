import express from "express"; // express framework import kar rahe hain
import cors from "cors"; // CORS middleware import kar rahe hain taa ke client requests allowed hon
import "dotenv/config"; // .env variables ko load karne ke liye dotenv/config use kar rahe hain
import { connectDB } from "./config/db.js"; // database connection function import kar rahe hain
import userRouter from "./routes/userRoute.js"; // user related routes import kar rahe hain
import taskRouter from "./routes/taskRoute.js"; // task related routes import kar rahe hain
const app = express(); // express app ka instance bana rahe hain
const PORT = process.env.PORT || 3000; // server port set kar rahe hain (env se ya default 3000)
app.use(cors()); // CORS middleware app pe laga rahe hain
app.use(express.json()); // JSON body parsing middleware laga rahe hain
app.use(express.urlencoded({ extended: true })); // urlencoded body parsing middleware laga rahe hain

connectDB(); // database se connect karne wali function ko call kar rahe hain

app.use("/api/user", userRouter); // /api/user route ke liye userRouter attach kar rahe hain
app.use("/api/tasks", taskRouter); // /api/tasks route ke liye taskRouter attach kar rahe hain
app.get("/", (req, res) => {
  // root path pe simple health check route define kar rahe hain
  res.send("API is running..."); // response bhejne se server chal raha hai ye bataya ja raha hai
});

app.listen(PORT, () => {
  // server ko specified PORT pe listen kara rahe hain
  console.log(`Server is running on http://localhost:${PORT}`); // console pe server running ka message dikhate hain
});
