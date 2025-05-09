import { DataTypes } from "sequelize";

const Category = (sequelize) =>
  sequelize.define(
    "Category",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
      },
      desc: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      img: {
        type: DataTypes.STRING(255), 
        allowNull: true,
      },
    },
    {
      tableName: "category",
      timestamps: false,
    }
  );

export default Category;