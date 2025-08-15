using Microsoft.EntityFrameworkCore;
using PurchaseOrderApp.Domain.Entities;
using PurchaseOrderApp.Domain.Enums;
using PurchaseOrderApp.Infrastructure.Data;

namespace PurchaseOrderApp.Infrastructure.Repositories;

public class PurchaseOrderRepository(ApplicationDbContext db) : IPurchaseOrderRepository
{
    public async Task<(IEnumerable<PurchaseOrder> Items, int TotalCount)> QueryAsync(
        string? supplier, PurchaseOrderStatus? status, DateTime? from, DateTime? to,
        string? sortBy, string? sortDir, int pageNumber, int pageSize)
    {
        var q = db.PurchaseOrders.AsNoTracking().AsQueryable();

        if (!string.IsNullOrWhiteSpace(supplier))
            q = q.Where(x => x.SupplierName.Contains(supplier));

        if (status.HasValue)
            q = q.Where(x => x.Status == status.Value);

        if (from.HasValue)
            q = q.Where(x => x.OrderDate >= from.Value.Date);

        if (to.HasValue)
            q = q.Where(x => x.OrderDate <= to.Value.Date);

        // Sorting
        var dir = (sortDir ?? "asc").Equals("desc", StringComparison.OrdinalIgnoreCase) ? "desc" : "asc";
        q = (sortBy?.ToLower()) switch
        {
            "ponumber" => dir == "asc" ? q.OrderBy(x => x.PONumber) : q.OrderByDescending(x => x.PONumber),
            "orderdate" => dir == "asc" ? q.OrderBy(x => x.OrderDate) : q.OrderByDescending(x => x.OrderDate),
            "totalamount" => dir == "asc" ? q.OrderBy(x => x.TotalAmount) : q.OrderByDescending(x => x.TotalAmount),
            _ => q.OrderBy(x => x.Id)
        };

        var total = await q.CountAsync();

        // Pagination
        pageNumber = pageNumber < 1 ? 1 : pageNumber;
        pageSize = pageSize < 1 ? 10 : pageSize;
        var items = await q.Skip((pageNumber - 1) * pageSize).Take(pageSize).ToListAsync();

        return (items, total);
    }

    public Task<PurchaseOrder?> GetByIdAsync(int id) =>
        db.PurchaseOrders.FirstOrDefaultAsync(x => x.Id == id)!;

    public Task<PurchaseOrder?> GetByPONumberAsync(string poNumber) =>
        db.PurchaseOrders.FirstOrDefaultAsync(x => x.PONumber == poNumber)!;

    public async Task AddAsync(PurchaseOrder po)
    {
        db.PurchaseOrders.Add(po);
        await Task.CompletedTask;
    }

    public Task UpdateAsync(PurchaseOrder po)
    {
        db.PurchaseOrders.Update(po);
        return Task.CompletedTask;
    }

    public Task DeleteAsync(PurchaseOrder po)
    {
        db.PurchaseOrders.Remove(po);
        return Task.CompletedTask;
    }

    public Task<bool> SaveChangesAsync() => db.SaveChangesAsync().ContinueWith(t => t.Result > 0);
}
