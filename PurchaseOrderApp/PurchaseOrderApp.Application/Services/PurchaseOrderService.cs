using PurchaseOrderApp.Application.DTOs;
using PurchaseOrderApp.Application.Interfaces;
using PurchaseOrderApp.Domain.Entities;
using PurchaseOrderApp.Infrastructure.Repositories;
using PurchaseOrderApp.Domain.Enums;

namespace PurchaseOrderApp.Application.Services;

public class PurchaseOrderService(IPurchaseOrderRepository repo) : IPurchaseOrderService
{
    public async Task<PagedResult<PurchaseOrderListItemDto>> GetAsync(
        string? supplier, PurchaseOrderStatus? status, DateTime? from, DateTime? to,
        string? sortBy, string? sortDir, int pageNumber, int pageSize)
    {
        var (items, total) = await repo.QueryAsync(supplier, status, from, to, sortBy, sortDir, pageNumber, pageSize);
        var mapped = items.Select(MapList);
        return new(mapped, total, pageNumber < 1 ? 1 : pageNumber, pageSize < 1 ? 10 : pageSize);
    }

    public async Task<PurchaseOrderDetailDto?> GetByIdAsync(int id)
    {
        var po = await repo.GetByIdAsync(id);
        return po is null ? null : MapDetail(po);
    }

    public async Task<int> CreateAsync(PurchaseOrderCreateDto dto)
    {
        // Enforce unique PO Number
        if (await repo.GetByPONumberAsync(dto.PONumber) is not null)
            throw new InvalidOperationException($"PO Number '{dto.PONumber}' already exists.");

        var po = new PurchaseOrder
        {
            PONumber = dto.PONumber.Trim(),
            Description = dto.Description?.Trim() ?? string.Empty,
            SupplierName = dto.SupplierName.Trim(),
            OrderDate = dto.OrderDate.Date,
            TotalAmount = Math.Round(dto.TotalAmount, 2, MidpointRounding.AwayFromZero),
            Status = dto.Status
        };

        await repo.AddAsync(po);
        await repo.SaveChangesAsync();
        return po.Id;
    }

    public async Task<bool> UpdateAsync(int id, PurchaseOrderUpdateDto dto)
    {
        var po = await repo.GetByIdAsync(id);
        if (po is null) return false;

        if (!string.Equals(po.PONumber, dto.PONumber, StringComparison.OrdinalIgnoreCase))
        {
            if (await repo.GetByPONumberAsync(dto.PONumber) is not null)
                throw new InvalidOperationException($"PO Number '{dto.PONumber}' already exists.");
            po.PONumber = dto.PONumber.Trim();
        }

        po.Description = dto.Description?.Trim() ?? string.Empty;
        po.SupplierName = dto.SupplierName.Trim();
        po.OrderDate = dto.OrderDate.Date;
        po.TotalAmount = Math.Round(dto.TotalAmount, 2, MidpointRounding.AwayFromZero);
        po.Status = dto.Status;

        await repo.UpdateAsync(po);
        return await repo.SaveChangesAsync();
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var po = await repo.GetByIdAsync(id);
        if (po is null) return false;

        await repo.DeleteAsync(po);
        return await repo.SaveChangesAsync();
    }

    private static PurchaseOrderListItemDto MapList(PurchaseOrder x) =>
        new(x.Id, x.PONumber, x.Description, x.SupplierName, x.OrderDate, x.TotalAmount, x.Status);

    private static PurchaseOrderDetailDto MapDetail(PurchaseOrder x) =>
        new(x.Id, x.PONumber, x.Description, x.SupplierName, x.OrderDate, x.TotalAmount, x.Status);
}
