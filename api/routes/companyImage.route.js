import express from 'express';
import {createCompanyImage, getAllCompanyImages, updateCompanyImage, deleteCompanyImage } from '../controllers/companyImage.controller.js';
import requireAuth from '../middleware/requireAuth.js';
import { authenticateAndLoadUser, isAdmin } from '../middleware/getAuth.js';
const router = express.Router();


// Lấy tất cả ảnh công ty theo company_id
router.get('/company/:company_id', getAllCompanyImages);

// Tạo company image mới cho một company_id cụ thể
router.post('/company/:company_id', requireAuth, authenticateAndLoadUser, isAdmin, createCompanyImage);

// Cập nhật company image theo ID
router.patch('/:id', requireAuth, authenticateAndLoadUser, isAdmin,updateCompanyImage);

// Xóa company image theo ID
router.delete('/:id', requireAuth, authenticateAndLoadUser, isAdmin, deleteCompanyImage);

export default router;