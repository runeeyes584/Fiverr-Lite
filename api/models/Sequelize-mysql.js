import dotenv from "dotenv";
import path from "path";
import { Sequelize } from "sequelize";
import { fileURLToPath } from "url";
import models from "./index.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../.env") });

const sequelize = new Sequelize({
  dialect: "mysql",
  host: process.env.DB_HOST || "localhost",
  username: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "10022004",
  database: process.env.DB_NAME || "fiverr_new",
  port: 3306,
});

// Khởi tạo models
const initializedModels = Object.keys(models).reduce((acc, key) => {
  acc[key] = models[key](sequelize);
  return acc;
}, {});

// Định nghĩa quan hệ
const defineRelations = (models) => {
  models.User.hasOne(models.Company, { foreignKey: "clerk_id", sourceKey: "clerk_id", as: "company" });
  models.Company.belongsTo(models.User, { foreignKey: "clerk_id", targetKey: "clerk_id" });

  models.Company.hasMany(models.CompanyImage, { foreignKey: "company_id" });
  models.CompanyImage.belongsTo(models.Company, { foreignKey: "company_id" });

  models.User.hasOne(models.SeekerProfile, { foreignKey: "clerk_id", sourceKey: "clerk_id" });
  models.SeekerProfile.belongsTo(models.User, { foreignKey: "clerk_id", targetKey: "clerk_id" });

  models.User.hasMany(models.ExperienceDetail, { foreignKey: "clerk_id", sourceKey: "clerk_id" });
  models.ExperienceDetail.belongsTo(models.User, { foreignKey: "clerk_id", targetKey: "clerk_id" });

  models.User.hasMany(models.Gig, { foreignKey: "seller_clerk_id", sourceKey: "clerk_id" });
  models.Gig.belongsTo(models.User, { foreignKey: "seller_clerk_id", targetKey: "clerk_id" });

  models.Category.hasMany(models.Gig, { foreignKey: "category_id" });
  models.Gig.belongsTo(models.Category, { foreignKey: "category_id" });

  models.JobType.hasMany(models.Gig, { foreignKey: "job_type_id" });
  models.Gig.belongsTo(models.JobType, { foreignKey: "job_type_id" });

  models.Gig.hasMany(models.Order, { foreignKey: "gig_id" });
  models.Order.belongsTo(models.Gig, { foreignKey: "gig_id" });

  models.User.hasMany(models.Order, { foreignKey: "buyer_clerk_id", sourceKey: "clerk_id", as: "buyer_orders" });
  models.Order.belongsTo(models.User, { foreignKey: "buyer_clerk_id", targetKey: "clerk_id", as: "buyer" });

  models.User.hasMany(models.Order, { foreignKey: "seller_clerk_id", sourceKey: "clerk_id", as: "seller_orders" });
  models.Order.belongsTo(models.User, { foreignKey: "seller_clerk_id", targetKey: "clerk_id", as: "seller" });

  models.Order.hasOne(models.Review, { foreignKey: "order_id" });
  models.Review.belongsTo(models.Order, { foreignKey: "order_id" });

  models.Gig.hasMany(models.Review, { foreignKey: "gig_id" });
  models.Review.belongsTo(models.Gig, { foreignKey: "gig_id" });

  models.User.hasMany(models.Review, { foreignKey: "reviewer_clerk_id", sourceKey: "clerk_id" });
  models.Review.belongsTo(models.User, { foreignKey: "reviewer_clerk_id", targetKey: "clerk_id" });

  models.Order.hasMany(models.Message, { foreignKey: "order_id" });
  models.Message.belongsTo(models.Order, { foreignKey: "order_id" });

  models.User.hasMany(models.Message, { foreignKey: "sender_clerk_id", sourceKey: "clerk_id", as: "sent_messages" });
  models.Message.belongsTo(models.User, { foreignKey: "sender_clerk_id", targetKey: "clerk_id" });

  models.User.hasMany(models.Message, { foreignKey: "receiver_clerk_id", sourceKey: "clerk_id", as: "received_messages" });
  models.Message.belongsTo(models.User, { foreignKey: "receiver_clerk_id", targetKey: "clerk_id" });

  models.Order.hasOne(models.Payment, { foreignKey: "order_id" });
  models.Payment.belongsTo(models.Order, { foreignKey: "order_id" });

  models.User.hasMany(models.Payment, { foreignKey: "buyer_clerk_id", sourceKey: "clerk_id" });
  models.Payment.belongsTo(models.User, { foreignKey: "buyer_clerk_id", targetKey: "clerk_id" });

  models.User.hasMany(models.SavedGig, { foreignKey: "clerk_id", sourceKey: "clerk_id" });
  models.Gig.hasMany(models.SavedGig, { foreignKey: "gig_id" });
  models.SavedGig.belongsTo(models.User, { foreignKey: "clerk_id", targetKey: "clerk_id" });
  models.SavedGig.belongsTo(models.Gig, { foreignKey: "gig_id" });

  models.User.hasMany(models.ContactForm, { foreignKey: "clerk_id", sourceKey: "clerk_id" });
  models.ContactForm.belongsTo(models.User, { foreignKey: "clerk_id", targetKey: "clerk_id" });

  models.User.hasMany(models.AdminLog, { foreignKey: "admin_clerk_id", sourceKey: "clerk_id", as: "admin_logs" });
  models.User.hasMany(models.AdminLog, { foreignKey: "target_clerk_id", sourceKey: "clerk_id", as: "target_logs" });
  models.Gig.hasMany(models.AdminLog, { foreignKey: "gig_id" });
  models.AdminLog.belongsTo(models.User, { foreignKey: "admin_clerk_id", targetKey: "clerk_id" });
  models.AdminLog.belongsTo(models.User, { foreignKey: "target_clerk_id", targetKey: "clerk_id" });
  models.AdminLog.belongsTo(models.Gig, { foreignKey: "gig_id" });

  models.User.belongsToMany(models.Skills, { through: models.SeekerSkill, foreignKey: "clerk_id" });
  models.Skills.belongsToMany(models.User, { through: models.SeekerSkill, foreignKey: "skill_id" });

  models.Gig.belongsToMany(models.Skills, { through: models.GigSkill, foreignKey: "gig_id" });
  models.Skills.belongsToMany(models.Gig, { through: models.GigSkill, foreignKey: "skill_id" });

  models.Gig.hasMany(models.GigView, { foreignKey: "gig_id" });
  models.User.hasMany(models.GigView, { foreignKey: "clerk_id", sourceKey: "clerk_id" });
  models.GigView.belongsTo(models.Gig, { foreignKey: "gig_id" });
  models.GigView.belongsTo(models.User, { foreignKey: "clerk_id", targetKey: "clerk_id" });

  models.Gig.hasOne(models.GigViewCount, { foreignKey: "gig_id" });
  models.GigViewCount.belongsTo(models.Gig, { foreignKey: "gig_id" });

  models.User.hasMany(models.UserSearchHistory, { foreignKey: "clerk_id", sourceKey: "clerk_id" });
  models.Category.hasMany(models.UserSearchHistory, { foreignKey: "category_id" });
  models.JobType.hasMany(models.UserSearchHistory, { foreignKey: "job_type_id" });
  models.UserSearchHistory.belongsTo(models.User, { foreignKey: "clerk_id", targetKey: "clerk_id" });
  models.UserSearchHistory.belongsTo(models.Category, { foreignKey: "category_id" });
  models.UserSearchHistory.belongsTo(models.JobType, { foreignKey: "job_type_id" });

  models.User.hasMany(models.Notification, { foreignKey: "clerk_id", sourceKey: "clerk_id" });
  models.Gig.hasMany(models.Notification, { foreignKey: "gig_id" });
  models.Notification.belongsTo(models.User, { foreignKey: "clerk_id", targetKey: "clerk_id" });
  models.Notification.belongsTo(models.Gig, { foreignKey: "gig_id" });

  models.User.hasMany(models.CVFile, { foreignKey: "clerk_id", sourceKey: "clerk_id" });
  models.CVFile.belongsTo(models.User, { foreignKey: "clerk_id", targetKey: "clerk_id" });

  models.Gig.hasMany(models.GigTranslation, { foreignKey: "gig_id" });
  models.GigTranslation.belongsTo(models.Gig, { foreignKey: "gig_id" });

  models.Conversation.belongsTo(models.User, { foreignKey: "sender_clerk_id", targetKey: "clerk_id", as: "sender" });
  models.Conversation.belongsTo(models.User, { foreignKey: "receiver_clerk_id", targetKey: "clerk_id", as: "receiver" });
};

defineRelations(initializedModels);

// Hook cho trigger after_gig_view_insert
initializedModels.GigView.afterCreate(async (gigView, options) => {
  await initializedModels.GigViewCount.upsert(
    {
      gig_id: gigView.gig_id,
      total_views: sequelize.literal("total_views + 1"),
    },
    { fields: ["total_views"] }
  );
});

export { initializedModels as models, sequelize };
