import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { 
  PurchaseOrderListItem, 
  PurchaseOrderDetail, 
  PurchaseOrderCreate, 
  PurchaseOrderUpdate, 
  PagedResult, 
  PurchaseOrderFilters 
} from '../models/purchase-order.model';

@Injectable({
  providedIn: 'root'
})
export class PurchaseOrderService {
  private readonly baseUrl = 'http://localhost:5121/api/purchaseorders';

  constructor(private http: HttpClient) {}

  getPurchaseOrders(filters: PurchaseOrderFilters): Observable<PagedResult<PurchaseOrderListItem>> {
    let params = new HttpParams()
      .set('pageNumber', filters.pageNumber.toString())
      .set('pageSize', filters.pageSize.toString());

    if (filters.supplier) {
      params = params.set('supplier', filters.supplier);
    }
    if (filters.status !== undefined) {
      params = params.set('status', filters.status.toString());
    }
    if (filters.dateFrom) {
      params = params.set('dateFrom', filters.dateFrom.toISOString());
    }
    if (filters.dateTo) {
      params = params.set('dateTo', filters.dateTo.toISOString());
    }
    if (filters.sortBy) {
      params = params.set('sortBy', filters.sortBy);
    }
    if (filters.sortDir) {
      params = params.set('sortDir', filters.sortDir);
    }

    console.log('Making API request to:', this.baseUrl, 'with params:', params.toString());
    return this.http.get<PagedResult<PurchaseOrderListItem>>(this.baseUrl, { params });
  }

  getPurchaseOrderById(id: number): Observable<PurchaseOrderDetail> {
    return this.http.get<PurchaseOrderDetail>(`${this.baseUrl}/${id}`);
  }

  createPurchaseOrder(purchaseOrder: PurchaseOrderCreate): Observable<number> {
    return this.http.post<number>(this.baseUrl, purchaseOrder);
  }

  updatePurchaseOrder(id: number, purchaseOrder: PurchaseOrderUpdate): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${id}`, purchaseOrder);
  }

  deletePurchaseOrder(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
