import { Injectable } from '@angular/core';
import { PurchaseOrderStatus } from '../models/purchase-order.model';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  constructor() { }

  formatDate(date: Date): string {
    if (!date) return '';
    return new Date(date).toLocaleDateString();
  }

  formatAmount(amount: number): string {
    if (amount === null || amount === undefined) return '';
    return amount.toFixed(2);
  }

  getStatusDisplayName(status: PurchaseOrderStatus): string {
    switch (status) {
      case PurchaseOrderStatus.Draft:
        return 'Draft';
      case PurchaseOrderStatus.Approved:
        return 'Approved';
      case PurchaseOrderStatus.Shipped:
        return 'Shipped';
      case PurchaseOrderStatus.Completed:
        return 'Completed';
      case PurchaseOrderStatus.Cancelled:
        return 'Cancelled';
      default:
        return 'Unknown';
    }
  }

  getStatusClass(status: PurchaseOrderStatus): string {
    switch (status) {
      case PurchaseOrderStatus.Draft:
        return 'status-draft';
      case PurchaseOrderStatus.Approved:
        return 'status-approved';
      case PurchaseOrderStatus.Shipped:
        return 'status-shipped';
      case PurchaseOrderStatus.Completed:
        return 'status-completed';
      case PurchaseOrderStatus.Cancelled:
        return 'status-cancelled';
      default:
        return 'status-unknown';
    }
  }

  getStatusOptions(): { value: PurchaseOrderStatus; label: string }[] {
    return [
      { value: PurchaseOrderStatus.Draft, label: 'Draft' },
      { value: PurchaseOrderStatus.Approved, label: 'Approved' },
      { value: PurchaseOrderStatus.Shipped, label: 'Shipped' },
      { value: PurchaseOrderStatus.Completed, label: 'Completed' },
      { value: PurchaseOrderStatus.Cancelled, label: 'Cancelled' }
    ];
  }
}
