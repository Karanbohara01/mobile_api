// import express from "express";

// import {
//   deleteUser,
//   editProfile,
//   followOrUnfollow,
//   forgetPassword,
//   getAllUsers,
//   getProfile,
//   getSuggestedUsers,
//   login,
//   logout,
//   register,
//   resetPassword,
//   verifyEmail,
// } from "../controllers/user.controller.js";
// import isAuthenticated from "../middlewares/isAuthenticated.js";
// import upload from "../middlewares/multer.js";

// const router = express.Router();

// // router.route("/register").post(register);
// router.route("/login").post(login);
// router.post("/register", register);
// router
//   .route("/profile/edit")
//   .post(isAuthenticated, upload.single("profilePhoto"), editProfile);

// router.get("/all", getAllUsers);

// router.route("/logout").get(logout);
// router.route("/:id/profile").get(isAuthenticated, getProfile);
// router
//   .route("/profile/edit")
//   .post(isAuthenticated, upload.single("profilePhoto"), editProfile);
// router.route("/suggested").get(isAuthenticated, getSuggestedUsers);
// router.route("/followorunfollow/:id").post(isAuthenticated, followOrUnfollow);
// router.delete("/users/:id", deleteUser); // Removed isAdmin middleware
// router.post("/forgetPassword", forgetPassword); // Direct controller assignment
// router.post("/reset-password/:token", resetPassword);

// // Add the new verification route
// router.route("/verify/:token").get(verifyEmail);

// export default router;

// import express from "express";
// import {
//   editProfile,
//   getAllUsers,
//   getMe,
//   login,
//   register,
//   uploadImage,
// } from "../controllers/user.controller.js";
// import { protect } from "../middlewares/auth.js";
// import isAuthenticated from "../middlewares/isAuthenticated.js";
// import upload from "../middlewares/upload.js";

// const router = express.Router();
// //"http://10.0.2.2:8000/uploads/user/uploadImage"

// router.post("/uploadImage", upload, uploadImage);
// router.post("/register", register);
// router.post("/login", login);
// router.get("/getMe", protect, getMe);
// router.get("/all", getAllUsers);

// // router.route("/profile/edit").post(editProfile);
// router.post("/profile/edit", isAuthenticated, upload, editProfile);

// export default router;

import express from "express";
import {
  editProfile,
  getAllUsers,
  getMe,
  login,
  register,
  uploadImage,
} from "../controllers/user.controller.js";
import { protect } from "../middlewares/auth.js";
import upload from "../middlewares/upload.js";

const router = express.Router();

// ✅ Route definitions in your required format
router.post("/uploadImage", upload, uploadImage);
router.post("/register", register);
router.post("/login", login);
router.get("/getMe", protect, getMe);
router.get("/all", getAllUsers);

// ✅ Profile Edit Route with `upload` and `isAuthenticated`
router.post("/profile/edit", upload, protect, editProfile);

export default router;
