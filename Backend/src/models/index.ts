import { Sequelize } from "sequelize";
import config from "../config/database";
import { LocationFactory } from "./location";
import { InventoryFactory } from "./inventory";

const env = process.env.NODE_ENV || "development";
const dbConfig = config[env as keyof typeof config];

const sequelize = new Sequelize(
  dbConfig.database as string,
  dbConfig.username as string,
  dbConfig.password as string,
  {
    host: dbConfig.host,
    dialect: dbConfig.dialect,
    port: dbConfig.port,
    logging: dbConfig.logging,
    pool: dbConfig.pool,
  }
);

const Location = LocationFactory(sequelize);
const Inventory = InventoryFactory(sequelize);

Location.hasMany(Inventory, {
  foreignKey: "locationId",
  as: "inventories",
});

Inventory.belongsTo(Location, {
  foreignKey: "locationId",
  as: "location",
});

export { sequelize, Sequelize, Location, Inventory };

export default {
  sequelize,
  Sequelize,
  Location,
  Inventory,
};
