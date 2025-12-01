import express, { Express, Request, Response, NextFunction } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { sequelize } from "./models/index";
import inventoryRoutes from "./routes/inventory";

dotenv.config();

const app: Express = express();
const PORT: number = parseInt(process.env.PORT || "3001", 10);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/inventories", inventoryRoutes);

interface ErrorWithStatus extends Error {
  status?: number;
}

app.use(
  (
    err: ErrorWithStatus,
    req: Request,
    res: Response,
    next: NextFunction
  ): void => {
    console.error(err.stack, req, next);
    const status = err.status || 500;
    res.status(status).json({
      error: err.message || "Something went wrong!",
      status,
    });
  }
);

app.use((req: Request, res: Response): void => {
  res.status(404).json({ error: "Route not found", req });
});

const startServer = async (): Promise<void> => {
  try {
    await sequelize.authenticate();
    console.log("Database connection established successfully");

    if (process.env.NODE_ENV === "development") {
      await sequelize.sync({ alter: false });
      console.log("Database models synchronized");
    }

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`API available at http://localhost:${PORT}/api`);
    });
  } catch (error) {
    console.error("Unable to start server:", error);
    process.exit(1);
  }
};

startServer();

export default app;
