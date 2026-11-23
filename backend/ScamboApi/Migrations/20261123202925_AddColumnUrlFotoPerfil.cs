using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ScamboApi.Migrations
{
    /// <inheritdoc />
    public partial class AddColumnUrlFotoPerfil : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "UrlFotoPerfil",
                table: "Usuarios",
                type: "longtext",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "UrlFotoPerfil",
                table: "Usuarios");
        }
    }
}
