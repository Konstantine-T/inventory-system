import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InventoryTableComponent } from './components/inventory-table/inventory-table.component';
import { AddItemComponent } from './components/add-item/add-item.component';
import { StatisticsComponent } from './components/statistics/statistics.component';

const routes: Routes = [
  { path: '', component: InventoryTableComponent },
  { path: 'add', component: AddItemComponent },
  { path: 'statistics', component: StatisticsComponent },
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
