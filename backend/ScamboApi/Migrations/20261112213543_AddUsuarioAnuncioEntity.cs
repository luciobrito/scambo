using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ScamboApi.Migrations
{
    /// <inheritdoc />
    public partial class AddUsuarioAnuncioEntity : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "DestinatarioId",
                table: "Mensagens",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "AnuncianteId",
                table: "Anuncios",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_Mensagens_DestinatarioId",
                table: "Mensagens",
                column: "DestinatarioId");

            migrationBuilder.CreateIndex(
                name: "IX_Anuncios_AnuncianteId",
                table: "Anuncios",
                column: "AnuncianteId");

            migrationBuilder.AddForeignKey(
                name: "FK_Anuncios_Usuarios_AnuncianteId",
                table: "Anuncios",
                column: "AnuncianteId",
                principalTable: "Usuarios",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Mensagens_Usuarios_DestinatarioId",
                table: "Mensagens",
                column: "DestinatarioId",
                principalTable: "Usuarios",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Anuncios_Usuarios_AnuncianteId",
                table: "Anuncios");

            migrationBuilder.DropForeignKey(
                name: "FK_Mensagens_Usuarios_DestinatarioId",
                table: "Mensagens");

            migrationBuilder.DropIndex(
                name: "IX_Mensagens_DestinatarioId",
                table: "Mensagens");

            migrationBuilder.DropIndex(
                name: "IX_Anuncios_AnuncianteId",
                table: "Anuncios");

            migrationBuilder.DropColumn(
                name: "DestinatarioId",
                table: "Mensagens");

            migrationBuilder.DropColumn(
                name: "AnuncianteId",
                table: "Anuncios");
        }
    }
}
