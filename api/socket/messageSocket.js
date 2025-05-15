

// import { sendMessage } from "../controllers/message.controller.js";

// const messageSocketHandler = (io) => {
//   io.on("connection", (socket) => {
//     console.log("🔌 Client connected:", socket.id);

//     socket.on("joinOrder", ({ orderId }) => {
//       socket.join(`order_${orderId}`);
//       console.log(`Client ${socket.id} joined room order_${orderId}`);
//     });

//     socket.on("sendMessage", async (messageData, callback) => {
//       try {
//         const newMessage = await sendMessage(messageData); // Sử dụng controller
//         io.to(`order_${messageData.order_id}`).emit("newMessage", newMessage);
//         callback({ success: true, message: newMessage });
//       } catch (error) {
//         console.error("Error sending message:", error.message);
//         callback({ success: false, error: error.message });
//       }
//     });

//     socket.on("disconnect", () => {
//       console.log("Client disconnected:", socket.id);
//     });
//   });
// };

// export default messageSocketHandler;

import { sendMessage } from "../controllers/message.controller.js";

const messageSocketHandler = (io) => {
  io.on("connection", (socket) => {
    console.log("🔌 Client connected:", socket.id);

    socket.on("joinOrder", ({ orderId }) => {
      if (!orderId) {
        console.error(`Client ${socket.id} provided invalid orderId`);
        return socket.emit("error", { message: "Invalid orderId" });
      }
      socket.join(`order_${orderId}`);
      console.log(`Client ${socket.id} joined room order_${orderId}`);
    });

    socket.on("sendMessage", async (messageData, callback) => {
      try {
        if (!messageData.order_id || !messageData.sender_clerk_id || !messageData.receiver_clerk_id || !messageData.message_content) {
          throw new Error("Missing required fields");
        }
        const newMessage = await sendMessage(messageData);
        if (!newMessage.success) throw new Error(newMessage.message);
        io.to(`order_${messageData.order_id}`).emit("newMessage", newMessage);
        callback({ success: true, message: newMessage });
      } catch (error) {
        console.error("Error sending message:", error.message);
        callback({ success: false, error: error.message });
        socket.emit("error", { message: error.message });
      }
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
    });

    socket.on("error", (error) => {
      console.error(`Socket error for client ${socket.id}:`, error);
    });
  });
};

export default messageSocketHandler;