import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { Location } from '../../models/inventory.model';

@Component({
  selector: 'app-add-item',
  standalone: false,
  templateUrl: './add-item.component.html',
  styleUrls: ['./add-item.component.scss'],
})
export class AddItemComponent implements OnInit {
  name: string = '';
  price: number | null = null;
  locationId: number | null = null;
  locations: Location[] = [];
  errors: any = {};
  loading: boolean = false;

  constructor(private apiService: ApiService, private router: Router) {}

  ngOnInit(): void {
    this.locations = this.apiService.getLocations();
  }

  validateForm(): boolean {
    this.errors = {};

    if (!this.name.trim()) {
      this.errors.name = 'სახელი სავალდებულოა';
    }

    if (!this.price || this.price <= 0) {
      this.errors.price = 'ფასი უნდა იყოს 0-ზე მეტი';
    }

    if (!this.locationId) {
      this.errors.location = 'ადგილმდებარეობა სავალდებულოა';
    }

    return Object.keys(this.errors).length === 0;
  }

  async onSubmit(): Promise<void> {
    if (!this.validateForm()) {
      return;
    }

    this.loading = true;
    try {
      await this.apiService.createInventory({
        name: this.name,
        price: this.price!,
        locationId: this.locationId!,
      });
      this.router.navigate(['/']);
    } catch (error) {
      console.error('Error adding item:', error);
      alert('Failed to add item');
    } finally {
      this.loading = false;
    }
  }

  onCancel(): void {
    this.router.navigate(['/']);
  }
}
