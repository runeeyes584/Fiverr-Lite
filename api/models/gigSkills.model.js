import { DataTypes } from "sequelize";

const GigSkill = (sequelize) =>
  sequelize.define(
    "GigSkill",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      gig_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      skill_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      tableName: "gig_skills",
      timestamps: false,
      indexes: [
        {
          unique: true,
          fields: ["gig_id", "skill_id"],
        },
      ],
    }
  );

export default GigSkill;