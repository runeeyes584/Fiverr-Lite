import express from 'express';
import { createCategory, deleteCategory, getAllCategories, getCategoryById, updateCategory } from '../controllers/category.controller.js';
import { authenticateAndLoadUser, isAdmin } from '../middleware/getAuth.js';
import requireAuth from '../middleware/requireAuth.js';

const router = express.Router();

router.get('/', getAllCategories);
router.get('/:id', getCategoryById);
router.post('/', requireAuth, authenticateAndLoadUser, isAdmin, createCategory);
router.put('/:id', requireAuth, authenticateAndLoadUser, isAdmin, updateCategory);
router.delete('/:id', requireAuth, authenticateAndLoadUser, isAdmin, deleteCategory);

export default router;
