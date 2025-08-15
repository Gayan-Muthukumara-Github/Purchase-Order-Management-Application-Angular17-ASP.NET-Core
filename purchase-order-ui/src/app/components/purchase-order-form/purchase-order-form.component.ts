import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { 
  PurchaseOrderCreate, 
  PurchaseOrderUpdate, 
  PurchaseOrderDetail,
  PurchaseOrderStatus 
} from '../../models/purchase-order.model';
import { PurchaseOrderService } from '../../services/purchase-order.service';
import { UtilsService } from '../../services/utils.service';

@Component({
  selector: 'app-purchase-order-form',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './purchase-order-form.component.html',
  styleUrls: ['./purchase-order-form.component.css']
})
export class PurchaseOrderFormComponent implements OnInit, OnDestroy {
  purchaseOrderForm: FormGroup;
  isEditMode = false;
  purchaseOrderId: number | null = null;
  loading = false;
  submitting = false;
  
  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private purchaseOrderService: PurchaseOrderService,
    private utilsService: UtilsService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.purchaseOrderForm = this.fb.group({
      poNumber: ['', [Validators.required, Validators.maxLength(50)]],
      description: ['', [Validators.maxLength(500)]],
      supplierName: ['', [Validators.required, Validators.maxLength(200)]],
      orderDate: ['', [Validators.required]],
      totalAmount: [0, [Validators.required, Validators.min(0), Validators.max(999999999999.99)]],
      status: [PurchaseOrderStatus.Draft, [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.purchaseOrderId = +params['id'];
        this.loadPurchaseOrder();
      } else {
        this.isEditMode = false;
        this.purchaseOrderForm.patchValue({
          orderDate: new Date().toISOString().split('T')[0],
          status: PurchaseOrderStatus.Draft
        });
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadPurchaseOrder(): void {
    if (!this.purchaseOrderId) return;

    this.loading = true;
    this.purchaseOrderService.getPurchaseOrderById(this.purchaseOrderId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (po: PurchaseOrderDetail) => {
          this.purchaseOrderForm.patchValue({
            poNumber: po.poNumber,
            description: po.description || '',
            supplierName: po.supplierName,
            orderDate: new Date(po.orderDate).toISOString().split('T')[0],
            totalAmount: po.totalAmount,
            status: po.status
          });
          this.loading = false;
        },
        error: (error) => {
          console.error('Error loading purchase order:', error);
          this.loading = false;
          alert('Error loading purchase order');
        }
      });
  }

  onSubmit(): void {
    if (this.purchaseOrderForm.invalid) {
      this.markFormGroupTouched();
      return;
    }

    this.submitting = true;
    const formValue = this.purchaseOrderForm.value;

    // Convert date string to Date object
    const purchaseOrderData = {
      ...formValue,
      orderDate: new Date(formValue.orderDate)
    };

    if (this.isEditMode && this.purchaseOrderId) {
      this.purchaseOrderService.updatePurchaseOrder(this.purchaseOrderId, purchaseOrderData)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.submitting = false;
            alert('Purchase order updated successfully!');
            this.router.navigate(['/purchase-orders']);
          },
          error: (error) => {
            console.error('Error updating purchase order:', error);
            this.submitting = false;
            alert('Error updating purchase order');
          }
        });
    } else {
      this.purchaseOrderService.createPurchaseOrder(purchaseOrderData)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (id) => {
            this.submitting = false;
            alert(`Purchase order created successfully with ID: ${id}`);
            this.router.navigate(['/purchase-orders']);
          },
          error: (error) => {
            console.error('Error creating purchase order:', error);
            this.submitting = false;
            alert('Error creating purchase order');
          }
        });
    }
  }

  onCancel(): void {
    this.router.navigate(['/purchase-orders']);
  }

  private markFormGroupTouched(): void {
    Object.keys(this.purchaseOrderForm.controls).forEach(key => {
      const control = this.purchaseOrderForm.get(key);
      control?.markAsTouched();
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.purchaseOrderForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getFieldError(fieldName: string): string {
    const field = this.purchaseOrderForm.get(fieldName);
    if (field && field.errors) {
      if (field.errors['required']) {
        return `${this.getFieldDisplayName(fieldName)} is required`;
      }
      if (field.errors['maxlength']) {
        return `${this.getFieldDisplayName(fieldName)} cannot exceed ${field.errors['maxlength'].requiredLength} characters`;
      }
      if (field.errors['min']) {
        return `${this.getFieldDisplayName(fieldName)} must be at least ${field.errors['min'].min}`;
      }
      if (field.errors['max']) {
        return `${this.getFieldDisplayName(fieldName)} cannot exceed ${field.errors['max'].max}`;
      }
    }
    return '';
  }

  private getFieldDisplayName(fieldName: string): string {
    const displayNames: { [key: string]: string } = {
      poNumber: 'PO Number',
      description: 'Description',
      supplierName: 'Supplier Name',
      orderDate: 'Order Date',
      totalAmount: 'Total Amount',
      status: 'Status'
    };
    return displayNames[fieldName] || fieldName;
  }

  getStatusOptions() {
    return this.utilsService.getStatusOptions();
  }

  getTitle(): string {
    return this.isEditMode ? 'Edit Purchase Order' : 'New Purchase Order';
  }
}
