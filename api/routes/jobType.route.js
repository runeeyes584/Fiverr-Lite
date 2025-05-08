import express from 'express';
import { createJobType, deleteJobType, getAllJobTypes, getJobTypeById, updateJobType } from '../controllers/jobType.controller.js';
import { authenticateAndLoadUser, isAdmin } from '../middleware/getAuth.js';
import requireAuth from '../middleware/requireAuth.js';

const router = express.Router();

router.get('/', getAllJobTypes);
router.get('/:id', getJobTypeById);
router.post('/', requireAuth, authenticateAndLoadUser, isAdmin, createJobType);
router.put('/:id', requireAuth, authenticateAndLoadUser, isAdmin, updateJobType);
router.delete('/:id', requireAuth, authenticateAndLoadUser, isAdmin, deleteJobType);

export default router;
