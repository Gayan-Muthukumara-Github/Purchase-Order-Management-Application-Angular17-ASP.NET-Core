import { Routes } from '@angular/router';
import { PurchaseOrderListComponent } from './components/purchase-order-list/purchase-order-list.component';
import { PurchaseOrderFormComponent } from './components/purchase-order-form/purchase-order-form.component';
import { PurchaseOrderDetailComponent } from './components/purchase-order-detail/purchase-order-detail.component';

export const routes: Routes = [
  { path: '', redirectTo: '/purchase-orders', pathMatch: 'full' },
  { path: 'purchase-orders', component: PurchaseOrderListComponent },
  { path: 'purchase-orders/new', component: PurchaseOrderFormComponent },
  { path: 'purchase-orders/:id', component: PurchaseOrderDetailComponent },
  { path: 'purchase-orders/:id/edit', component: PurchaseOrderFormComponent },
  { path: '**', redirectTo: '/purchase-orders' }
];
