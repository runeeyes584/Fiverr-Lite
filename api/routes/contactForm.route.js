import express from 'express';
import {createContactForm, getAllContactForms, getContactFormById, updateContactForm, deleteContactForm} from '../controllers/contactForm.controller.js';
import requireAuth from '../middleware/requireAuth.js';

const router = express.Router();

// Lấy danh sách tất cả các contact form
router.get('/', getAllContactForms);
// Lấy contact form theo id
router.get('/:id', getContactFormById);
// Tạo contact form mới
router.post('/', createContactForm);
// Cập nhật contact form
router.patch('/:id', requireAuth, updateContactForm);
// Xóa contact form
router.delete('/:id', requireAuth, deleteContactForm);

export default router;