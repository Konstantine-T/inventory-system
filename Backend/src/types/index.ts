import { Model, Optional } from "sequelize";

// Location interfaces
export interface LocationAttributes {
  id: number;
  name: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface LocationCreationAttributes
  extends Optional<LocationAttributes, "id"> {}

export interface LocationInstance
  extends Model<LocationAttributes, LocationCreationAttributes>,
    LocationAttributes {
  // Add any instance methods here
}

// Inventory interfaces
export interface InventoryAttributes {
  id: number;
  name: string;
  price: number;
  locationId: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface InventoryCreationAttributes
  extends Optional<InventoryAttributes, "id"> {}

export interface InventoryInstance
  extends Model<InventoryAttributes, InventoryCreationAttributes>,
    InventoryAttributes {
  // Add associations
  location?: LocationInstance;
}

// Request query interfaces
export interface InventoryQueryParams {
  page?: string;
  limit?: string;
  locationId?: string;
  sortBy?: "name" | "price" | "location";
  sortOrder?: "ASC" | "DESC";
}

// Response interfaces
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  totalPages: number;
}

export interface StatisticsResponse {
  id: number;
  name: string;
  totalProducts: number;
  totalPrice: number;
}
