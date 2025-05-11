import { sequelize } from "../models/Sequelize-mysql.js";
import MessageModel from "../models/message.model.js";

const Message = MessageModel(sequelize);

export const createMessage = async (req, res) => {
  try {
    const { order_id, sender_clerk_id, receiver_clerk_id, message_content } = req.body;

    const newMessage = await Message.create({
      order_id,
      sender_clerk_id,
      receiver_clerk_id,
      message_content,
    });

    res.status(201).json(newMessage);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getMessagesByOrder = async (req, res) => {
  try {
    const { orderId } = req.params;

    const messages = await Message.findAll({
      where: { order_id: orderId },
      order: [['sent_at', 'ASC']],
    });

    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
