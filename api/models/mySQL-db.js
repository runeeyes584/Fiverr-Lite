import { Sequelize, DataTypes } from "sequelize";
import dotenv from "dotenv";
import path from "path";
import User from "./user.model.js";
import { fileURLToPath } from "url";

// dotenv.config({ path: path.resolve(__dirname, "../.env") });// lệnh này sẽ tải file .env từ thư mục cha (commonJS)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../.env") });
//lấy directory của file hiện tại (ES6 module)


const sequelize = new Sequelize({
  dialect: "mysql",
  host: process.env.DB_HOST || "localhost",
  username: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "151004abyss",
  database: process.env.DB_NAME || "fiverr_mysql",
  port: 3306,
});

// ĐỊNH NGHĨA MODELS
const models = {
  User: User(sequelize),
  Conversation: sequelize.define(
    "Conversation",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      sellerId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "user_account",
          key: "id",
        },
      },
      buyerId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "user_account",
          key: "id",
        },
      },
      readBySeller: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      readByBuyer: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      lastMessage: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
        onUpdate: sequelize.literal("CURRENT_TIMESTAMP"),
      },
    },
    {
      tableName: "conversations",
      timestamps: true,
    }
  ),
  Message: sequelize.define(
    "Message",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      conversationId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "conversations",
          key: "id",
        },
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "user_account",
          key: "id",
        },
      },
      desc: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
        onUpdate: sequelize.literal("CURRENT_TIMESTAMP"),
      },
    },
    {
      tableName: "messages",
      timestamps: true,
    }
  ),
  Review: sequelize.define(
    "Review",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      gigId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "gigs",
          key: "id",
        },
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "user_account",
          key: "id",
        },
      },
      star: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          min: 1,
          max: 5,
        },
      },
      desc: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
        onUpdate: sequelize.literal("CURRENT_TIMESTAMP"),
      },
    },
    {
      tableName: "reviews",
      timestamps: true,
      indexes: [
        {
          unique: true,
          fields: ["gigId", "userId"],
        },
      ],
    }
  ),
  Gig: sequelize.define(
    "Gig",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "user_account",
          key: "id",
        },
      },
      title: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      desc: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      totalStars: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      starNumber: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      cat: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: {
          min: 0,
        },
      },
      cover: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      images: {
        type: DataTypes.JSON,
        allowNull: true,
      },
      shortTitle: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      shortDesc: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      deliveryTime: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          min: 0,
        },
      },
      revisionNumber: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          min: 0,
        },
      },
      features: {
        type: DataTypes.JSON,
        allowNull: true,
      },
      sales: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
        onUpdate: sequelize.literal("CURRENT_TIMESTAMP"),
      },
    },
    {
      tableName: "gigs",
      timestamps: true,
    }
  ),
  Order: sequelize.define(
    "Order",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      gigId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "gigs",
          key: "id",
        },
      },
      img: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      title: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: {
          min: 0,
        },
      },
      sellerId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "user_account",
          key: "id",
        },
      },
      buyerId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "user_account",
          key: "id",
        },
      },
      isCompleted: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      payment_intent: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
        onUpdate: sequelize.literal("CURRENT_TIMESTAMP"),
      },
    },
    {
      tableName: "orders",
      timestamps: true,
    }
  ),
};

// Định nghĩa quan hệ
models.Conversation.belongsTo(models.User, {
  foreignKey: "sellerId",
  as: "seller",
});
models.Conversation.belongsTo(models.User, {
  foreignKey: "buyerId",
  as: "buyer",
});

models.Message.belongsTo(models.Conversation, {
  foreignKey: "conversationId",
});
models.Message.belongsTo(models.User, {
  foreignKey: "userId",
});

models.Review.belongsTo(models.Gig, {
  foreignKey: "gigId",
});
models.Review.belongsTo(models.User, {
  foreignKey: "userId",
});

models.Gig.belongsTo(models.User, {
  foreignKey: "userId",
});

models.Order.belongsTo(models.Gig, {
  foreignKey: "gigId",
});
models.Order.belongsTo(models.User, {
  foreignKey: "sellerId",
  as: "seller",
});
models.Order.belongsTo(models.User, {
  foreignKey: "buyerId",
  as: "buyer",
});

export { sequelize, models };

//index.js, init-db.js, mySQL-db.js dành cho việc khởi tạo database và models của MySQL 
//trong trường hợp không có script của MongoDB và không cài MongoDB => xem file init-db.js