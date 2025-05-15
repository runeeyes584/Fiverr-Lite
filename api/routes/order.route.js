import express from 'express';
import {
  createPaymentIntent,
  confirmOrder,
  getOrders,
  updateOrderStatus,
  cancelOrder,
} from '../controllers/order.controller.js';
import requireAuth from '../middleware/requireAuth.js';
import { isSeller, authenticateAndLoadUser } from '../middleware/getAuth.js';

const router = express.Router();

// Lấy danh sách order
router.get('/:clerk_id', requireAuth, authenticateAndLoadUser, getOrders);

// Tạo payment intent
router.post('/payment-intent', requireAuth, authenticateAndLoadUser, createPaymentIntent);

// Xác nhận order
router.post('/confirm', requireAuth, authenticateAndLoadUser, confirmOrder);

// Cập nhật trạng thái đơn hàng
router.put('/:id/status', requireAuth, authenticateAndLoadUser, updateOrderStatus);

// Hủy đơn hàng
router.put('/:id/cancel', requireAuth, authenticateAndLoadUser, cancelOrder);

export default router;