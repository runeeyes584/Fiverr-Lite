import express from 'express';
import {
  createGigViewCount,
  deleteGigViewCount,
  getAllGigViewCounts,
  getGigViewCountById,
  updateGigViewCount
} from '../controllers/gigViewCounts.controller.js';
import requireAuth from '../middleware/requireAuth.js';

const router = express.Router();

// Lấy danh sách gig view count
router.get('/', getAllGigViewCounts);
// Lấy gig view count theo id
router.get('/:id', getGigViewCountById);
// Tạo gig view count mới
router.post('/', requireAuth, createGigViewCount);
// Cập nhật gig view count
router.patch('/:id', requireAuth, updateGigViewCount);
// Xóa gig view count
router.delete('/:id', requireAuth, deleteGigViewCount);

export default router;