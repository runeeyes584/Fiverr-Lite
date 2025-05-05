import { models } from '../models/Sequelize-mysql.js';

// Tạo tin nhắn
export const createMessage = async (req, res, next) => {
  try {
    const { order_id, sender_clerk_id, receiver_clerk_id, message_content } = req.body;
    if (!order_id || !sender_clerk_id || !receiver_clerk_id || !message_content) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }
    const message = await models.Message.create({
      order_id,
      sender_clerk_id,
      receiver_clerk_id,
      message_content,
    });
    console.log(`Message created: id=${message.id}`);
    return res.status(201).json({ success: true, message: 'Message created successfully', message });
  } catch (error) {
    console.error('Error creating message:', error.message);
    return res.status(500).json({ success: false, message: 'Error creating message', error: error.message });
  }
};

// Lấy tất cả tin nhắn (phân trang)
export const getAllMessages = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, order_id } = req.query;
    if (!order_id) {
      return res.status(400).json({ success: false, message: 'Missing required query: order_id' });
    }
    const offset = (page - 1) * limit;
    const messages = await models.Message.findAndCountAll({
      where: { order_id },
      limit: parseInt(limit),
      offset: parseInt(offset),
    });
    return res.status(200).json({
      success: true,
      total: messages.count,
      pages: Math.ceil(messages.count / limit),
      messages: messages.rows,
    });
  } catch (error) {
    console.error('Error fetching messages:', error.message);
    return res.status(500).json({ success: false, message: 'Error fetching messages', error: error.message });
  }
};

// Lấy tin nhắn theo ID
export const getMessageById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const message = await models.Message.findByPk(id);
    if (!message) {
      return res.status(404).json({ success: false, message: 'Message not found' });
    }
    return res.status(200).json({ success: true, message });
  } catch (error) {
    console.error('Error fetching message:', error.message);
    return res.status(500).json({ success: false, message: 'Error fetching message', error: error.message });
  }
};

// Xóa tin nhắn
export const deleteMessage = async (req, res, next) => {
  try {
    const { id } = req.params;
    const message = await models.Message.findByPk(id);
    if (!message) {
      return res.status(404).json({ success: false, message: 'Message not found' });
    }
    await message.destroy();
    console.log(`Message deleted: id=${id}`);
    return res.status(200).json({ success: true, message: 'Message deleted successfully' });
  } catch (error) {
    console.error('Error deleting message:', error.message);
    return res.status(500).json({ success: false, message: 'Error deleting message', error: error.message });
  }
};