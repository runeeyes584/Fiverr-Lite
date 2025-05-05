import express from 'express';
import {
  createGigView,
  deleteGigView,
  getAllGigViews,
  getGigViewById
} from '../controllers/gigViews.controller.js';
import requireAuth from '../middleware/requireAuth.js';

const router = express.Router();

// Lấy danh sách gig view
router.get('/', getAllGigViews);
// Lấy gig view theo id
router.get('/:id', getGigViewById);
// Tạo gig view mới
router.post('/', requireAuth, createGigView);
// Cập nhật gig view
router.patch('/:id', requireAuth, (req, res) => {
  res.status(405).send({ message: 'Method Not Allowed' });
});
// Xóa gig view
router.delete('/:id', requireAuth, deleteGigView);



export default router;