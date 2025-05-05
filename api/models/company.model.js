import { DataTypes } from "sequelize";

const Company = (sequelize) =>
  sequelize.define(
    "Company",
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
      company_name: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      profile_description: {
        type: DataTypes.STRING(1000),
        allowNull: true,
      },
      establishment_date: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      company_website_url: {
        type: DataTypes.STRING(500),
        allowNull: true,
      },
      company_email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      verified_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      location: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
    },
    {
      tableName: "company",
      timestamps: false,
    }
  );

export default Company;