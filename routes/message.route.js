import express from "express";
import {
  deleteMessage,
  getMessage,
  sendMessage,
} from "../controllers/message.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
const router = express.Router();
router.route("/send/:id").post(isAuthenticated, sendMessage);
router.route("/all/:id").get(isAuthenticated, getMessage);
router.delete("/messages/:messageId", isAuthenticated, deleteMessage);
export default router;
