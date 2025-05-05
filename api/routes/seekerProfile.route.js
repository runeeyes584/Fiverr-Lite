import express from 'express';
import {
  createSeekerProfile,
  deleteSeekerProfile,
  updateSeekerProfile,
  getAllSeekerProfiles,
  getSeekerProfileById
} from '../controllers/seekerProfile.controller.js';
import requireAuth from '../middleware/requireAuth.js';

const router = express.Router();

// Lấy danh sách seeker profile
router.get('/', getAllSeekerProfiles);
// Lấy seeker profile theo id
router.get('/:id', getSeekerProfileById);
// Tạo seeker profile mới
router.post('/', requireAuth, createSeekerProfile);
// Cập nhật seeker profile
router.patch('/:id', requireAuth, updateSeekerProfile);
// Xóa seeker profile
router.delete('/:id', requireAuth, deleteSeekerProfile);

export default router;