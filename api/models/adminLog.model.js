import { DataTypes } from "sequelize";

const AdminLog = (sequelize) =>
  sequelize.define(
    "AdminLog",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      admin_clerk_id: {
        type: DataTypes.STRING(255),
        allowNull: false,
        references: {
            model: "user_account",
            key: "clerk_id",
          },
      },
      action: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      gig_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: "gigs",
            key: "id",
          },
      },
      target_clerk_id: {
        type: DataTypes.STRING(255),
        allowNull: true,
        references: {
            model: "user_account",
            key: "clerk_id",
          },
      },
      reason: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      action_date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    {
      tableName: "admin_log",
      timestamps: false,
    }
  );

export default AdminLog;