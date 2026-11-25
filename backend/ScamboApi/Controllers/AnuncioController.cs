using System.Data.Common;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ScamboApi.DTOs;
using ScamboApi.Models;
namespace ScamboApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AnuncioController(ScamboContext db) : ControllerBase
{
    private readonly ScamboContext _db = db;
    private readonly int _userId;

    [Authorize]
    [HttpGet]
    public IActionResult ObterTodos()
    {
        var anuncios = _db.Anuncios.Include(a => a.Anunciante).ToList();
        return Ok(anuncios);
    }
    [HttpGet("{id}")]
    public IActionResult ObterPorId(int id)
    {
        return Ok($"Detalhes do anuncio ID {id}");
    }
    [HttpPost]
    [Authorize]
    public IActionResult CriarAnuncio([FromBody] NovoAnuncioDTO novoAnuncio)
    {
        
        Anuncio anuncio = new Anuncio(novoAnuncio);
        Usuario user = _db.Usuarios.Find(int.Parse (User.Claims.FirstOrDefault(x => x.Type ==ClaimTypes.NameIdentifier)?.Value ?? "0"));
        anuncio.Anunciante = user;
        _db.Anuncios.Add(anuncio);
        _db.SaveChanges();
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
