const mongoose = require("mongoose");
const { Sequelize, DataTypes } = require("sequelize");
const dotenv = require("dotenv");
const path = require("path");

// Tải file .env từ thư mục cha
dotenv.config({ path: path.resolve(__dirname, "../.env") });

// Kết nối MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log("Kết nối MongoDB thành công");
}).catch((err) => {
  console.error("Lỗi kết nối MongoDB:", err.message);
});

// Kết nối Sequelize
const sequelize = new Sequelize({
  dialect: "mysql",
  host: process.env.DB_HOST || "localhost",
  username: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "151004abyss",
  database: process.env.DB_NAME || "jobSearch_migrate",
  port: 3306,
});

// Định nghĩa Mongoose schemas
const UserSchema = new mongoose.Schema({
  clerk_id: String,
  user_type_id: Number,
  email: String,
  username: String,
  country: String,
  description: String,
  is_seller: Boolean,
  created_at: Date,
  updated_at: Date,
  date_of_birth: Date,
  gender: Number,
  is_active: Boolean,
  contact_number: String,
  user_image: String,
  registration_date: Date,
  last_password_updated: Date,
}, { timestamps: false });

const ConversationSchema = new mongoose.Schema({
  sellerId: String,
  buyerId: String,
  readBySeller: Boolean,
  readByBuyer: Boolean,
  lastMessage: String,
}, { timestamps: true });

const MessageSchema = new mongoose.Schema({
  conversationId: String,
  userId: String,
  desc: String,
}, { timestamps: true });

const ReviewSchema = new mongoose.Schema({
  gigId: String,
  userId: String,
  star: Number,
  desc: String,
}, { timestamps: true });

const GigSchema = new mongoose.Schema({
  userId: String,
  title: String,
  desc: String,
  totalStars: Number,
  starNumber: Number,
  cat: String,
  price: Number,
  cover: String,
  images: [String],
  shortTitle: String,
  shortDesc: String,
  deliveryTime: Number,
  revisionNumber: Number,
  features: [String],
  sales: Number,
}, { timestamps: true });

const OrderSchema = new mongoose.Schema({
  gigId: String,
  img: String,
  title: String,
  price: Number,
  sellerId: String,
  buyerId: String,
  isCompleted: Boolean,
  payment_intent: String,
}, { timestamps: true });

// Định nghĩa Mongoose models
const UserMongo = mongoose.model("User", UserSchema);
const ConversationMongo = mongoose.model("Conversation", ConversationSchema);
const MessageMongo = mongoose.model("Message", MessageSchema);
const ReviewMongo = mongoose.model("Review", ReviewSchema);
const GigMongo = mongoose.model("Gig", GigSchema);
const OrderMongo = mongoose.model("Order", OrderSchema);

// Import Sequelize models
const User = require("../models/user.model.js");
const Conversation = require("../models/conversation.model.js");
const Message = require("../models/message.model.js");
const Review = require("../models/review.model.js");
const Gig = require("../models/gig.model.js");
const Order = require("../models/order.model.js");

async function migrate() {
  try {
    // Kiểm tra kết nối MySQL
    await sequelize.authenticate();
    console.log("Kết nối MySQL thành công");

    // Khởi tạo Sequelize models
    const initializedModels = {
      User: User(sequelize),
      Conversation: Conversation(sequelize),
      Message: Message(sequelize),
      Review: Review(sequelize),
      Gig: Gig(sequelize),
      Order: Order(sequelize),
    };

    // Đồng bộ bảng MySQL (thận trọng: xóa dữ liệu hiện có)
    await sequelize.sync({ force: true }); // force: true sẽ xóa tất cả dữ liệu trong bảng trước khi đồng bộ
    console.log("Đồng bộ bảng MySQL thành công");

    // Migrate Users
    const users = await UserMongo.find();
    for (const user of users) {
      await initializedModels.User.create({
        clerk_id: user.clerk_id,
        user_type_id: user.user_type_id || 1,
        email: user.email,
        username: user.username,
        country: user.country || "Unknown",
        description: user.description,
        is_seller: user.is_seller || false,
        created_at: user.created_at || new Date(),
        updated_at: user.updated_at || new Date(),
        date_of_birth: user.date_of_birth,
        gender: user.gender,
        is_active: user.is_active !== undefined ? user.is_active : true,
        contact_number: user.contact_number,
        user_image: user.user_image,
        registration_date: user.registration_date || new Date().toISOString().slice(0, 10),
        last_password_updated: user.last_password_updated,
      });
    }
    console.log(`Migrated ${users.length} Users`);

    // Migrate Gigs
    const gigs = await GigMongo.find();
    for (const gig of gigs) {
      await initializedModels.Gig.create({
        userId: parseInt(gig.userId),
        title: gig.title,
        desc: gig.desc,
        totalStars: gig.totalStars || 0,
        starNumber: gig.starNumber || 0,
        cat: gig.cat,
        price: gig.price,
        cover: gig.cover,
        images: gig.images,
        shortTitle: gig.shortTitle,
        shortDesc: gig.shortDesc,
        deliveryTime: gig.deliveryTime,
        revisionNumber: gig.revisionNumber,
        features: gig.features,
        sales: gig.sales || 0,
        createdAt: gig.createdAt,
        updatedAt: gig.updatedAt,
      });
    }
    console.log(`Migrated ${gigs.length} Gigs`);

    // Migrate Conversations
    const conversations = await ConversationMongo.find();
    for (const conv of conversations) {
      await initializedModels.Conversation.create({
        sellerId: parseInt(conv.sellerId),
        buyerId: parseInt(conv.buyerId),
        readBySeller: conv.readBySeller || false,
        readByBuyer: conv.readByBuyer || false,
        lastMessage: conv.lastMessage,
        createdAt: conv.createdAt,
        updatedAt: conv.updatedAt,
      });
    }
    console.log(`Migrated ${conversations.length} Conversations`);

    // Migrate Messages
    const messages = await MessageMongo.find();
    for (const msg of messages) {
      await initializedModels.Message.create({
        conversationId: parseInt(msg.conversationId),
        userId: parseInt(msg.userId),
        desc: msg.desc,
        createdAt: msg.createdAt,
        updatedAt: msg.updatedAt,
      });
    }
    console.log(`Migrated ${messages.length} Messages`);

    // Migrate Reviews
    const reviews = await ReviewMongo.find();
    for (const review of reviews) {
      await initializedModels.Review.create({
        gigId: parseInt(review.gigId),
        userId: parseInt(review.userId),
        star: review.star,
        desc: review.desc,
        createdAt: review.createdAt,
        updatedAt: review.updatedAt,
      });
    }
    console.log(`Migrated ${reviews.length} Reviews`);

    // Migrate Orders
    const orders = await OrderMongo.find();
    for (const order of orders) {
      await initializedModels.Order.create({
        gigId: parseInt(order.gigId),
        img: order.img,
        title: order.title,
        price: order.price,
        sellerId: parseInt(order.sellerId),
        buyerId: parseInt(order.buyerId),
        isCompleted: order.isCompleted || false,
        payment_intent: order.payment_intent,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
      });
    }
    console.log(`Migrated ${orders.length} Orders`);

    console.log("Migration completed successfully!");
  } catch (err) {
    console.error("Migration failed:", err.message);
    console.error("Stack trace:", err.stack);
  } finally {
    await mongoose.connection.close();
    await sequelize.close();
  }
}

migrate();

// Code này sẽ kết nối đến MongoDB và MySQL, sau đó thực hiện quá trình migrate dữ liệu từ MongoDB sang MySQL.
//Dùng cho trường hợp máy có cài MongoDB và có dữ liệu trong MongoDB => không cần chạy init-db.js
// Chạy file này để migrate dữ liệu từ MongoDB sang MySQL (node /migrate/migrate.js) vì .env nằm ngoài thư mục api