using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ScamboApi.Migrations
{
    /// <inheritdoc />
    public partial class ScriptInicial : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterDatabase()
                .Annotation("MySQL:Charset", "utf8mb4");
            //Criar tabelas aqui ↓
            migrationBuilder.Sql(@"
                
            
            ");
            migrationBuilder.Sql(@"
            
            ");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            //Para reverter as alterações
            //migrationBuilder.Sql("DROP TABLE exemplo");
        }
    }
}
