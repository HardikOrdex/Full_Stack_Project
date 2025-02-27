import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

export const UserCreds = sequelize.define(
  "UserCreds",
  {
    accessToken: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    refreshToken: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      references: {
        model: "user_table",
        key: "id",
      },
      allowNull: false,
      unique: true,
    },
  },
  {
    timestamps: true,
    tableName: "user_creds"
  }
);
