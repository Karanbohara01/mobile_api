import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js"; // ✅ Import User model
dotenv.config();

const isProtected = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res
      .status(401)
      .json({ message: "No token provided", success: false });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ✅ Fetch the user from the database and attach to `req.user`
    const user = await User.findById(decoded.id).select("-password"); // Exclude password

    if (!user) {
      return res
        .status(401)
        .json({ message: "User not found", success: false });
    }

    req.user = user; // ✅ Store full user object in request
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token", success: false });
  }
};

export default isProtected;
