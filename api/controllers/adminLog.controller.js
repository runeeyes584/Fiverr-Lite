import { models } from '../models/Sequelize-mysql.js';

// Ghi log hành động admin
export const logAdminAction = async (req, res, next) => {
  try {
    const { adminId, action, details } = req.body;

    if (!adminId || !action) {
      return res.status(400).json({ success: false, message: 'Missing required fields: adminId or action' });
    }

    const log = await models.AdminLog.create({
      admin_id: adminId,
      action,
      details: details || null,
      created_at: new Date(),
    });

    console.log(`Admin action logged: admin_id=${adminId}, action=${action}`);
    return res.status(201).json({ success: true, log });
  } catch (err) {
    console.error('Error logging admin action:', err.message);
    return next(err);
  }
};

// Lấy danh sách log admin
export const getAdminLogs = async (req, res, next) => {
  try {
    const logs = await models.AdminLog.findAll();
    return res.status(200).json({ success: true, logs });
  } catch (err) {
    console.error('Error fetching admin logs:', err.message);
    return next(err);
  }
};