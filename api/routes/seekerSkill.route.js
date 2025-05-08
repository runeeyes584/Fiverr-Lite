import express from 'express';
import {
  createSeekerSkill,
  deleteSeekerSkill,
  getAllSeekerSkills,
  getSeekersBySkillId,
  getSeekerSkillById,
  getSkillsByClerkId,
  updateSeekerSkill
} from '../controllers/seekerSkill.controller.js';
import requireAuth from '../middleware/requireAuth.js';

const router = express.Router();

router.post('/', requireAuth, createSeekerSkill);
router.get('/', requireAuth, getAllSeekerSkills);
router.get('/:id', requireAuth, getSeekerSkillById);
router.put('/:id', requireAuth, updateSeekerSkill);
router.delete('/:id', requireAuth, deleteSeekerSkill);
router.get('/clerk/:clerk_id', requireAuth, getSkillsByClerkId);
router.get('/skill/:skill_id', requireAuth, getSeekersBySkillId);

export default router;