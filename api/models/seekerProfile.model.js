import { DataTypes } from "sequelize";

const SeekerProfile = (sequelize) =>
  sequelize.define(
    "SeekerProfile",
    {
      clerk_id: {
        type: DataTypes.STRING(255),
        primaryKey: true,
        references: {
            model: "user_account",
            key: "clerk_id",
          },
      },
      first_name: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      last_name: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      current_salary: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      is_annually_monthly: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
      },
      currency: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      email_contact: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      file_cv: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      tableName: "seeker_profile",
      timestamps: false,
    }
  );

export default SeekerProfile;