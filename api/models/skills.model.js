import { DataTypes } from "sequelize";

const Skills = (sequelize) =>
  sequelize.define(
    "Skills",
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
    },
    {
      tableName: "skills",
      timestamps: false,
    }
  );

export default Skills;