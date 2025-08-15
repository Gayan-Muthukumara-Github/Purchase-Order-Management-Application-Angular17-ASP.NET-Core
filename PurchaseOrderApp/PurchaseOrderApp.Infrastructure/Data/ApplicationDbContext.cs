using Microsoft.EntityFrameworkCore;
using PurchaseOrderApp.Domain.Entities;
using System.Collections.Generic;
using System.Reflection.Emit;

namespace PurchaseOrderApp.Infrastructure.Data;

public class ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
    : DbContext(options)
{
    public DbSet<PurchaseOrder> PurchaseOrders => Set<PurchaseOrder>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<PurchaseOrder>(e =>
        {
            e.HasIndex(x => x.PONumber).IsUnique();
            e.Property(x => x.PONumber).IsRequired().HasMaxLength(50);
            e.Property(x => x.Description).HasMaxLength(500);
            e.Property(x => x.SupplierName).IsRequired().HasMaxLength(200);
            e.Property(x => x.TotalAmount).HasPrecision(18, 2);
        });
    }
}
