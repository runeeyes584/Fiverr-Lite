import express from 'express';
import {
  createSavedGig,
  deleteSavedGig,
  getAllSavedGigs,
  getSavedGigById
} from '../controllers/savedGigs.controller.js';
import requireAuth from '../middleware/requireAuth.js';

const router = express.Router();

// Lấy danh sách saved gig
router.get('/', requireAuth, getAllSavedGigs);
// Lấy saved gig theo id
router.get('/:id', requireAuth, getSavedGigById);
// Tạo saved gig mới
router.post('/', requireAuth, createSavedGig);
// Xóa saved gig
router.delete('/:id', requireAuth, deleteSavedGig);

export default router;