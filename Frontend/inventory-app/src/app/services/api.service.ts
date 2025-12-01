import { Injectable } from '@angular/core';
import axios, { AxiosInstance } from 'axios';
import {
  InventoryItem,
  PaginatedResponse,
  Statistics,
  CreateInventoryDto,
  Location,
} from '../models/inventory.model';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private api: AxiosInstance;
  private readonly locations: Location[] = [
    { id: 1, name: 'მთავარი ოფისი' },
    { id: 2, name: 'კავეა გალერია' },
    { id: 3, name: 'კავეა თბილისი მოლი' },
    { id: 4, name: 'კავეა ისთ ფოინთი' },
    { id: 5, name: 'კავეა სითი მოლი' },
  ];

  constructor() {
    this.api = axios.create({
      baseURL: 'http://localhost:3001/api',
    });
  }

  async getInventories(params: {
    page?: number;
    limit?: number;
    locationId?: string;
    sortBy?: string;
    sortOrder?: string;
  }): Promise<PaginatedResponse> {
    const response = await this.api.get<PaginatedResponse>('/inventories', {
      params,
    });
    return response.data;
  }

  async createInventory(data: CreateInventoryDto): Promise<InventoryItem> {
    const response = await this.api.post<InventoryItem>('/inventories', data);
    return response.data;
  }

  async deleteInventory(id: number): Promise<void> {
    await this.api.delete(`/inventories/${id}`);
  }

  async getStatistics(): Promise<Statistics[]> {
    const response = await this.api.get<Statistics[]>(
      '/inventories/statistics'
    );
    return response.data;
  }

  getLocations(): Location[] {
    return this.locations;
  }
}
