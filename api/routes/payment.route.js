import express from 'express';
import { createVNPayUrl, handleVNPayReturn } from '../controllers/payment.controller.js';

const router = express.Router();

router.post('/create-qr', createVNPayUrl);
router.get('/check-payment-vnpay', handleVNPayReturn);

export default router;
