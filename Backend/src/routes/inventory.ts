import express, { Router, Request, Response, NextFunction } from "express";
import { Op, Order, WhereOptions } from "sequelize";
import { Inventory, Location, sequelize } from "../models";
import {
  InventoryQueryParams,
  PaginatedResponse,
  InventoryAttributes,
  StatisticsResponse,
} from "../types";

const router: Router = express.Router();

router.get(
  "/",
  async (
    req: Request<{}, {}, {}, InventoryQueryParams>,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const {
        page = "1",
        limit = "20",
        locationId,
        sortBy = "name",
        sortOrder = "ASC",
      } = req.query;

      const pageNumber = parseInt(page, 10);
      const limitNumber = parseInt(limit, 10);
      const offset = (pageNumber - 1) * limitNumber;

      const where: WhereOptions<InventoryAttributes> = {};
      if (locationId && locationId !== "all") {
        where.locationId = parseInt(locationId, 10);
      }

      let order: Order;
      switch (sortBy) {
        case "price":
          order = [["price", sortOrder]];
          break;
        case "location":
          order = [[{ model: Location, as: "location" }, "name", sortOrder]];
          break;
        case "name":
        default:
          order = [["name", sortOrder]];
          break;
      }

      const { count, rows } = await Inventory.findAndCountAll({
        where,
        include: [
          {
            model: Location,
            as: "location",
            attributes: ["id", "name"],
          },
        ],
        limit: limitNumber,
        offset,
        order,
        distinct: true,
      });

      const response: PaginatedResponse<(typeof rows)[0]> = {
        items: rows,
        total: count,
        page: pageNumber,
        totalPages: Math.ceil(count / limitNumber),
      };

      res.json(response);
    } catch (error) {
      next(error);
    }
  }
);

router.get(
  "/statistics",
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      console.log(req, Op);
      const statistics = await Location.findAll({
        attributes: [
          "id",
          "name",
          [
            sequelize.fn("COUNT", sequelize.col("inventories.id")),
            "totalProducts",
          ],
          [
            sequelize.fn(
              "COALESCE",
              sequelize.fn("SUM", sequelize.col("inventories.price")),
              0
            ),
            "totalPrice",
          ],
        ],
        include: [
          {
            model: Inventory,
            as: "inventories",
            attributes: [],
          },
        ],
        group: ["Location.id", "Location.name"],
        raw: true,
      });

      const formattedStats: StatisticsResponse[] = statistics.map(
        (stat: any) => ({
          id: stat.id,
          name: stat.name,
          totalProducts: parseInt(stat.totalProducts || "0", 10),
          totalPrice: parseFloat(stat.totalPrice || "0"),
        })
      );

      res.json(formattedStats);
    } catch (error) {
      next(error);
    }
  }
);

router.post(
  "/",
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { name, price, locationId } = req.body;

      const errors: string[] = [];
      if (!name || typeof name !== "string" || name.trim().length === 0) {
        errors.push("Name is required and must be a non-empty string");
      }
      if (!price || isNaN(price) || price <= 0) {
        errors.push("Price is required and must be a positive number");
      }
      if (!locationId || isNaN(locationId)) {
        errors.push("Location ID is required and must be a number");
      }

      if (errors.length > 0) {
        res.status(400).json({
          error: "Validation failed",
          details: errors,
        });
        return;
      }

      const location = await Location.findByPk(locationId);
      if (!location) {
        res.status(400).json({
          error: "Invalid location ID",
        });
        return;
      }

      const inventory = await Inventory.create({
        name: name.trim(),
        price: parseFloat(price),
        locationId: parseInt(locationId, 10),
      });

      const inventoryWithLocation = await Inventory.findByPk(inventory.id, {
        include: [
          {
            model: Location,
            as: "location",
            attributes: ["id", "name"],
          },
        ],
      });

      res.status(201).json(inventoryWithLocation);
    } catch (error) {
      next(error);
    }
  }
);

router.delete(
  "/:id",
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const inventoryId = parseInt(id, 10);

      if (isNaN(inventoryId)) {
        res.status(400).json({
          error: "Invalid inventory ID",
        });
        return;
      }

      const deleted = await Inventory.destroy({
        where: { id: inventoryId },
      });

      if (deleted > 0) {
        res.status(204).send();
      } else {
        res.status(404).json({
          error: "Inventory item not found",
        });
      }
    } catch (error) {
      next(error);
    }
  }
);

router.get(
  "/:id",
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const inventoryId = parseInt(id, 10);

      if (isNaN(inventoryId)) {
        res.status(400).json({
          error: "Invalid inventory ID",
        });
        return;
      }

      const inventory = await Inventory.findByPk(inventoryId, {
        include: [
          {
            model: Location,
            as: "location",
            attributes: ["id", "name"],
          },
        ],
      });

      if (!inventory) {
        res.status(404).json({
          error: "Inventory item not found",
        });
        return;
      }

      res.json(inventory);
    } catch (error) {
      next(error);
    }
  }
);

export default router;
