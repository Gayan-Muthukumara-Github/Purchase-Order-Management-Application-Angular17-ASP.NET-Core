using PurchaseOrderApp.Domain.Entities;
using PurchaseOrderApp.Domain.Enums;

namespace PurchaseOrderApp.Infrastructure.Repositories;

public interface IPurchaseOrderRepository
{
    Task<(IEnumerable<PurchaseOrder> Items, int TotalCount)> QueryAsync(
        string? supplier, PurchaseOrderStatus? status, DateTime? from, DateTime? to,
        string? sortBy, string? sortDir, int pageNumber, int pageSize);

    Task<PurchaseOrder?> GetByIdAsync(int id);
    Task<PurchaseOrder?> GetByPONumberAsync(string poNumber);
    Task AddAsync(PurchaseOrder po);
    Task UpdateAsync(PurchaseOrder po);
    Task DeleteAsync(PurchaseOrder po);
    Task<bool> SaveChangesAsync();
}
