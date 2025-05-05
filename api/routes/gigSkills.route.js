import express from 'express';
import {
  createGigSkill,
  deleteGigSkill,
  getAllGigSkills,
  getGigSkillById,
} from '../controllers/gigSkills.controller.js';
import requireAuth from '../middleware/requireAuth.js';

const router = express.Router();

// Lấy danh sách tất cả các kỹ năng của gig
router.get('/', getAllGigSkills);
// Lấy kỹ năng của gig theo id
router.get('/:id', getGigSkillById);
// Tạo kỹ năng của gig mới
router.post('/', requireAuth, createGigSkill);
// Xóa kỹ năng của gig
router.delete('/:id', requireAuth, deleteGigSkill);

export default router;