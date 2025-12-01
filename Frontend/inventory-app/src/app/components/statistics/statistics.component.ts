import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { Statistics } from '../../models/inventory.model';

@Component({
  selector: 'app-statistics',
  standalone: false,
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.scss'],
})
export class StatisticsComponent implements OnInit {
  statistics: Statistics[] = [];
  loading: boolean = false;
  totalProducts: number = 0;
  totalValue: number = 0;

  constructor(private apiService: ApiService, private router: Router) {}

  ngOnInit(): void {
    this.loadStatistics();
  }

  async loadStatistics(): Promise<void> {
    this.loading = true;
    try {
      this.statistics = await this.apiService.getStatistics();
      this.calculateTotals();
    } catch (error) {
      console.error('Error loading statistics:', error);
      alert('Failed to load statistics');
    } finally {
      this.loading = false;
    }
  }

  calculateTotals(): void {
    this.totalProducts = this.statistics.reduce(
      (sum, stat) => sum + (stat.totalProducts || 0),
      0
    );
    this.totalValue = this.statistics.reduce(
      (sum, stat) => sum + (stat.totalPrice || 0),
      0
    );
  }

  goBack(): void {
    this.router.navigate(['/']);
  }
}
