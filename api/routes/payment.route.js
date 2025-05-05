import express from 'express';
import {
  createPayment,
  deletePayment,
  updatePayment,
  getAllPayments,
  getPaymentById
} from '../controllers/payment.controller.js';
import requireAuth from '../middleware/requireAuth.js';

const router = express.Router();

// Lấy danh sách payment
router.get('/', getAllPayments);
// Lấy payment theo id
router.get('/:id', getPaymentById);
// Tạo payment mới
router.post('/', requireAuth, createPayment);
// Cập nhật payment
router.patch('/:id', requireAuth, updatePayment);
// Xóa payment
router.delete('/:id', requireAuth, deletePayment);

export default router;