using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ScamboApi.Migrations
{
    /// <inheritdoc />
    public partial class RemoveMensagemDestinatarioField : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Mensagens_Usuarios_DestinatarioId",
                table: "Mensagens");

            migrationBuilder.DropIndex(
                name: "IX_Mensagens_DestinatarioId",
                table: "Mensagens");

            migrationBuilder.DropColumn(
                name: "DestinatarioId",
                table: "Mensagens");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "DestinatarioId",
                table: "Mensagens",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_Mensagens_DestinatarioId",
                table: "Mensagens",
                column: "DestinatarioId");

            migrationBuilder.AddForeignKey(
                name: "FK_Mensagens_Usuarios_DestinatarioId",
                table: "Mensagens",
                column: "DestinatarioId",
                principalTable: "Usuarios",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
