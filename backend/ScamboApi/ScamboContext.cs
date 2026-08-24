using System;
using Microsoft.EntityFrameworkCore;

namespace ScamboApi;

public class ScamboContext : DbContext
{
    public ScamboContext(DbContextOptions<ScamboContext> options) : base(options)
    {
        
        
    }

}
