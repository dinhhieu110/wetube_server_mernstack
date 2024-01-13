import express from "express";
import mongoose from "mongoose";
import userRoutes from "./routes/usersRoute.js";
import videoRoutes from "./routes/videosRoute.js";
import commentRoutes from "./routes/commentsRoute.js";
import authRoutes from "./routes/authRoute.js";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

const app = express();
dotenv.config();

const connect = () => {
  mongoose
    .connect("mongodb://127.0.0.1:27017/video_sharing_dev")
    .then(() => {
      console.log("Connected to DB");
    })
    .catch((err) => {
      throw err;
    });
};

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/videos", videoRoutes);
app.use("/api/comments", commentRoutes);

// Use middleware to handle error in Express --> We can use it everywhere
app.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || "Something went wrong!";
  return res.status(status).json({
    success: false,
    status,
    message,
  });
});
// end error handling middleware

app.listen(8800, () => {
  connect();
  console.log("Connected to Server");
});
