using System;

namespace ScamboApi.Interfaces;

public interface ITimestampedEntity
{
    public DateTime CriadoEm { get; set; }
    public DateTime? AtualizadoEm {get;set;}
    
}
