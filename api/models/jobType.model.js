import { DataTypes } from "sequelize";

const JobType = (sequelize) =>
  sequelize.define(
    "JobType",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      job_type: {
        type: DataTypes.STRING(20),
        allowNull: false,
        unique: true,
      },
    },
    {
      tableName: "job_type",
      timestamps: false,
    }
  );

export default JobType;