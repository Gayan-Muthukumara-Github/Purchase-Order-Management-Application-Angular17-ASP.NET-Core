import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { PurchaseOrderDetail } from '../../models/purchase-order.model';
import { PurchaseOrderService } from '../../services/purchase-order.service';
import { UtilsService } from '../../services/utils.service';

@Component({
  selector: 'app-purchase-order-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './purchase-order-detail.component.html',
  styleUrls: ['./purchase-order-detail.component.css']
})
export class PurchaseOrderDetailComponent implements OnInit, OnDestroy {
  purchaseOrder: PurchaseOrderDetail | null = null;
  loading = false;
  error = false;
  
  private destroy$ = new Subject<void>();

  constructor(
    private purchaseOrderService: PurchaseOrderService,
    private utilsService: UtilsService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.loadPurchaseOrder(+params['id']);
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadPurchaseOrder(id: number): void {
    this.loading = true;
    this.error = false;

    this.purchaseOrderService.getPurchaseOrderById(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (po: PurchaseOrderDetail) => {
          this.purchaseOrder = po;
          this.loading = false;
        },
        error: (error) => {
          console.error('Error loading purchase order:', error);
          this.loading = false;
          this.error = true;
        }
      });
  }

  editPurchaseOrder(): void {
    if (this.purchaseOrder) {
      this.router.navigate(['/purchase-orders', this.purchaseOrder.id, 'edit']);
    }
  }

  goBack(): void {
    this.router.navigate(['/purchase-orders']);
  }

  getStatusDisplayName(status: number): string {
    return this.utilsService.getStatusDisplayName(status);
  }

  getStatusClass(status: number): string {
    return this.utilsService.getStatusClass(status);
  }

  formatDate(date: Date): string {
    return this.utilsService.formatDate(date);
  }

  formatAmount(amount: number): string {
    return this.utilsService.formatAmount(amount);
  }
}
