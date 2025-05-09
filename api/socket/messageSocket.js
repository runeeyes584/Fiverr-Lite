// socket/messageSocket.js
import { models } from '../models/Sequelize-mysql.js';

export default (io) => {
  io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);

    // Khi client gửi tin nhắn mới
    socket.on('sendMessage', async (data) => {
      const { order_id, sender_clerk_id, receiver_clerk_id, message_content } = data;

      if (!order_id || !sender_clerk_id || !receiver_clerk_id || !message_content) {
        return socket.emit('errorMessage', 'Missing required fields');
      }

      try {
        const message = await models.Message.create({
          order_id,
          sender_clerk_id,
          receiver_clerk_id,
          message_content,
        });

        // Gửi lại cho cả người gửi và người nhận (giả định họ cùng trong 1 phòng theo order_id)
        io.to(`order_${order_id}`).emit('newMessage', message);
      } catch (error) {
        console.error('Error saving message:', error.message);
        socket.emit('errorMessage', 'Failed to save message');
      }
    });

    // Tham gia room theo order_id
    socket.on('joinRoom', (order_id) => {
      socket.join(`order_${order_id}`);
      console.log(`Client ${socket.id} joined room order_${order_id}`);
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });
};
