
import express from 'express';
import { handleClerkWebhook } from '../controllers/user.controller.js';

const router = express.Router();

router.post(
    '/',
    express.raw({ type: 'application/json' }),
     // Sử dụng express.raw tích hợp sẵn
    handleClerkWebhook
);

export default router;
// Tiến bị ngu