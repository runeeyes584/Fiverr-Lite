import express from 'express';
import {createCVFile, getAllCVFiles, getCVFileById, updateCVFile, deleteCVFile} from '../controllers/cvFiles.controller.js';
import requireAuth from '../middleware/requireAuth.js';

const router = express.Router();

// Lấy danh sách tất cả các CV file
router.get('/', getAllCVFiles);
// Lấy CV file theo id
router.get('/:id', getCVFileById);
// Tạo CV file mới
router.post('/', requireAuth, createCVFile);
// Cập nhật CV file
router.patch('/:id', requireAuth, updateCVFile);
// Xóa CV file
router.delete('/:id', requireAuth, deleteCVFile);

export default router;