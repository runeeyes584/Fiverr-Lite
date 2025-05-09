import express from 'express';
import { createCompany, getAllCompanies, getCompanyById, updateCompany, deleteCompany } from '../controllers/company.controller.js';
import requireAuth from '../middleware/requireAuth.js';
import { authenticateAndLoadUser, isAdmin } from '../middleware/getAuth.js';

const router = express.Router();

// Lấy danh sách tất cả các công ty
router.get('/', getAllCompanies);
// Lấy công ty theo id
router.get('/:id', getCompanyById);
// Tạo công ty mới
router.post('/', requireAuth, authenticateAndLoadUser, isAdmin, createCompany);
// Cập nhật công ty
router.patch('/:id', requireAuth, authenticateAndLoadUser, isAdmin, updateCompany);
// Xóa công ty
router.delete('/:id', requireAuth, authenticateAndLoadUser, isAdmin, deleteCompany);

export default router;