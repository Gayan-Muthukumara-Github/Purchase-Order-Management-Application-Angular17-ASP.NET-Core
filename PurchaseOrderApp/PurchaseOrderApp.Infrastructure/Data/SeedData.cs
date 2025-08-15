using Microsoft.EntityFrameworkCore;
using PurchaseOrderApp.Domain.Entities;
using PurchaseOrderApp.Domain.Enums;

namespace PurchaseOrderApp.Infrastructure.Data;

public static class SeedData
{
    public static async Task SeedAsync(ApplicationDbContext db)
    {
        await db.Database.MigrateAsync();

        if (await db.PurchaseOrders.AnyAsync()) return;

        var now = DateTime.UtcNow.Date;
        var seed = new List<PurchaseOrder>
        {
            new() { PONumber = "PO-10001", Description = "Office chairs", SupplierName = "Acme Supplies",
                OrderDate = now.AddDays(-20), TotalAmount = 1250.00m, Status = PurchaseOrderStatus.Approved },
            new() { PONumber = "PO-10002", Description = "Laptops batch", SupplierName = "TechWorld",
                OrderDate = now.AddDays(-15), TotalAmount = 15450.75m, Status = PurchaseOrderStatus.Shipped },
            new() { PONumber = "PO-10003", Description = "Printer ink", SupplierName = "PrintCo",
                OrderDate = now.AddDays(-10), TotalAmount = 399.99m, Status = PurchaseOrderStatus.Draft },
            new() { PONumber = "PO-10004", Description = "Coffee beans", SupplierName = "Bean Brothers",
                OrderDate = now.AddDays(-5), TotalAmount = 220.50m, Status = PurchaseOrderStatus.Completed }
        };

        db.PurchaseOrders.AddRange(seed);
        await db.SaveChangesAsync();
    }
}
