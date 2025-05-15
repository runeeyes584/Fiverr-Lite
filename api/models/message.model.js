import { DataTypes } from "sequelize";

const Message = (sequelize) =>
  sequelize.define(
    "Message",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      order_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "orders",
          key: "id",
        },
      },
      ticket_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      ticket_status: {
        type: DataTypes.ENUM("open", "closed"),
        allowNull: false,
        defaultValue: "open",
      },
      sender_clerk_id: {
        type: DataTypes.STRING(255),
        allowNull: false,
        references: {
          model: "user_account",
          key: "clerk_id",
        },
      },
      receiver_clerk_id: {
        type: DataTypes.STRING(255),
        allowNull: false,
        references: {
          model: "user_account",
          key: "clerk_id",
        },
      },
      message_content: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      sent_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      is_read: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
    },
    {
      tableName: "messages",
      timestamps: false,
      indexes: [
        { fields: ["order_id"] }, // Thêm index để tối ưu truy vấn
        { fields: ["ticket_id"] },
      ],
    }
  );

export default Message;