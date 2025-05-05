import { DataTypes } from "sequelize";

const UserSearchHistory = (sequelize) =>
  sequelize.define(
    "UserSearchHistory",
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
      search_keyword: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      category_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: "category",
            key: "id",
          },
      },
      job_type_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: "job_type",
            key: "id",
          },
      },
      city: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      country: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      search_date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    {
      tableName: "user_search_history",
      timestamps: false,
    }
  );

export default UserSearchHistory;