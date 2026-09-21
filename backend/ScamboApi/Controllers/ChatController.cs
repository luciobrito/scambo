using Microsoft.AspNetCore.Mvc;
using ScamboApi.Models;
namespace ScamboApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ChatController : ControllerBase
{
    [HttpGet("mensagens/{idConversa}")]
    public IActionResult ObeterMensagens(int idConversa)
    {
        return Ok($"Mensagens da conversa com ID {idConversa}");
    }
    [HttpPost("enviar")]
    public IActionResult EnviarMensagem([FromBody] chat novaMensagem)
    {
        return Created("", novaMensagem);
    }
}
