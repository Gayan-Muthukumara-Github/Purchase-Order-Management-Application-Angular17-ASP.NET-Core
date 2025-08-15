using System.Net;
using System.Text.Json;

namespace PurchaseOrderApp.API.Middleware;

public class ExceptionHandlingMiddleware(RequestDelegate next, ILogger<ExceptionHandlingMiddleware> logger)
{
    public async Task Invoke(HttpContext context)
    {
        try
        {
            await next(context);
        }
        catch (InvalidOperationException ex) // domain/validation type errors
        {
            logger.LogWarning(ex, "Business rule violation");
            await WriteProblem(context, HttpStatusCode.BadRequest, ex.Message);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Unhandled exception");
            await WriteProblem(context, HttpStatusCode.InternalServerError, "An unexpected error occurred.");
        }
    }

    private static Task WriteProblem(HttpContext ctx, HttpStatusCode code, string message)
    {
        ctx.Response.ContentType = "application/json";
        ctx.Response.StatusCode = (int)code;

        var payload = new
        {
            title = message,
            status = (int)code,
            traceId = ctx.TraceIdentifier
        };

        var json = JsonSerializer.Serialize(payload);
        return ctx.Response.WriteAsync(json);
    }
}
