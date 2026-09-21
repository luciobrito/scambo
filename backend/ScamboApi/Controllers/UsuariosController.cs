using Microsoft.AspNetCore.Mvc;
using ScamboApi.Models;
namespace ScamboApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UsuariosController : ControllerBase
{
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
    public IActionResult CriarUsuario([FromBody] Usuarios novoUsuario)
    {
        return Created("", novoUsuario);
    }
    [HttpPut("{id}")]
    public IActionResult AtualizarUsuario(int id, [FromBody] Usuarios usuarioAtualizado)
    {
        return Ok($"Usuário com ID {id} atualizado");
    }
    [HttpDelete("{id}")]
    public IActionResult ExcluirUsuario(int id)
    {
        return NoContent();
    }
}
