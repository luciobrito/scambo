using Microsoft.AspNetCore.Mvc;
using ScamboApi.DTOs;
using ScamboApi.Models;
namespace ScamboApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UsuariosController : ControllerBase
{
    private readonly ScamboContext _db;
    public UsuariosController(ScamboContext db)
    {
        _db = db;
    }
    [HttpGet]
    public IActionResult ObterTodos()
    {
        return Ok("Lista de usuários cadastrados");
    }
    [HttpGet("{id}")]
    public IActionResult ObterPorId(int id)
    {
        return Ok($"Usuário com ID {id} encontrado");
    }
  
    [HttpPost]
    public IActionResult CriarUsuario([FromBody] UsuarioRegistroDTO novoUsuario)
    {
        Usuario usuario = new Usuario(novoUsuario);
        _db.Usuarios.Add(usuario);
        _db.SaveChanges();
        return Created("", novoUsuario);
    }
    [HttpPut("{id}")]
    public IActionResult AtualizarUsuario(int id, [FromBody] Usuario usuarioAtualizado)
    {
        return Ok($"Usuário com ID {id} atualizado");
    }
    [HttpDelete("{id}")]
    public IActionResult ExcluirUsuario(int id)
    {
        return NoContent();
    }
}
