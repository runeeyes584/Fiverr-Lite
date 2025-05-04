// // server.js
// import { Clerk } from "@clerk/clerk-sdk-node";
// import cors from "cors";
// import dotenv from "dotenv";
// import express from "express";
// import { Sequelize } from "sequelize";
// import conversationRoute from "./routes/conversation.route.js";
// import gigRoute from "./routes/gig.route.js";
// import messageRoute from "./routes/message.route.js";
// import orderRoute from "./routes/order.route.js";
// import reviewRoute from "./routes/review.route.js";
// import userRoute from "./routes/user.route.js";

// dotenv.config();

// const app = express();

// const clerk = new Clerk({ apiKey: process.env.CLERK_SECRET_KEY });

// // Cấu hình Sequelize
// export const sequelize = new Sequelize({
//   dialect: "mysql",
//   host: process.env.DB_HOST || "localhost",
//   username: process.env.DB_USER || "root",
//   password: process.env.DB_PASSWORD || "151004abyss",
//   database: process.env.DB_NAME || "jobSearch",
//   port: 3306,
// });

// // Import và khởi tạo models
// import * as models from "./models/index.js";
// Object.values(models).forEach((model) => {
//   if (typeof model === "function") {
//     model(sequelize);
//   }
// });

// // Kiểm tra kết nối Sequelize
// sequelize
//   .authenticate()
//   .then(() => {
//     console.log("Đã kết nối MySQL với Sequelize");
//   })
//   .catch((err) => {
//     console.error("Lỗi kết nối MySQL:", err);
//   });

// app.use(cors({ origin: "http://localhost:5173", credentials: true }));
// app.use(express.json());

// // Routes
// app.use("/api/users", userRoute);
// app.use("/api/gigs", gigRoute);
// app.use("/api/orders", orderRoute);
// app.use("/api/conversations", conversationRoute);
// app.use("/api/messages", messageRoute);
// app.use("/api/reviews", reviewRoute);

// // Error handling middleware
// app.use((err, req, res, next) => {
//   const errorStatus = err.status || 500;
//   const errorMessage = err.message || "Something went wrong!";
//   return res.status(errorStatus).send(errorMessage);
// });

// // Đồng bộ database và khởi động server
// sequelize
//   .sync({ force: false }) // Không xóa bảng hiện có
//   .then(() => {
//     console.log("Database synced successfully");
//     app.listen(8800, () => {
//       console.log("Backend server is running on port 8800!");
//     });
//   })
//   .catch((err) => {
//     console.error("Lỗi đồng bộ database:", err);
//   });

// server.js
import { Clerk } from "@clerk/clerk-sdk-node";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import path from "path";
import { sequelize, models } from "./models/mySQL-db.js";
import conversationRoute from "./routes/conversation.route.js";
import gigRoute from "./routes/gig.route.js";
import messageRoute from "./routes/message.route.js";
import orderRoute from "./routes/order.route.js";
import reviewRoute from "./routes/review.route.js";
import userRoute from "./routes/user.route.js";

// Tải file .env từ thư mục hiện tại
dotenv.config({ path: path.resolve(process.cwd(), ".env") });

const app = express();

const clerk = new Clerk({ apiKey: process.env.CLERK_SECRET_KEY });

// Kiểm tra kết nối Sequelize
sequelize
  .authenticate()
  .then(() => {
    console.log("Đã kết nối MySQL với Sequelize");
  })
  .catch((err) => {
    console.error("Lỗi kết nối MySQL:", err.message);
  });

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());

// Routes
app.use("/api/users", userRoute);
app.use("/api/gigs", gigRoute);
app.use("/api/orders", orderRoute);
app.use("/api/conversations", conversationRoute);
app.use("/api/messages", messageRoute);
app.use("/api/reviews", reviewRoute);

// Error handling middleware
app.use((err, req, res, next) => {
  const errorStatus = err.status || 500;
  const errorMessage = err.message || "Something went wrong!";
  return res.status(errorStatus).send(errorMessage);
});

// Đồng bộ database và khởi động server
sequelize
  .sync({ force: false })
  .then(() => {
    console.log("Database synced successfully");
    app.listen(8800, () => {
      console.log("Backend server is running on port 8800!");
    });
  })
  .catch((err) => {
    console.error("Lỗi đồng bộ database:", err.message);
  });