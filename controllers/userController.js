import { createError } from "../error.js";
import User from "../models/User.js";
import Video from "../models/Video.js";

export const update = async (req, res, next) => {
  // compare input id with req.user.id (user from VerifyToken)
  if (req.params.id === req.user.id) {
    try {
      const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        { new: true }
      );
      res.status(200).json(updatedUser);
    } catch (error) {
      next(error);
    }
  } else {
    return next(createError(403, " You can update only your account!"));
  }
};
export const deleteUser = async (req, res, next) => {
  // compare input id with req.user.id (user from VerifyToken)
  if (req.params.id === req.user.id) {
    try {
      await User.findByIdAndDelete(req.params.id);
      res.status(200).json("User has been deleted!");
    } catch (error) {
      next(error);
    }
  } else {
    return next(createError(403, " You can delete only your account!"));
  }
};
export const getUser = async (req, res, next) => {
  try {
    const getUser = await User.findById(req.params.id);
    res.status(200).json(getUser);
  } catch (error) {
    next(error);
  }
};
export const subscribe = async (req, res, next) => {
  try {
    // tìm user đang đăng nhập bằng id từ jwt, thêm id của idol' user vào mảng những kênh user đki
    await User.findByIdAndUpdate(req.user.id, {
      $push: { subscribedUsers: req.params.id },
    });
    // Tìm idol'user bằng id, update follower + 1
    await User.findByIdAndUpdate(req.params.id, {
      $inc: { subscribers: 1 },
    });
    res.status(200).json("Subscription successfully!");
  } catch (error) {
    next(error);
  }
};
export const unsubscribe = async (req, res, next) => {
  try {
    // tìm user đang đăng nhập bằng id từ jwt, lấy id của idol' user vào mảng những kênh user đki
    await User.findByIdAndUpdate(req.user.id, {
      $pull: { subscribedUsers: req.params.id },
    });
    // Tìm idol'user bằng id, update follower -1
    await User.findByIdAndUpdate(req.params.id, {
      $inc: { subscribers: -1 },
    });
    res.status(200).json("Unsubscription successfully!");
  } catch (error) {
    next(error);
  }
};
export const like = async (req, res, next) => {
  const userId = req.user.id;
  const videoId = req.params.videoId;
  try {
    await Video.findByIdAndUpdate(videoId, {
      $addToSet: { likes: userId },
      $pull: { dislikes: userId },
    });
    res.status(200).json("The video has been liked!");
  } catch (error) {
    next(error);
  }
};
export const dislike = async (req, res, next) => {
  const userId = req.user.id;
  const videoId = req.params.videoId;
  try {
    await Video.findByIdAndUpdate(videoId, {
      $addToSet: { dislikes: userId },
      $pull: { likes: userId },
    });
    res.status(200).json("The video has been disliked!");
  } catch (error) {
    next(error);
  }
};
