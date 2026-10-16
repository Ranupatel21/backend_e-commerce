import jwt from "jsonwebtoken";

import User from "../models/user.js";
import ApiError from "../utils/api.error.js";

export const protect = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      throw new ApiError(
        401,
        "Authentication required. Please login."
      );
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    const user = await User.findById(decoded.id).select(
      "-password"
    );

    if (!user) {
      throw new ApiError(
        401,
        "User no longer exists"
      );
    }

    if (!user.isActive) {
      throw new ApiError(
        403,
        "Your account has been deactivated"
      );
    }

    // User information available to next middleware/controller
    req.user = user;

    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return next(
        new ApiError(401, "Invalid authentication token")
      );
    }

    if (error.name === "TokenExpiredError") {
      return next(
        new ApiError(401, "Authentication token has expired")
      );
    }

    next(error);
  }
};