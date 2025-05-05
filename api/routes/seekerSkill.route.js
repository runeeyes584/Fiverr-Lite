import express from 'express';
import {
  createSeekerSkill,
  deleteSeekerSkill,
  getAllSeekerSkills,
  getSeekerSkillById,
  updateSeekerSkill
} from '../controllers/seekerSkill.controller.js';
import requireAuth from '../middleware/requireAuth.js';

const router = express.Router();

// Lấy danh sách seeker skill
router.get('/', requireAuth, getAllSeekerSkills);
// Lấy seeker skill theo id
router.get('/:id', requireAuth, getSeekerSkillById);
// Tạo seeker skill mới
router.post('/', requireAuth, createSeekerSkill);
// Xóa seeker skill
router.delete('/:id', requireAuth, deleteSeekerSkill);
// Cập nhật seeker skill
router.patch('/:id', requireAuth, updateSeekerSkill);

export default router;