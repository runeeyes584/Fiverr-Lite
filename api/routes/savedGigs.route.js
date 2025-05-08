import express from 'express';
import { getSavedGigs, saveGig, unsaveGig } from '../controllers/savedGigs.controller.js';
import requireAuth from '../middleware/requireAuth.js';

const router = express.Router();

router.get('/', requireAuth, getSavedGigs);

router.post('/:gigId', requireAuth, saveGig);

router.delete('/:gigId', requireAuth, unsaveGig);

export default router;
