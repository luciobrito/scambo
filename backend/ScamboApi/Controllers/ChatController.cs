using Microsoft.AspNetCore.Mvc;
using ScamboApi.Models;
namespace ScamboApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ChatController : ControllerBase
{
    // TODO(front): a tela /app/chat também espera GET api/chat/conversas,
    // POST api/chat/conversas e PUT api/chat/mensagens/{idConversa}/visualizadas.
    // Formatos em docs/CONTRATO_API.md, seção "Chat".

    // TODO(front): deve retornar o array de mensagens da conversa (hoje retorna texto).
    [HttpGet("mensagens/{idConversa}")]
    public IActionResult ObeterMensagens(int idConversa)
    {
        return Ok($"Mensagens da conversa com ID {idConversa}");
    }
    // TODO(front): corpo esperado { conversaId, conteudo }; salvar e retornar 201 com a Mensagem criada.
    [HttpPost("enviar")]
    public IActionResult EnviarMensagem([FromBody] Chat novaMensagem)
    {
        return Created("", novaMensagem);
    }
}
