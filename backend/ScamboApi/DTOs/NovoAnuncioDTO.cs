using System;

namespace ScamboApi.DTOs;

public class NovoAnuncioDTO{
    public required string Titulo {get;set;}
    public required string Descricao {get;set;}
    public required string EstadoConservacao {get;set;}
    public required string Modalidade {get;set;}
    public required string Status {get;set;}
}