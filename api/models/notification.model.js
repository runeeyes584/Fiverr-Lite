import { DataTypes } from "sequelize";

const Notification = (sequelize) =>
  sequelize.define(
    "Notification",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      clerk_id: {
        type: DataTypes.STRING(255),
        allowNull: false,
        references: {
            model: "user_account",
            key: "clerk_id",
          },
      },
      title: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      message: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      is_read: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      gig_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: "gigs",
            key: "id",
          },
      },
      notification_type: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
    },
    {
      tableName: "notifications",
      timestamps: false,
    }
  );

export default Notification;