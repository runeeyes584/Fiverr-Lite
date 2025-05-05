import express from 'express';
import {createCategory, getAllCategories, getCategoryById, updateCategory, deleteCategory} from '../controllers/category.controller.js';
import requireAuth from '../middleware/requireAuth.js';

const router = express.Router();

// Lấy danh sách tất cả các danh mục
router.get('/', getAllCategories);
// Lấy danh mục theo id
router.get('/:id', getCategoryById);
// Tạo danh mục mới
router.post('/', requireAuth, createCategory);
// Cập nhật danh mục
router.patch('/:id', requireAuth, updateCategory);
// Xóa danh mục
router.delete('/:id', requireAuth, deleteCategory);


export default router;