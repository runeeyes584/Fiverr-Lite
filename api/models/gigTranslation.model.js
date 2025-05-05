import { DataTypes } from "sequelize";

const GigTranslation = (sequelize) =>
  sequelize.define(
    "GigTranslation",
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
      language_code: {
        type: DataTypes.STRING(10),
        allowNull: false,
      },
      title: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      tableName: "gig_translations",
      timestamps: false,
      indexes: [
        {
          unique: true,
          fields: ["gig_id", "language_code"],
        },
      ],
    }
  );

export default GigTranslation;