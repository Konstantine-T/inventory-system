import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { InventoryItem, Location } from '../../models/inventory.model';

@Component({
  selector: 'app-inventory-table',
  standalone: false,
  templateUrl: './inventory-table.component.html',
  styleUrls: ['./inventory-table.component.scss'],
})
export class InventoryTableComponent implements OnInit {
  items: InventoryItem[] = [];
  currentPage: number = 1;
  totalPages: number = 1;
  totalItems: number = 0;
  locations: Location[] = [];
  selectedLocation: string = 'all';
  sortBy: string = 'name';
  sortOrder: string = 'ASC';
  loading: boolean = false;
  itemsPerPage: number = 20;

  constructor(private apiService: ApiService, private router: Router) {}

  ngOnInit(): void {
    this.locations = this.apiService.getLocations();
    this.loadInventories();
  }

  async loadInventories(): Promise<void> {
    this.loading = true;
    try {
      const data = await this.apiService.getInventories({
        page: this.currentPage,
        limit: this.itemsPerPage,
        locationId:
          this.selectedLocation !== 'all' ? this.selectedLocation : undefined,
        sortBy: this.sortBy,
        sortOrder: this.sortOrder,
      });

      this.items = data.items;
      this.totalPages = data.totalPages;
      this.totalItems = data.total;
    } catch (error) {
      console.error('Error loading inventories:', error);
      alert('Failed to load inventories');
    } finally {
      this.loading = false;
    }
  }

  async deleteItem(id: number): Promise<void> {
    if (confirm('ნამდვილად გსურთ ამ ნივთის წაშლა?')) {
      try {
        await this.apiService.deleteInventory(id);
        await this.loadInventories();
      } catch (error) {
        console.error('Error deleting item:', error);
        alert('Failed to delete item');
      }
    }
  }

  onLocationChange(): void {
    this.currentPage = 1;
    this.loadInventories();
  }

  onSort(field: string): void {
    if (this.sortBy === field) {
      this.sortOrder = this.sortOrder === 'ASC' ? 'DESC' : 'ASC';
    } else {
      this.sortBy = field;
      this.sortOrder = 'ASC';
    }
    this.loadInventories();
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadInventories();
  }

  navigateToAdd(): void {
    this.router.navigate(['/add']);
  }

  navigateToStatistics(): void {
    this.router.navigate(['/statistics']);
  }

  getSortIcon(field: string): string {
    if (this.sortBy !== field) return '';
    return this.sortOrder === 'ASC' ? '↑' : '↓';
  }
}
