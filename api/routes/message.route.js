import express from 'express';
import {
  createMessage,
  deleteMessage,
  getAllMessages,
  getMessageById
} from '../controllers/message.controller.js';
import requireAuth from '../middleware/requireAuth.js';

const router = express.Router();

// Lấy danh sách message
router.get('/', getAllMessages);
// Lấy message theo id
router.get('/:id', getMessageById);
// Tạo message mới
router.post('/', requireAuth, createMessage);
// Cập nhật message
router.patch('/:id', requireAuth, createMessage);
// Xóa message
router.delete('/:id', requireAuth, deleteMessage);


export default router;