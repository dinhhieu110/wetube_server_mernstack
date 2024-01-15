import { createError } from "../error.js";
import Video from "../models/Video.js";
import User from "../models/User.js";

export const addVideo = async (req, res, next) => {
  // Thêm userID của người post video để biết do ai post, ở sau dùng destructuring lấy toàn bộ thông tin input req.body
  const newVideo = new Video({ userId: req.user.id, ...req.body });
  try {
    const savedVideo = await newVideo.save();
    res.status(200).json(savedVideo);
  } catch (error) {
    next(error);
  }
};

export const updateVideo = async (req, res, next) => {
  try {
    // Check whether video exist
    const video = await Video.findById(req.params.id);
    if (!video) return next(createError(404, "Video not found!"));
    // Check whether this video was posted by the signed in user or not by id
    if (req.user.id === video.userId) {
      const updatedVideo = await Video.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        { new: true }
      );
      res.status(200).json(updateVideo);
    } else {
      return next(createError(403, "You can update only your video!"));
    }
  } catch (error) {
    next(error);
  }
};

export const deleteVideo = async (req, res, next) => {
  try {
    // Check whether video exist
    const video = await Video.findById(req.params.id);
    if (!video) return next(createError(404, "Video not found!"));
    // Check whether this video was posted by the signed in user or not, by id
    if (req.user.id === video.userId) {
      await Video.findByIdAndDelete(req.params.id);
      res.status(200).json("The video has been deleted!");
    } else {
      return next(createError(403, "You can delete only your video!"));
    }
  } catch (error) {
    next(error);
  }
};

export const getVideo = async (req, res, next) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) return next(createError(404, "Video not found!"));
    res.status(200).json(video);
  } catch (error) {
    next(error);
  }
};

export const addView = async (req, res, next) => {
  try {
    await Video.findByIdAndUpdate(req.params.id, {
      $inc: { views: 1 },
    });
    res.status(200).json("The view has been increased!");
  } catch (error) {
    next(error);
  }
};

export const random = async (req, res, next) => {
  try {
    const videos = await Video.aggregate([{ $sample: { size: 40 } }]); // Return us a random sample
    res.status(200).json(videos);
  } catch (error) {
    next(error);
  }
};

export const trend = async (req, res, next) => {
  try {
    const videos = await Video.find().sort({ views: -1 }); // views : 1 --> print least views, views: -1 --> print the most views
    res.status(200).json(videos);
  } catch (error) {
    next(error);
  }
};

// Fetch videos of subscribed channel
export const sub = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    const subsribedChannels = user.subscribedUsers;

    const list = await Promise.all(
      subsribedChannels.map((channelId) => {
        return Video.find({ userId: channelId });
      })
    );
    res.status(200).json(list.flat().sort((a, b) => b.createdAt - a.createdAt)); //flat method to reduce nested arrays to an array with objects inside
  } catch (error) {
    next(error);
  }
};
// Search video by tag
export const getByTag = async (req, res, next) => {
  const tags = req.query.tags.split(","); // express query
  console.log(tags);
  try {
    const videos = await Video.find({ tags: { $in: tags } }).limit(20);
    res.status(200).json(videos);
  } catch (error) {
    next(error);
  }
};

export const search = async (req, res, next) => {
  const query = req.query.q;
  try {
    const videos = await Video.find({
      title: { $regex: query, $options: "i" },
    }).limit(40);
    res.status(200).json(videos);
  } catch (error) {
    next(error);
  }
};
