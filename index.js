import express from "express";
import mongoose from "mongoose";
import userRoutes from "./routes/usersRoute.js";
import videoRoutes from "./routes/videosRoute.js";
import commentRoutes from "./routes/commentsRoute.js";

const app = express();

const connect = () => {
  mongoose
    .connect("mongodb://127.0.0.1/video_sharing_dev")
    .then(() => {
      console.log("Connected to DB");
    })
    .catch((err) => {
      throw err;
    });
};

app.use("/api/users", userRoutes);
app.use("/api/videos", videoRoutes);
app.use("/api/comments", commentRoutes);

app.listen(8800, () => {
  connect();
  console.log("Connected to Server");
});
