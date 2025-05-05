import express from 'express';
import {
  createGigTranslation,
  deleteGigTranslation,
  getAllGigTranslations,
  getGigTranslationById,
  updateGigTranslation
} from '../controllers/gigTranslation.controller.js';
import requireAuth from '../middleware/requireAuth.js';

const router = express.Router();

// Lấy danh sách gig skill
router.get('/', getAllGigTranslations);
// Lấy gig skill theo id
router.get('/:id', getGigTranslationById);
// Tạo gig skill mới
router.post('/', requireAuth, createGigTranslation);
// Cập nhật gig skill
router.patch('/:id', requireAuth, updateGigTranslation);
// Xóa gig skill
router.delete('/:id', requireAuth, deleteGigTranslation);

export default router;