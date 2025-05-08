import express from 'express';
import {
  createSeekerProfile,
  deleteSeekerProfile,
  getAllSeekerProfiles,
  getSeekerProfileById,
  updateSeekerProfile,
} from '../controllers/seekerProfile.controller.js';
import requireAuth from '../middleware/requireAuth.js';

const router = express.Router();

router.post('/', createSeekerProfile);
router.get('/', getAllSeekerProfiles); 
router.get('/:clerk_id', requireAuth, getSeekerProfileById);
router.put('/:clerk_id', requireAuth, updateSeekerProfile);
router.delete('/:clerk_id', requireAuth, deleteSeekerProfile);

export default router;