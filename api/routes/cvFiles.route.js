import express from 'express';
import {
    createCVFile,
    deleteCVFile,
    getCVFileById,
    getCVFilesByClerkId,
    updateCVFile
} from '../controllers/cvFiles.controller.js';
import requireAuth from '../middleware/requireAuth.js';

const router = express.Router();

router.post('/', requireAuth, createCVFile);
router.get('/user/:clerk_id', requireAuth, getCVFilesByClerkId);
router.get('/:id', requireAuth, getCVFileById);
router.put('/:id', requireAuth, updateCVFile);
router.delete('/:id', requireAuth, deleteCVFile);

export default router;