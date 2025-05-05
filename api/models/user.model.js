import { DataTypes } from "sequelize";

const User = (sequelize) =>
  sequelize.define(
    "User",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      clerk_id: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
        validate: {
          is: /^[A-Za-z0-9_-]+$/,
        },
      },
      country: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      user_role: {
        type: DataTypes.ENUM("seeker", "employer", "admin"),
        allowNull: false,
        defaultValue: "seeker",
      },
      date_of_birth: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      gender: {
        type: DataTypes.TINYINT,
        allowNull: true,
      },
      contact_number: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
      registration_date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
    },
    {
      tableName: "user_account",
      timestamps: false,
    }
  );

export default User;