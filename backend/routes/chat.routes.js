const express = require("express");

const {
  chat,
  getConversations,
  getConversation,
  deleteConversation,
} = require("../controllers/chat.controller");

const authMiddleware = require("../middleware/auth.middleware");

const router = express.Router();

// All chat routes require authentication
router.use(authMiddleware);

router.post("/", chat);
router.get("/", getConversations);
router.get("/:conversationId", getConversation);
router.delete("/:conversationId", deleteConversation);

module.exports = router;