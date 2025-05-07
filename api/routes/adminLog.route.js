import express from 'express';
import { getAdminLogs, logAdminAction } from '../controllers/adminLog.controller.js';
import requireAuth from '../middleware/requireAuth.js';

const router = express.Router();

// Lấy danh sách admin logs
router.get('/', getAdminLogs);
// Ghi lại hành động của admin
router.post('/', logAdminAction);
// Lấy danh sách admin logs theo id


export default router;