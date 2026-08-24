using System;
using Microsoft.EntityFrameworkCore;
using ScamboApi;
namespace Tests;

public class TesteIntegracaoDB
{
    private class ScamboContextTest : DbContext
    {
        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseMySQL("Server=localhost;Port=3306;Database=scambo;User=scambo_api;Password=123;");
        }
    }
    [Fact]
    public async Task ConexaoBancoDeDados()
    {
        ScamboContextTest db = new ScamboContextTest();
        Assert.True(db.Database.CanConnect());
        Assert.True(await db.Database.CanConnectAsync());
    }
}
