export enum PurchaseOrderStatus {
  Draft = 0,
  Approved = 1,
  Shipped = 2,
  Completed = 3,
  Cancelled = 4
}

export interface PurchaseOrderListItem {
  id: number;
  poNumber: string;
  description?: string;
  supplierName: string;
  orderDate: Date;
  totalAmount: number;
  status: PurchaseOrderStatus;
}

export interface PurchaseOrderDetail {
  id: number;
  poNumber: string;
  description?: string;
  supplierName: string;
  orderDate: Date;
  totalAmount: number;
  status: PurchaseOrderStatus;
}

export interface PurchaseOrderCreate {
  poNumber: string;
  description?: string;
  supplierName: string;
  orderDate: Date;
  totalAmount: number;
  status: PurchaseOrderStatus;
}

export interface PurchaseOrderUpdate extends PurchaseOrderCreate {}

export interface PagedResult<T> {
  items: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
}

export interface PurchaseOrderFilters {
  supplier?: string;
  status?: PurchaseOrderStatus;
  dateFrom?: Date;
  dateTo?: Date;
  sortBy?: string;
  sortDir?: string;
  pageNumber: number;
  pageSize: number;
}
