using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ScamboApi.Migrations
{
    /// <inheritdoc />
    public partial class AddTimestamps : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "AtualizadoEm",
                table: "Usuarios",
                type: "datetime(6)",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "CriadoEm",
                table: "Usuarios",
                type: "datetime(6)",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<DateTime>(
                name: "AtualizadoEm",
                table: "Chats",
                type: "datetime(6)",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "CriadoEm",
                table: "Chats",
                type: "datetime(6)",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AtualizadoEm",
                table: "Usuarios");

            migrationBuilder.DropColumn(
                name: "CriadoEm",
                table: "Usuarios");

            migrationBuilder.DropColumn(
                name: "AtualizadoEm",
                table: "Chats");

            migrationBuilder.DropColumn(
                name: "CriadoEm",
                table: "Chats");
        }
    }
}
