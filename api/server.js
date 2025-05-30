
import { Clerk } from "@clerk/clerk-sdk-node";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import http from "http";
import path from "path";
import { Server } from "socket.io";
import { sequelize } from "./models/Sequelize-mysql.js";
import adminLogRoute from "./routes/adminLog.route.js";
import categoryRoute from "./routes/category.route.js";
import companyRoute from "./routes/company.route.js";
import companyImageRoute from "./routes/companyImage.route.js";
import contactFormRoute from "./routes/contactForm.route.js";
import cvFilesRoute from "./routes/cvFiles.route.js";
import experienceDetailRoute from "./routes/experienceDetail.route.js";
import gigRoute from "./routes/gig.route.js";
import gigSkillsRoute from "./routes/gigSkills.route.js";
import gigTranslationRoute from "./routes/gigTranslation.route.js";
import gigViewCountsRoute from "./routes/gigViewCounts.route.js";
import gigViewsRoute from "./routes/gigViews.route.js";
import jobTypeRoute from "./routes/jobType.route.js";
import messageRoute from "./routes/message.route.js";
import notificationRoute from "./routes/notification.route.js";
import orderRoute from "./routes/order.route.js";
import paymentRoute from "./routes/payment.route.js";
import reviewRoute from "./routes/review.route.js";
import roleRoute from "./routes/role.route.js";
import savedGigsRoute from "./routes/savedGigs.route.js";
import seekerProfileRoute from "./routes/seekerProfile.route.js";
import seekerSkillRoute from "./routes/seekerSkill.route.js";
import skillsRoute from "./routes/skills.route.js";
import userRoute from "./routes/user.route.js";
import userSearchHistoryRoute from "./routes/userSearchHistory.route.js";
import messageSocketHandler from "./socket/messageSocket.js";
import { initSocket } from "./controllers/message.controller.js";

// .env
dotenv.config({ path: path.resolve(process.cwd(), ".env") });

const app = express();
const clerk = new Clerk({ secretKey: process.env.CLERK_SECRET_KEY });
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173", "https://*.ngrok-free.app"],
    credentials: true,
  },
});



// Sequelize connection check
sequelize.authenticate()
  .then(() => console.log("Đã kết nối MySQL với Sequelize"))
  .catch((err) => console.error("Lỗi kết nối MySQL:", err.message));

app.use(cors({ origin: "http://localhost:5173", credentials: true }));

app.use("/api/users", userRoute);

app.use(express.json());

// Routes
app.get('/payment-success', (req, res) => {
  res.send('<h1>✅ Thanh toán thành công! Cảm ơn bạn đã sử dụng dịch vụ.</h1>');
});

app.get('/payment-failed', (req, res) => {
  res.send('<h1>❌ Thanh toán thất bại! Vui lòng thử lại hoặc liên hệ hỗ trợ.</h1>');
});
app.use("/api/adminLog", adminLogRoute);
app.use("/api/categories", categoryRoute);
app.use("/api/companies", companyRoute);
app.use("/api/companyImages", companyImageRoute);
app.use("/api/contactForms", contactFormRoute);
app.use("/api/cvFiles", cvFilesRoute);
app.use("/api/experienceDetails", experienceDetailRoute);
app.use("/api/gigs", gigRoute);
app.use("/api/gigSkills", gigSkillsRoute);
app.use("/api/gigTranslations", gigTranslationRoute);
app.use("/api/gigViewCounts", gigViewCountsRoute);
app.use("/api/gigViews", gigViewsRoute);
app.use("/api/job-types", jobTypeRoute);
app.use("/api/messages", messageRoute);
app.use("/api/notifications", notificationRoute);
app.use("/api/orders", orderRoute);
app.use("/api/payments", paymentRoute);
app.use("/api/reviews", reviewRoute);
app.use("/api/role", roleRoute);
app.use("/api/savedGigs", savedGigsRoute);
app.use("/api/seekerProfiles", seekerProfileRoute);
app.use("/api/seekerSkills", seekerSkillRoute);
app.use("/api/skills", skillsRoute);
app.use("/api/userSearchHistory", userSearchHistoryRoute);

// Error middleware
app.use((err, req, res, next) => {
  const errorStatus = err.status || 500;
  const errorMessage = err.message || "Something went wrong!";
  return res.status(errorStatus).send(errorMessage);
});

// Socket handler
initSocket(io);
messageSocketHandler(io);

// Sync database & start server
sequelize
  .sync({ force: false })
  .then(() => {
    console.log("Database synced successfully");
    server.listen(8800, () => {
      console.log("Backend server is running on port 8800!");
    });
  })
  .catch((err) => console.error("Lỗi đồng bộ database:", err.message));
