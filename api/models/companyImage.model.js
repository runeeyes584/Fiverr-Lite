import { DataTypes } from "sequelize";

const CompanyImage = (sequelize) =>
  sequelize.define(
    "CompanyImage",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      company_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      company_image: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
    },
    {
      tableName: "company_image",
      timestamps: false,
    }
  );

export default CompanyImage;