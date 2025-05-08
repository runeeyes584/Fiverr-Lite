import { DataTypes } from "sequelize";

const SeekerSkill = (sequelize) =>
  sequelize.define(
    "SeekerSkill",
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
      skill_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      tableName: "seeker_skills",
      timestamps: false,
      indexes: [
        {
          unique: true,
          fields: ["clerk_id", "skill_id"],
        },
      ],
    }
  );

export default SeekerSkill;