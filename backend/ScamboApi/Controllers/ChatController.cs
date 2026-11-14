using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ScamboApi.DTOs;
using ScamboApi.Extensions;
using ScamboApi.Models;
namespace ScamboApi.Controllers;


[ApiController]
[Route("api/[controller]")]
public class ChatController : ControllerBase
{
    private readonly ScamboContext _db;

    public ChatController(ScamboContext db)
    {
        _db = db;        
    }
    
    
    // TODO(front): a tela /app/chat também espera GET api/chat/conversas,
    // POST api/chat/conversas e PUT api/chat/mensagens/{idConversa}/visualizadas.
    // Formatos em docs/CONTRATO_API.md, seção "Chat".

    // TODO(front): deve retornar o array de mensagens da conversa (hoje retorna texto).
    // TODO(front): corpo esperado { conversaId, conteudo }; salvar e retornar 201 com a Mensagem criada.
    [HttpPost("enviar")]
    public IActionResult EnviarMensagem([FromBody] Chat novaMensagem)
    {
        return Created("", novaMensagem);
    }
    [Authorize]
    [HttpPost("novo")]
    public async Task<IActionResult> NovoChat([FromBody] NovoChatDTO novoChat)
    {
        Chat chat = new Chat();
        
        Anuncio anuncio = await _db.Anuncios.Include(a => a.Anunciante).FirstOrDefaultAsync(a => a.Id == novoChat.idAnuncio);
        chat.Anuncio = anuncio!;
        Usuario usuarioLogado = await _db.Usuarios.FindAsync(int.Parse (User.Claims.FirstOrDefault(x => x.Type ==ClaimTypes.NameIdentifier)?.Value ?? "0"));
        if(anuncio!.Anunciante.Equals(usuarioLogado!)) 
            return BadRequest("Não pode iniciar um chat no seu próprio anuncio.");
        chat.Remetente = usuarioLogado!;
        _db.Chats.Add(chat);
        _db.SaveChanges();
        return Created("", chat);

    }
    [Authorize]
    [HttpGet("mychats")]
    public async Task<IActionResult> MyChats()
    {
        Usuario usuarioLogado = await _db.Usuarios.FindAsync(int.Parse (User.Claims.FirstOrDefault(x => x.Type ==ClaimTypes.NameIdentifier)?.Value ?? "0"));
        List<Chat> chatsDoUsuario = _db.Chats.Include("Anuncio.Anunciante").Where(chat => chat.Remetente.Equals(usuarioLogado) || chat.Anuncio.Anunciante.Equals(usuarioLogado)).ToList();
        return Ok(chatsDoUsuario);
    }
    [Authorize]
    [HttpGet("mensagens/{idChat}")]
    public async Task<IActionResult> MensagensPorChat([FromHeader] int idChat)
    {   
        Usuario usuarioLogado = await _db.Usuarios.FindAsync(User.AuthUserId());
        Chat chat = _db.Chats
            .Include("Anuncio.Anunciante")
            .Include("Remetente")
            .Include("Mensagens")
            .FirstOrDefault(c => c.Id == idChat);
        if (chat.UsuarioFazParteDoChat(usuarioLogado))
        {
            return Ok(chat.Mensagens);
        }
        return Unauthorized("Usuário não faz parte do chat");
    }
}
