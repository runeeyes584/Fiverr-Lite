import express from 'express';
import {
  createNotification,
  deleteNotification,
  getAllNotifications,
  getNotificationById,
  updateNotification,
} from '../controllers/notification.controller.js';
import requireAuth from '../middleware/requireAuth.js';

const router = express.Router();

// Lấy danh sách notification
router.get('/', getAllNotifications);
// Lấy notification theo id
router.get('/:id', getNotificationById);
// Tạo notification mới
router.post('/', requireAuth, createNotification);
// Cập nhật notification
router.patch('/:id', requireAuth, updateNotification);
// Xóa notification
router.delete('/:id', requireAuth, deleteNotification);

export default router;