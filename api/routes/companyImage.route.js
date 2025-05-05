import express from 'express';
import {createCompanyImage, getAllCompanyImages, getCompanyImageById, updateCompanyImage, deleteCompanyImage } from '../controllers/companyImage.controller.js';
import requireAuth from '../middleware/requireAuth.js';

const router = express.Router();

// Lấy danh sách company image
router.get('/', getAllCompanyImages);
// Lấy company image theo id
router.get('/:id', getCompanyImageById);
// Tạo company image mới
router.post('/', requireAuth, createCompanyImage);
// Cập nhật company image
router.patch('/:id', requireAuth, updateCompanyImage);
// Xóa company image
router.delete('/:id', requireAuth, deleteCompanyImage);

export default router;