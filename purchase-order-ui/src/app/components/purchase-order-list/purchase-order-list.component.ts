import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, takeUntil, debounceTime, distinctUntilChanged } from 'rxjs';
import { 
  PurchaseOrderListItem, 
  PurchaseOrderStatus, 
  PurchaseOrderFilters,
  PagedResult 
} from '../../models/purchase-order.model';
import { PurchaseOrderService } from '../../services/purchase-order.service';
import { UtilsService } from '../../services/utils.service';

@Component({
  selector: 'app-purchase-order-list',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './purchase-order-list.component.html',
  styleUrls: ['./purchase-order-list.component.css']
})
export class PurchaseOrderListComponent implements OnInit, OnDestroy {
  purchaseOrders: PurchaseOrderListItem[] = [];
  loading = false;
  totalCount = 0;
  currentPage = 1;
  pageSize = 10;
  pageSizeOptions = [5, 10, 25, 50];
  
  filtersForm: FormGroup;
  sortBy = 'poNumber';
  sortDir = 'asc';
  
  // Make Math available in template
  Math = Math;
  
  private destroy$ = new Subject<void>();

  constructor(
    private purchaseOrderService: PurchaseOrderService,
    private utilsService: UtilsService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.filtersForm = this.fb.group({
      supplier: [''],
      status: [''],
      dateFrom: [''],
      dateTo: ['']
    });
  }

  ngOnInit(): void {
    this.loadPurchaseOrders();
    
    // Setup form change detection with debouncing
    this.filtersForm.valueChanges
      .pipe(
        takeUntil(this.destroy$),
        debounceTime(300),
        distinctUntilChanged()
      )
      .subscribe(() => {
        this.currentPage = 1;
        this.loadPurchaseOrders();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadPurchaseOrders(): void {
    this.loading = true;
    
    const filters: PurchaseOrderFilters = {
      ...this.filtersForm.value,
      sortBy: this.sortBy,
      sortDir: this.sortDir,
      pageNumber: this.currentPage,
      pageSize: this.pageSize
    };

    this.purchaseOrderService.getPurchaseOrders(filters)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (result: PagedResult<PurchaseOrderListItem>) => {
          this.purchaseOrders = result.items;
          this.totalCount = result.totalCount;
          this.loading = false;
        },
        error: (error) => {
          console.error('Error loading purchase orders:', error);
          console.error('Error details:', {
            status: error.status,
            statusText: error.statusText,
            url: error.url,
            message: error.message
          });
          this.loading = false;
        }
      });
  }

  onPageChange(event: any): void {
    this.currentPage = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.loadPurchaseOrders();
  }

  onPageSizeChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.pageSize = +target.value;
    this.currentPage = 1;
    this.loadPurchaseOrders();
  }

  onSort(column: string): void {
    if (this.sortBy === column) {
      this.sortDir = this.sortDir === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortBy = column;
      this.sortDir = 'asc';
    }
    this.loadPurchaseOrders();
  }

  clearFilters(): void {
    this.filtersForm.reset();
    this.currentPage = 1;
    this.loadPurchaseOrders();
  }

  addNewPurchaseOrder(): void {
    this.router.navigate(['/purchase-orders/new']);
  }

  editPurchaseOrder(id: number): void {
    this.router.navigate(['/purchase-orders', id, 'edit']);
  }

  viewPurchaseOrder(id: number): void {
    this.router.navigate(['/purchase-orders', id]);
  }

  deletePurchaseOrder(id: number): void {
    if (confirm('Are you sure you want to delete this purchase order?')) {
      this.purchaseOrderService.deletePurchaseOrder(id)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.loadPurchaseOrders();
          },
          error: (error) => {
            console.error('Error deleting purchase order:', error);
            alert('Error deleting purchase order');
          }
        });
    }
  }

  getStatusDisplayName(status: PurchaseOrderStatus): string {
    return this.utilsService.getStatusDisplayName(status);
  }

  getStatusClass(status: PurchaseOrderStatus): string {
    return this.utilsService.getStatusClass(status);
  }

  getStatusOptions() {
    return this.utilsService.getStatusOptions();
  }
}
