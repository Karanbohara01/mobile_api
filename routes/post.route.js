import express from "express";
import {
  addComment,
  addNewPost,
  bookmarkPost,
  deletePost,
  dislikePost,
  getAllPost,
  getCommentsOfPost,
  getPostById,
  getUserPost,
  likePost,
  updatePost,
} from "../controllers/post.controller.js";
import { uploadImage } from "../controllers/user.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import isProtected from "../middlewares/isProtected.js";
import upload from "../middlewares/multer.js";

//  for web
// import upload from "../middlewares/multer.js";

//  for mobile

const router = express.Router();

router.post("/addpost", isProtected, addNewPost); // 'image' is the field name for the file
// for mobile
router.post("/uploadPostsImage", upload, uploadImage);

//"http://10.0.2.2:8000/uploads/post/uploadPostsImage"
router.route("/all").get(getAllPost);
router.route("/userpost/all").get(getUserPost);
router.route("/:id/like").get(isAuthenticated, likePost);
router.route("/:id").put(isAuthenticated, updatePost);
router.route("/:id/dislike").get(isAuthenticated, dislikePost);
router.route("/:id/comment").post(isAuthenticated, addComment);
router.route("/:id/comment/all").post(isAuthenticated, getCommentsOfPost);
router.route("/delete/:id").delete(isAuthenticated, deletePost);
router.route("/:id/bookmark").get(isAuthenticated, bookmarkPost);
router.get("/:id", getPostById);

export default router;
