import express from "express";
import {
  createConversation,
  getConversations,
  getSingleConversation,
  updateConversation,
} from "../controllers/conversation.controller.js";
import { verifyToken } from "../middleware/jwt.js";

const router = express.Router();

router.get("/", verifyToken, getConversations);
router.post("/", verifyToken, createConversation);
router.get("/single/:id", verifyToken, getSingleConversation);
router.put("/:id", verifyToken, updateConversation);

export default router;

// router.get("/single/:id", verifyToken, getSingleConversation);
// router.put("/:id", verifyToken, updateConversation);
// router.delete("/:id", verifyToken, deleteConversation);
// router.delete("/:id", verifyToken, deleteConversation);
// router.get("/single/:id", verifyToken, getSingleConversation);
