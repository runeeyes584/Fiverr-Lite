import { DataTypes } from "sequelize";

const GigView = (sequelize) =>
  sequelize.define(
    "GigView",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      gig_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: "gigs",
            key: "id",
          },
      },
      clerk_id: {
        type: DataTypes.STRING(255),
        allowNull: true,
        references: {
            model: "user_account",
            key: "clerk_id",
          },
      },
      view_date: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      tableName: "gig_views",
      timestamps: false,
    }
  );

export default GigView;