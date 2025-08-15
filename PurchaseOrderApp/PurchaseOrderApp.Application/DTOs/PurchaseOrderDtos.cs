using PurchaseOrderApp.Domain.Enums;
using System.ComponentModel.DataAnnotations;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace PurchaseOrderApp.Application.DTOs;

// Custom decimal converter to always serialize with 2 decimals
public sealed class DecimalTwoPlacesJsonConverter : JsonConverter<decimal>
{
    public override decimal Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
        => reader.GetDecimal();

    public override void Write(Utf8JsonWriter writer, decimal value, JsonSerializerOptions options)
        => writer.WriteStringValue(value.ToString("0.00"));
}

public record PurchaseOrderListItemDto(
    int Id,
    string PONumber,
    string? Description,
    string SupplierName,
    DateTime OrderDate,
    [property: JsonConverter(typeof(DecimalTwoPlacesJsonConverter))] decimal TotalAmount,
    PurchaseOrderStatus Status
);

public record PurchaseOrderDetailDto(
    int Id,
    string PONumber,
    string? Description,
    string SupplierName,
    DateTime OrderDate,
    [property: JsonConverter(typeof(DecimalTwoPlacesJsonConverter))] decimal TotalAmount,
    PurchaseOrderStatus Status
);

public class PurchaseOrderCreateDto
{
    [Required, MaxLength(50)]
    public string PONumber { get; set; } = default!;

    [MaxLength(500)]
    public string? Description { get; set; }

    [Required, MaxLength(200)]
    public string SupplierName { get; set; } = default!;

    [Required]
    public DateTime OrderDate { get; set; }

    [Range(0, 999999999999.99)]
    public decimal TotalAmount { get; set; }

    [Required]
    public PurchaseOrderStatus Status { get; set; }
}

public class PurchaseOrderUpdateDto : PurchaseOrderCreateDto { }
