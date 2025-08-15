using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PurchaseOrderApp.Application.DTOs;

public record PagedResult<T>(IEnumerable<T> Items, int TotalCount, int PageNumber, int PageSize);


