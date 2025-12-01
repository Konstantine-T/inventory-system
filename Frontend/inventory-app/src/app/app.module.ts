import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { InventoryTableComponent } from './components/inventory-table/inventory-table.component';
import { AddItemComponent } from './components/add-item/add-item.component';
import { StatisticsComponent } from './components/statistics/statistics.component';
import { NavigationComponent } from './components/navigation/navigation.component';

@NgModule({
  declarations: [
    AppComponent,
    InventoryTableComponent,
    AddItemComponent,
    StatisticsComponent,
    NavigationComponent,
  ],
  imports: [BrowserModule, AppRoutingModule, FormsModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
