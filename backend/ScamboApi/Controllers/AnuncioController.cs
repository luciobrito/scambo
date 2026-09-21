using Microsoft.AspNetCore.Mvc;
using ScamboApi.Models;
namespace ScamboApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AnuncioController : ControllerBase
{
    [HttpGet]
    public IActionResult ObterTodos()
    {
        return Ok("Lista de anúncios para o feed");
    }
    [HttpGet("{id}")]
    public IActionResult ObterPorId(int id)
    {
        return Ok($"Detalhes do anuncio ID {id}");
    }
    [HttpPost]
    public IactionResult CriarAnuncio([FromBody] Anuncio novoAnuncio)
    {
        return Created("", novoAnuncio);
    }
    [HttpPut("{id}")]
    public IActionResult AtualizarAnuncio(int id, [FromBody] Anuncio anuncioAtualizado)
    {
        return Ok($"Anuncio com ID {id} atualizado");
    }
    [HttpDelete("{id}")]
    public IActionResult DeletarAnuncio(int id)
    {
        return NoContent();
    }
}
