import { createError } from "../error.js";
import Comment from "../models/Comment.js";
import Video from "../models/Video.js";

export const addComment = async (req, res, next) => {
  const newComment = new Comment({ ...req.body, userId: req.user.id });
  try {
    const savedComment = await newComment.save();
    res.status(200).send(savedComment);
  } catch (error) {
    next(error);
  }
};

export const deleteComment = async (req, res, next) => {
  try {
    // Người xóa có thể là owner của comment hoặc owner video
    const comment = await Comment.findById(req.params.id);
    const video = await Video.findById(req.params.id);
    if (!comment) return next(createError(404, "Comment not found!"));
    if (req.user.id === comment.userId) {
      await Comment.findByIdAndDelete(req.params.id);
      res.status(200).json("Comment has been deleted!");
    } else {
      return next(createError(403, "You can delete only your comment!"));
    }
  } catch (error) {
    next(error);
  }
};

// Get all comments of a video by video id
export const getComment = async (req, res, next) => {
  try {
    const comments = await Comment.find({ videoId: req.params.videoId });
    res.status(200).json(comments);
  } catch (error) {
    next(error);
  }
};
