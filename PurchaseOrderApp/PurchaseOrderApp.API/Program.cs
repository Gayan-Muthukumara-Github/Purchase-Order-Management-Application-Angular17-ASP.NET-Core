using Microsoft.EntityFrameworkCore;
using PurchaseOrderApp.API.Middleware;
using PurchaseOrderApp.Application.Interfaces;
using PurchaseOrderApp.Application.Services;
using PurchaseOrderApp.Infrastructure.Data;
using PurchaseOrderApp.Infrastructure.Repositories;
using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container

builder.Services.AddControllers()
    .AddJsonOptions(o =>
    {
        // enum as string for readability
        o.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
        // DateTimes are ISO 8601 by default
    });

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
        policy.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod());
});
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// EF Core
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<ApplicationDbContext>(opt =>
    opt.UseSqlServer(connectionString));

// DI
builder.Services.AddScoped<IPurchaseOrderRepository, PurchaseOrderRepository>();
builder.Services.AddScoped<IPurchaseOrderService, PurchaseOrderService>();

var app = builder.Build();

app.UseCors("AllowAll");
app.UseMiddleware<ExceptionHandlingMiddleware>();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

// DB migrate + seed
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
    await SeedData.SeedAsync(db);
}

await app.RunAsync();
