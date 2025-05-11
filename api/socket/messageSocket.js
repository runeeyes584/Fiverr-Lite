import { sequelize } from "../models/Sequelize-mysql.js";
import MessageModel from "../models/message.model.js";

const Message = MessageModel(sequelize);

const messageSocketHandler = (io) => {
  io.on("connection", (socket) => {
    console.log("🔌 Client connected:", socket.id);

    socket.on("joinRoom", ({ orderId }) => {
      socket.join(`order_${orderId}`);
      console.log(`Client ${socket.id} joined room order_${orderId}`);
    });

    socket.on("sendMessage", async (messageData) => {
      const { order_id, sender_clerk_id, receiver_clerk_id, message_content } = messageData;

      try {
        const newMessage = await Message.create({
          order_id,
          sender_clerk_id,
          receiver_clerk_id,
          message_content,
        });

        io.to(`order_${order_id}`).emit("receiveMessage", newMessage);
      } catch (error) {
        console.error("Lỗi khi gửi tin nhắn:", error.message);
      }
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
    });
  });
};

export default messageSocketHandler;
