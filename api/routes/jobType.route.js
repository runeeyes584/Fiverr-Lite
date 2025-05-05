import express from 'express';
import {
  createJobType,
  deleteJobType,
  getAllJobTypes,
  getJobTypeById,
  updateJobType
} from '../controllers/jobType.controller.js';
import requireAuth from '../middleware/requireAuth.js';

const router = express.Router();

// Lấy danh sách job type
router.get('/', getAllJobTypes);
// Lấy job type theo id
router.get('/:id', getJobTypeById);
// Tạo job type mới
router.post('/', requireAuth, createJobType);
// Cập nhật job type
router.patch('/:id', requireAuth, updateJobType);
// Xóa job type
router.delete('/:id', requireAuth, deleteJobType);

export default router;