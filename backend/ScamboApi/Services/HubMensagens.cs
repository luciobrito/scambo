using System;
using Microsoft.AspNetCore.SignalR;
using Microsoft.AspNetCore.Authorization;
using ScamboApi.Models;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace ScamboApi.Services;
public interface IMensagensClient
{
    Task EnviarMensagens(string mensagem);
}
// TODO(front): hoje envia uma string para todos os clientes. A tela /app/chat espera grupos por
// conversa (EntrarConversa/SairConversa) e o evento ReceberMensagem com o objeto Mensagem.
// Detalhes em docs/CONTRATO_API.md, seção "Tempo real".

public class HubMensagens : Hub
{
    private readonly ScamboContext _db;
    private List<String> gruposConectados;
    public HubMensagens(ScamboContext db)
    {
        _db = db;
        gruposConectados = new List<string>();
    }

    public override async Task OnConnectedAsync()
    {
        AdicionarUsuarioAosGrupos();
    }
    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        foreach(string grupo in gruposConectados)
        {
            Groups.RemoveFromGroupAsync(Context.ConnectionId,grupo);
        }
    }
    [Authorize]
    public async Task EnviarMensagem(string conteudo, int idChat)
    {
        var userId = int.Parse( Context.User.Claims.FirstOrDefault(x => x.Type ==ClaimTypes.NameIdentifier)?.Value ?? "0");
        Usuario usuario = _db.Usuarios.Find(userId);
        Chat chat = await _db.Chats.Include("Anuncio")
            .Include("Remetente")
            .Include("Mensagens")
            .FirstOrDefaultAsync(x => x.Id == idChat);
        Mensagem mensagem = new Mensagem(){
            Chat = chat!, 
            Conteudo = conteudo,
            DataHora = DateTime.Now,
            Visualizada = false,
            Remetente = usuario,
            };
        _db.Mensagens.Add(mensagem);
        _db.SaveChanges();
        await Clients.Group(idChat.ToString()).SendAsync("ReceberMensagem", conteudo);
        
    }
    public string GetConnectionId()
    {
        return Context.ConnectionId;
    }
    private List<Chat> ChatsDoUsuario(int idUsuario)
    {
        var chats = _db.Chats.Include("Remetente")
            .Include("Anuncio.Anunciante")
            .Where(chat => chat.Remetente.Id == idUsuario || chat.Anuncio.Anunciante.Id == idUsuario)
            .ToList();
        return chats;
    }
    private async Task AdicionarAoGrupo(string nomeGrupo)
    {
        await Groups.AddToGroupAsync(Context.ConnectionId, nomeGrupo);
    }
    private async Task AdicionarUsuarioAosGrupos()
    {
        var userId = int.Parse(Context.User!.Claims.FirstOrDefault(x => x.Type ==ClaimTypes.NameIdentifier)?.Value ?? "0");
        foreach(Chat chat in ChatsDoUsuario(userId))
        {
            string nomeGrupo = chat.Id.ToString();
            gruposConectados.Add(nomeGrupo);
            await AdicionarAoGrupo(nomeGrupo);    
        }
    }
}
