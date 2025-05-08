import express from 'express';
import { createSkill, deleteSkill, getAllSkills, getSkillById, updateSkill } from '../controllers/skills.controller.js';
import { authenticateAndLoadUser, isAdmin } from '../middleware/getAuth.js';
import requireAuth from '../middleware/requireAuth.js';

const router = express.Router();

router.get('/', getAllSkills);
router.get('/:id', getSkillById);
router.post('/', requireAuth, authenticateAndLoadUser, isAdmin, createSkill);
router.put('/:id', requireAuth, authenticateAndLoadUser, isAdmin, updateSkill);
router.delete('/:id', requireAuth, authenticateAndLoadUser, isAdmin, deleteSkill);

export default router;
