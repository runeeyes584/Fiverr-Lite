import express from 'express';
import {
  createReview,
  deleteReview,
  updateReview,
  getAllReviews,
  getReviewById
} from '../controllers/review.controller.js';
import requireAuth from '../middleware/requireAuth.js';

const router = express.Router();

// Lấy danh sách review
router.get('/', getAllReviews);
// Lấy review theo id
router.get('/:id', getReviewById);
// Tạo review mới
router.post('/', requireAuth, createReview);
// Cập nhật review
router.patch('/:id', requireAuth, updateReview);
// Xóa review
router.delete('/:id', requireAuth, deleteReview);

export default router;