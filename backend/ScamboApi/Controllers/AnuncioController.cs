using Microsoft.AspNetCore.Mvc;
using ScamboApi.Models;
namespace ScamboApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AnuncioController : ControllerBase
{
    // TODO(front): a tela /app/products já consome este endpoint. Deve retornar um array de
    // anúncios (hoje retorna texto). Formato em docs/CONTRATO_API.md, seção "GET api/anuncio".
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
    public IActionResult CriarAnuncio([FromBody] Anuncio novoAnuncio)
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
