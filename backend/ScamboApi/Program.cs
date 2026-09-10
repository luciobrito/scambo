using System.Reflection.Metadata;
using Azure.Storage.Blobs;
using Microsoft.EntityFrameworkCore;
using ScamboApi;
using ScamboApi.Services;

var builder = WebApplication.CreateBuilder(args);
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection") ?? "";
var storageConnectionString = "";
// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();
builder.Services.AddDbContext<ScamboContext>(options => options.UseMySQL(connectionString));
builder.Services.AddScoped<IServicoArmazenamento>(provider =>
{
    BlobContainerClient blobClient = new BlobContainerClient(storageConnectionString,"imagens");
    return new ServicoArmazenamento(blobClient);
});
var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

//app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
