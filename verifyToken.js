import jwt from "jsonwebtoken";
import { createError } from "./error.js";

export const verifyToken = (req, res, next) => {
  // Get token after sign in and check
  const token = req.cookies.access_token;
  if (!token) return next(createError(401, "You are not authenticated "));

  // Verify token is valid or not
  jwt.verify(token, process.env.JWT_KEY, (err, user) => {
    if (err) return next(createError(403, "Token is not valid!"));
    req.user = user;
    next();
  });
};
