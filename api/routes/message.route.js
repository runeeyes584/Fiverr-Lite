import express from "express";
import { getMessages, sendMessage, markMessageAsRead, getTickets, updateTicketStatus } from "../controllers/message.controller.js";

const router = express.Router();

// Lấy danh sách tin nhắn theo order_id
router.get("/", getMessages);

// Gửi tin nhắn mới
router.post("/", sendMessage);

// Đánh dấu tin nhắn là đã xem
router.patch("/:id/read", markMessageAsRead);

// Lấy danh sách ticket
router.get("/tickets", getTickets);

// Cập nhật trạng thái ticket
router.patch("/tickets", updateTicketStatus);

export default router;