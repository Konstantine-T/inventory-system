export interface Location {
  id: number;
  name: string;
}

export interface InventoryItem {
  id: number;
  name: string;
  price: number;
  locationId: number;
  location: Location;
  createdAt?: string;
  updatedAt?: string;
}

export interface PaginatedResponse {
  items: InventoryItem[];
  total: number;
  page: number;
  totalPages: number;
}

export interface Statistics {
  id: number;
  name: string;
  totalProducts: number;
  totalPrice: number;
}

export interface CreateInventoryDto {
  name: string;
  price: number;
  locationId: number;
}
