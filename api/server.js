import { Clerk } from "@clerk/clerk-sdk-node";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import mysql from "mysql2";
import authRoute from "./routes/auth.route.js";
import conversationRoute from "./routes/conversation.route.js";
import gigRoute from "./routes/gig.route.js";
import messageRoute from "./routes/message.route.js";
import orderRoute from "./routes/order.route.js";
import reviewRoute from "./routes/review.route.js";
import userRoute from "./routes/user.route.js";

const app = express();
dotenv.config();

const clerk = new Clerk({ apiKey: process.env.CLERK_SECRET_KEY });

// Cấu hình kết nối MySQL
const db = mysql.createConnection({
  host: 'localhost',   // Địa chỉ máy chủ MySQL
  user: 'root',        // Tên đăng nhập MySQL
  password: '10022004',  // Mật khẩu MySQL
  database: 'jobSearch_new',  // Tên cơ sở dữ liệu bạn muốn kết nối
  port: 3306,  // Cổng mặc định của MySQL
  multipleStatements: true // Cho phép thực thi nhiều câu lệnh SQL
});

// Kết nối MySQL
export db.connect((err) => {
  if (err) {
    console.error('Lỗi kết nối MySQL:', err.stack);
    return;
  }
  console.log('Đã kết nối MySQL với ID ' + db.threadId);
});

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/gigs", gigRoute);
app.use("/api/orders", orderRoute);
app.use("/api/conversations", conversationRoute);
app.use("/api/messages", messageRoute);
app.use("/api/reviews", reviewRoute);

app.use((err, req, res, next) => {
  const errorStatus = err.status || 500;
  const errorMessage = err.message || "Something went wrong!";

  return res.status(errorStatus).send(errorMessage);
});

app.get("/api/users", async (req, res) => {
  try {
    const users = await clerk.users.getUserList();
    res.status(200).json(users);
  } catch (error) {
    console.error("Lỗi khi lấy danh sách người dùng:", error);
    res.status(500).json({ error: "Lỗi server khi lấy danh sách người dùng" });
  }
});

app.listen(8800, () => {
  console.log("Backend server is running!");
});
