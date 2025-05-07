
// server.js
import { Clerk } from "@clerk/clerk-sdk-node";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import path from "path";
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


  
app.use(express.json());
app.use(cors({ origin: "http://localhost:5173", credentials: true }));


// Routes
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
app.use("/api/jobTypes", jobTypeRoute);
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
app.use("/api/users", userRoute);
app.use("/api/userSearchHistory", userSearchHistoryRoute);


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