import { DataTypes } from "sequelize";

const GigViewCount = (sequelize) =>
  sequelize.define(
    "GigViewCount",
    {
      gig_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
      },
      total_views: {
        type: DataTypes.BIGINT,
        allowNull: false,
        defaultValue: 0,
      },
    },
    {
      tableName: "gig_view_counts",
      timestamps: false,
    }
  );

export default GigViewCount;