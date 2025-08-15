using PurchaseOrderApp.Domain.Enums;

namespace PurchaseOrderApp.Domain.Entities;

public class PurchaseOrder
{
    public int Id { get; set; }

    // Unique business identifier
    public string PONumber { get; set; } = default!;

    public string Description { get; set; } = default!;

    public string SupplierName { get; set; } = default!;

    public DateTime OrderDate { get; set; }

    // Persist with 2 decimal places in DB
    public decimal TotalAmount { get; set; }

    public PurchaseOrderStatus Status { get; set; }
}
