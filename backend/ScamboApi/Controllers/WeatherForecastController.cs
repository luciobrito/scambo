using Microsoft.AspNetCore.Mvc;

namespace ScamboApi.Controllers;

[ApiController]
[Route("[controller]")]
public class WeatherForecastController : ControllerBase
{
    private readonly ScamboContext _db;

    public WeatherForecastController(ScamboContext db)
    {
        _db = db;
    }
    private static readonly string[] Summaries =
    [
        "Gelo"
    ];

    [HttpGet(Name = "GetWeatherForecast")]
    public IEnumerable<WeatherForecast> Get()
    {
        return Enumerable.Range(1, 5).Select(index => new WeatherForecast
        {
            Date = DateOnly.FromDateTime(DateTime.Now.AddDays(index)),
            TemperatureC = Random.Shared.Next(-20, 55),
            Summary = Summaries[Random.Shared.Next(Summaries.Length)]
        })
        .ToArray();
    }
    [HttpGet("conexao")]
    public string Conexao()
    {
        return _db.Database.CanConnect().ToString();
    }
}
