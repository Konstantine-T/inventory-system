import { Sequelize, DataTypes, Model, ModelStatic } from "sequelize";
import { LocationAttributes, LocationCreationAttributes } from "../types";

export interface LocationInstance
  extends Model<LocationAttributes, LocationCreationAttributes>,
    LocationAttributes {}

export const LocationFactory = (
  sequelize: Sequelize
): ModelStatic<LocationInstance> => {
  const Location = sequelize.define<LocationInstance>(
    "Location",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          notEmpty: {
            msg: "Location name cannot be empty",
          },
          len: {
            args: [1, 255],
            msg: "Location name must be between 1 and 255 characters",
          },
        },
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      tableName: "locations",
      timestamps: true,
      indexes: [
        {
          unique: true,
          fields: ["name"],
        },
      ],
    }
  );

  return Location;
};
