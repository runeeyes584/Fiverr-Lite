import express from 'express';
import {createContactForm, getContactFormsByUser, updateContactForm, deleteContactForm} from '../controllers/contactForm.controller.js';
import requireAuth from '../middleware/requireAuth.js';

const router = express.Router();


// Lấy tất cả contact forms theo clerk_id
router.get('/clerk/:clerk_id', getContactFormsByUser);

// Tạo contact form mới theo clerk_id
router.post('/clerk/:clerk_id', requireAuth, createContactForm);

// Xóa contact form theo ID
router.delete('/:id', requireAuth, deleteContactForm);

export default router;