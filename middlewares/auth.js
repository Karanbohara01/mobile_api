import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import asyncHandler from "./async.js";

// Protect routes
export const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    // Extract token from Bearer header
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res
      .status(401)
      .json({ message: "Not authorized to access this route (Missing Token)" });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Fetch the user from DB and attach it to req.user
    req.user = await User.findById(decoded.id);

    if (!req.user) {
      return res
        .status(401)
        .json({ message: "User not found (Invalid Token)" });
    }

    next();
  } catch (err) {
    return res.status(401).json({ message: "Not authorized (Invalid Token)" });
  }
});

// Grant access to specific roles (e.g., publisher, admin)
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: `User role ${req.user.role} is not authorized to access this route`,
      });
    }
    next();
  };
};
