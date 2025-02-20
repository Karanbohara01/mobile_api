// import jwt from "jsonwebtoken";
// const isAuthenticated = async (req, res, next) => {
//   try {
//     const token = req.cookies.token;
//     if (!token) {
//       return res.status(401).json({
//         message: "User not authenticated",
//         success: false,
//       });
//     }
//     const decode = await jwt.verify(token, process.env.SECRET_KEY);
//     if (!decode) {
//       return res.status(401).json({
//         message: "Invalid",
//         success: false,
//       });
//     }
//     req.id = decode.userId;
//     next();
//   } catch (error) {
//     console.log(error);
//   }
// };
// export default isAuthenticated;

// import jwt from "jsonwebtoken";

// const isAuthenticated = async (req, res, next) => {
//   try {
//     let token = req.cookies.token; // First, check cookies

//     // ✅ If token is not in cookies, check Authorization header
//     if (!token && req.headers.authorization) {
//       token = req.headers.authorization.split(" ")[1]; // "Bearer <token>"
//     }

//     if (!token) {
//       return res.status(401).json({
//         message: "User not authenticated",
//         success: false,
//       });
//     }

//     const decode = await jwt.verify(token, process.env.SECRET_KEY);

//     if (!decode) {
//       return res.status(401).json({
//         message: "Invalid token",
//         success: false,
//       });
//     }

//     req.id = decode.userId; // Ensure your token includes "userId"
//     next();
//   } catch (error) {
//     console.log("JWT Error:", error);
//     return res
//       .status(401)
//       .json({ message: "Invalid or expired token", success: false });
//   }
// };

// export default isAuthenticated;

import dotenv from "dotenv";
import jwt from "jsonwebtoken";
dotenv.config();

const isAuthenticated = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res
      .status(401)
      .json({ message: "No token provided", success: false });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.id = decoded.id; // Store user ID in request
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token", success: false });
  }
};

export default isAuthenticated;
