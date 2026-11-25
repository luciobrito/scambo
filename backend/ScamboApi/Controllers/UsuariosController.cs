using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ScamboApi.DTOs;
using ScamboApi.Models;
using ScamboApi.Services;
namespace ScamboApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UsuariosController : ControllerBase
{
    private readonly ScamboContext _db;
    private readonly IAuthService _auth;
    public UsuariosController(ScamboContext db, IAuthService auth)
    {
        _db = db;
        _auth = auth;
    }
    // TODO(front): a sidebar e a tela /app/profile esperam GET api/usuarios/me,
    // GET api/usuarios/me/perfil e PATCH api/usuarios/me (dependem da autenticação).
    // Formatos em docs/CONTRATO_API.md; ordem sugerida em docs/GUIA_BACKEND.md.
    [HttpGet("/find/{id}")]
    public IActionResult ObterPorId(int id)
    {
        return Ok($"Usuário com ID {id} encontrado");
    }
  
    // TODO(front): cadastro. Retornar 201 sem a senha e erros 400/409; ver docs/CONTRATO_API.md,
    // seção "POST api/usuarios". Observação: a senha está sendo salva sem hash.
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
    [Authorize]
    [HttpGet]
    public IActionResult MeuUsuario()
    {
        var user = int.Parse (User.Claims.FirstOrDefault(x => x.Type ==ClaimTypes.NameIdentifier)?.Value ?? "0");
        Usuario usuario = _db.Usuarios.Find(user);
        usuario.Senha = "";
        return Ok(usuario);
    }
}
