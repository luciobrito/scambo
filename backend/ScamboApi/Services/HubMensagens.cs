using System;
using Microsoft.AspNetCore.SignalR;
using Microsoft.AspNetCore.Authorization;

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
    public HubMensagens(ScamboContext db)
    {
        _db = db;
    }


    [Authorize]
    public async Task EnviarMensagem(string mensagem)
    {
        
        await Clients.All.SendAsync("ReceberMensagem", mensagem);
        
    }
    public string GetConnectionId()
    {
        return Context.ConnectionId;
    }

}
