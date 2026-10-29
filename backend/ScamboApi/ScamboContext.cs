using System;
using Microsoft.EntityFrameworkCore;
using ScamboApi.Models;

namespace ScamboApi;

public class ScamboContext : DbContext
{
    public DbSet<Anuncio> Anuncios {get;set;}
    public DbSet<Chat> Chats {get;set;}
    public DbSet<Usuario> Usuarios {get;set;}
    public DbSet<Mensagem> Mensagens {get;set;}
    public ScamboContext(DbContextOptions<ScamboContext> options) : base(options)
    {
        
        
    }

}
