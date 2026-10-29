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
    // TODO(front): a sidebar e a tela /app/profile esperam GET api/usuarios/me,
    // GET api/usuarios/me/perfil e PATCH api/usuarios/me (dependem da autenticação).
    // Formatos em docs/CONTRATO_API.md; ordem sugerida em docs/GUIA_BACKEND.md.
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
  
    // TODO(front): cadastro. Retornar 201 sem a senha e erros 400/409; ver docs/CONTRATO_API.md,
    // seção "POST api/usuarios". Observação: a senha está sendo salva sem hash.
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
