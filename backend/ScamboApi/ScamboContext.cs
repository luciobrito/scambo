using System;
using Microsoft.EntityFrameworkCore;
using ScamboApi.Interfaces;
using ScamboApi.Models;

namespace ScamboApi;

public class ScamboContext : DbContext
{
    public DbSet<Anuncio> Anuncios {get;set;}
    public DbSet<Chat> Chats {get;set;}
    public DbSet<Usuario> Usuarios {get;set;}
    public DbSet<Mensagem> Mensagens {get;set;}

    public override int SaveChanges(bool acceptAllChangesOnSuccess)
    {
        ApplyTimestamps();
        return base.SaveChanges(acceptAllChangesOnSuccess);
    }
    public override Task<int> SaveChangesAsync(bool acceptAllChangesOnSuccess,
        CancellationToken cancellationToken = default)
    {
        ApplyTimestamps();
        return base.SaveChangesAsync(acceptAllChangesOnSuccess, cancellationToken);
    }
    public ScamboContext(DbContextOptions<ScamboContext> options) : base(options)
    {
        
        
    }
    private void ApplyTimestamps()
    {
        foreach(var entry in ChangeTracker.Entries<ITimestampedEntity>())
        {
            if(entry.State == EntityState.Added)
            {
                entry.Entity.CriadoEm = DateTime.Now;
                entry.Entity.AtualizadoEm = null;
            }
            else if(entry.State == EntityState.Modified)
            {
                entry.Property(x => x.CriadoEm).IsModified = false;
                entry.Entity.AtualizadoEm = DateTime.Now;
            }
        }
    }
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Usuario>().HasMany(e => e.Anuncios);
        modelBuilder.Entity<Anuncio>().HasOne(e => e.Anunciante);
    }

}
