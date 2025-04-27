
const UserModel = {
  tableName: "user_account",
  columns: {
    id: {
      type: "INT",
      autoIncrement: true,
      primaryKey: true,
    },
    clerk_id: {
      type: "VARCHAR(255)",
      allowNull: false,
      unique: true,
    },
    user_type_id: {
      type: "INT",
      allowNull: false,
      references: {
        table: "user_type",
        key: "id",
      },
    },
    email: {
      type: "VARCHAR(255)",
      allowNull: false,
      unique: true,
      validate: {
        is: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/,
      },
    },
    username: {
      type: "VARCHAR(50)",
      allowNull: false,
      unique: true,
    },
    country: {
      type: "VARCHAR(50)",
      allowNull: false,
    },
    description: {
      type: "TEXT",
      allowNull: true,
    },
    is_seller: {
      type: "TINYINT(1)",
      allowNull: false,
      defaultValue: 0,
    },
    created_at: {
      type: "DATETIME",
      allowNull: false,
      defaultValue: "CURRENT_TIMESTAMP",
    },
    updated_at: {
      type: "DATETIME",
      allowNull: false,
      defaultValue: "CURRENT_TIMESTAMP",
      onUpdate: "CURRENT_TIMESTAMP",
    },
    date_of_birth: {
      type: "DATE",
      allowNull: true,
    },
    gender: {
      type: "TINYINT(1)",
      allowNull: true,
    },
    is_active: {
      type: "TINYINT(1)",
      allowNull: false,
      defaultValue: 1,
    },
    contact_number: {
      type: "VARCHAR(20)",
      allowNull: true,
    },
    user_image: {
      type: "TEXT",
      allowNull: true,
    },
    registration_date: {
      type: "DATE",
      allowNull: false,
    },
    last_password_updated: {
      type: "DATETIME",
      allowNull: true,
    },
  },
};

export default UserModel;