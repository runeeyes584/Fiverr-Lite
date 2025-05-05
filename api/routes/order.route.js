import express from 'express';
import {
  createPaymentIntent,
  confirmOrder,
  getOrders  
} from '../controllers/order.controller.js';
import requireAuth from '../middleware/requireAuth.js';

const router = express.Router();

// Lấy danh sách order
router.get('/', requireAuth, getOrders);
// Tạo payment intent
router.post('/payment-intent', requireAuth, createPaymentIntent);
// Xác nhận order
router.post('/confirm', requireAuth, confirmOrder);


export default router;