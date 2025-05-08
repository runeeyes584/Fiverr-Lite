
import express from 'express';
import { handleClerkWebhook, updateUser, deleteUser, createUser } from '../controllers/user.controller.js';
import { models } from "../models/Sequelize-mysql.js";
import requireAuth from '../middleware/requireAuth.js';

const router = express.Router();
// Webhook từ Clerk
router.post('/', express.raw({ type: 'application/json' }),handleClerkWebhook);

router.get("/", async (req, res, next) => {
    try {
      const users = await models.User.findAll();
      res.status(200).json(users);
    } catch (err) {
      next(err);
    }
  });

  // Cập nhật user (cho kiểm tra)
router.post('/create', createUser);
router.patch('/:clerkId', updateUser);
router.delete('/:clerkId', deleteUser);


export default router;
