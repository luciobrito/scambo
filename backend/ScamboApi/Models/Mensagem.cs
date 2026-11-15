using System;
using System.Text.Json.Serialization;

namespace ScamboApi.Models;

public class Mensagem
{
    public int Id {get;set;}
    public required string Conteudo {get;set;}
    public DateTime DataHora {get;set;}
    public Usuario Remetente {get;set;}
    public bool Visualizada {get;set;}
    [JsonIgnore]
    public Chat Chat {get;set;}
    public Mensagem()
    {
        
    }    
}
