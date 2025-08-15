using Microsoft.AspNetCore.Mvc;
using PurchaseOrderApp.Application.DTOs;
using PurchaseOrderApp.Application.Interfaces;
using PurchaseOrderApp.Domain.Enums;

namespace PurchaseOrderApp.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PurchaseOrdersController(IPurchaseOrderService service) : ControllerBase
{
    /// <summary>
    /// List purchase orders with filtering, sorting, and pagination.
    /// </summary>
    [HttpGet]
    public async Task<ActionResult<PagedResult<PurchaseOrderListItemDto>>> Get(
        [FromQuery] string? supplier,
        [FromQuery] PurchaseOrderStatus? status,
        [FromQuery] DateTime? dateFrom,
        [FromQuery] DateTime? dateTo,
        [FromQuery] string? sortBy,
        [FromQuery] string? sortDir,
        [FromQuery] int pageNumber = 1,
        [FromQuery] int pageSize = 10)
    {
        var result = await service.GetAsync(supplier, status, dateFrom, dateTo, sortBy, sortDir, pageNumber, pageSize);
        return Ok(result);
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<PurchaseOrderDetailDto>> GetById(int id)
    {
        var po = await service.GetByIdAsync(id);
        return po is null ? NotFound() : Ok(po);
    }

    [HttpPost]
    public async Task<ActionResult<int>> Create([FromBody] PurchaseOrderCreateDto dto)
    {
        if (!ModelState.IsValid) return ValidationProblem(ModelState);
        var id = await service.CreateAsync(dto);
        return CreatedAtAction(nameof(GetById), new { id }, id);
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, [FromBody] PurchaseOrderUpdateDto dto)
    {
        if (!ModelState.IsValid) return ValidationProblem(ModelState);
        var ok = await service.UpdateAsync(id, dto);
        return ok ? NoContent() : NotFound();
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var ok = await service.DeleteAsync(id);
        return ok ? NoContent() : NotFound();
    }
}
