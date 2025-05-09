import express from 'express';
import {
  createMessage,
  deleteMessage,
  getAllMessages,
  getMessageById,
} from '../controllers/message.controller.js';
import requireAuth from '../middleware/requireAuth.js';

const router = express.Router();

// Chỉ giữ lại các API dùng để load/xóa tin nhắn
router.get('/', getAllMessages);
router.get('/:id', getMessageById);
router.post('/', requireAuth, createMessage);
router.delete('/:id', requireAuth, deleteMessage);

export default router;
