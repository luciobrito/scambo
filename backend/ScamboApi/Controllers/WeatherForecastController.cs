using Microsoft.AspNetCore.Mvc;
using ScamboApi.Services;
using System.IO;
using System.Text;
namespace ScamboApi.Controllers;

[ApiController]
[Route("[controller]")]
public class WeatherForecastController : ControllerBase
{
    private readonly ScamboContext _db;
    private readonly IServicoArmazenamento _armazenamento;
    public WeatherForecastController(ScamboContext db, IServicoArmazenamento armazenamento)
    {
        _db = db;
        _armazenamento = armazenamento;
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
    [HttpPost("arquivo")]
    public string arquivo(IFormFile file)
    {   
        _armazenamento.EnviarArquivo(file);
        return "arquivo";
    }
    [HttpPost("arquivos")]
    public string Arquivos(IFormFileCollection file)
    {
        file.ToList().ForEach(f => {_armazenamento.EnviarArquivo(f);});
        return "arquivos";
    }
}
