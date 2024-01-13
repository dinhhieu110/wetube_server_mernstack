import mongoose from "mongoose";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import { createError } from "../error.js";
import jwt from "jsonwebtoken";

export const signup = async (req, res, next) => {
  try {
    // Encript password, and create new user
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(req.body.password, salt);
    const newUser = new User({ ...req.body, password: hash });

    // Save to mongoDB
    await newUser.save();
    res.status(200).send("New user has been created!");
  } catch (error) {
    next(error);
  }
};

export const signin = async (req, res, next) => {
  try {
    const user = await User.findOne({ name: req.body.name });
    if (!user) return next(createError(404, "User not found!"));

    // compare input pass with encrypted pass in mongodb
    const isCorrect = await bcrypt.compare(req.body.password, user.password);

    // Wrong password
    if (!isCorrect)
      return next(createError(400, "Your password is not correct!"));

    // Correct password
    const token = jwt.sign({ id: user._id }, process.env.JWT_KEY); // take userId to create a hash token
    const { password, ...others } = user._doc;
    res
      .cookie("access_token", token, {
        httpOnly: true,
      })
      .status(200)
      .json(others);
  } catch (error) {
    next(error);
  }
};
