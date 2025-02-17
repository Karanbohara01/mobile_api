import express from "express";
import { getMessage, sendMessage } from "../controllers/message.controller.js";

const router = express.Router();

// router.route("/send/:id").post(isAuthenticated, sendMessage);
router.route("/send/:id").post(sendMessage);
router.route("/all/:id").get(getMessage);
// router.route("/all/:id").get(isAuthenticated, getMessage);

export default router;
