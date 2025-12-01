import { Sequelize, DataTypes, Model, ModelStatic } from "sequelize";
import { InventoryAttributes, InventoryCreationAttributes } from "../types";

export interface InventoryInstance
  extends Model<InventoryAttributes, InventoryCreationAttributes>,
    InventoryAttributes {}

export const InventoryFactory = (
  sequelize: Sequelize
): ModelStatic<InventoryInstance> => {
  const Inventory = sequelize.define<InventoryInstance>(
    "Inventory",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "Inventory name cannot be empty",
          },
          len: {
            args: [1, 255],
            msg: "Inventory name must be between 1 and 255 characters",
          },
        },
      },
      price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: {
          min: {
            args: [0],
            msg: "Price must be a positive number",
          },
          isDecimal: {
            msg: "Price must be a valid decimal number",
          },
        },
      },
      locationId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "locations",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT",
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
      tableName: "inventories",
      timestamps: true,
      indexes: [
        {
          fields: ["name"],
        },
        {
          fields: ["price"],
        },
        {
          fields: ["locationId"],
        },
      ],
    }
  );

  return Inventory;
};
