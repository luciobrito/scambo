using System;
using Microsoft.AspNetCore.SignalR;

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
    public async Task EnviarMensagem(string mensagem)
    {
        await Clients.All.SendAsync("ReceberMensagem", mensagem);
        
    }
    public string GetConnectionId()
    {
        return Context.ConnectionId;
    }

}
