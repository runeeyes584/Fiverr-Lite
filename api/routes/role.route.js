
import express from 'express';
import { setUserRole } from '../controllers/role.controller.js';

const router = express.Router();

router.post('/set-role', setUserRole);

export default router;
