using System;
using Microsoft.AspNetCore.SignalR;

namespace ScamboApi.Services;
public interface IMensagensClient
{
    Task EnviarMensagens(string mensagem);
}
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
