import { DataTypes } from "sequelize";

const ContactForm = (sequelize) =>
  sequelize.define(
    "ContactForm",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      clerk_id: {
        type: DataTypes.STRING(255),
        allowNull: true,
        references: {
            model: "user_account",
            key: "clerk_id",
          },
      },
      name: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      email: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      message: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      submitted_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      tableName: "contact_form",
      timestamps: false,
    }
  );

export default ContactForm;