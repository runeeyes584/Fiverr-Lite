import { DataTypes } from "sequelize";

const SavedGig = (sequelize) =>
  sequelize.define(
    "SavedGig",
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
      gig_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "gigs",
          key: "id",
        },
      },
      saved_date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      tableName: "saved_gigs",
      timestamps: false,
      indexes: [
        {
          unique: true,
          fields: ["clerk_id", "gig_id"],
        },
      ],
    }
  );

export default SavedGig;