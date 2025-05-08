
import express from 'express';
import { handleClerkWebhook } from '../controllers/user.controller.js';
import { models } from "../models/Sequelize-mysql.js";

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

export default router;
