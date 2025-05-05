import { DataTypes } from "sequelize";

const CVFile = (sequelize) =>
  sequelize.define(
    "CVFile",
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
      file_url: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      file_name: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      uploaded_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      is_default: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      file_size: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      file_type: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
    },
    {
      tableName: "cv_files",
      timestamps: false,
    }
  );

export default CVFile;