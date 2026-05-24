import express from "express";
import protect from "../middleware/authMiddleware.js";
import {
  sendMessage,
  getMessages,
  markMessagesAsRead,
} from "../controllers/messageController.js";

const router = express.Router();

router.post("/", protect, sendMessage);
router.get("/:conversationId", protect, getMessages);
router.put("/read", protect, markMessagesAsRead);

export default router;