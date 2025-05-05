import express from 'express';
import {
  createSkill,
  deleteSkill,
  getAllSkills,
  getSkillById,
  updateSkill
} from '../controllers/skills.controller.js';
import requireAuth from '../middleware/requireAuth.js';

const router = express.Router();

// Lấy danh sách skill
router.get('/', getAllSkills);
// Lấy skill theo id
router.get('/:id', getSkillById);
// Tạo skill mới
router.post('/', requireAuth, createSkill);
// Cập nhật skill
router.patch('/:id', requireAuth, updateSkill);
// Xóa skill
router.delete('/:id', requireAuth, deleteSkill);

export default router;