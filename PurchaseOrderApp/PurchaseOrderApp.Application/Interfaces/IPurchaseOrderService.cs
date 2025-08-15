using PurchaseOrderApp.Application.DTOs;
using PurchaseOrderApp.Domain.Enums;

namespace PurchaseOrderApp.Application.Interfaces;

public interface IPurchaseOrderService
{
    Task<PagedResult<PurchaseOrderListItemDto>> GetAsync(
        string? supplier, PurchaseOrderStatus? status, DateTime? from, DateTime? to,
        string? sortBy, string? sortDir, int pageNumber, int pageSize);

    Task<PurchaseOrderDetailDto?> GetByIdAsync(int id);

    Task<int> CreateAsync(PurchaseOrderCreateDto dto);

    Task<bool> UpdateAsync(int id, PurchaseOrderUpdateDto dto);

    Task<bool> DeleteAsync(int id);
}
