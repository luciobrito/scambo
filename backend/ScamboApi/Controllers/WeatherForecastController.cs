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
        /*
        Erro: ao enviar para Azure, o arquivo está indo com todo
        o diretório do sistema. 
        (/home/usuario/arquivo.png) deveria ser apenas (arquivo.png)
        Manusear arquivo em memória?
        */
        using(var fs = new FileStream("/arquivo.png",FileMode.Create))
        {
            file.CopyTo(fs);
            fs.Position = 0;
            _armazenamento.EnviarArquivo(fs);
        }
        return "arquivo";
    }
}
