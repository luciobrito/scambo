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
                create table usuarios(
	                uid int primary key,
	                nome varchar(100) not null,
	                email varchar(100) not null,
	                senha varchar(100) not null,
	                telefone varchar(15) not null
                )
            
            ");
            migrationBuilder.Sql(@"
            create table enderecos (
	id int primary key,
	fk_uid int not null,
	rua varchar(50) not null,
	numero varchar(5) not null,
	complemento varchar(30),
	bairro varchar(50) not null,
	cidade varchar(50) not null,
	uf varchar(2) not null,
	
	foreign key (fk_uid) references usuarios(uid)

)


            ");
            migrationBuilder.Sql(@"create table anuncios (
	id_anuncio int primary key,
	fk_uid_anunciante int,
	fk_id_endereco int,
	titulo varchar(100) not null,
	descricao varchar(255),
	estado enum('novo','pouco usado','usado') not null,
	condicao enum('impecavel','desgastado','boas_condicoes') not null,
	
	foreign key (fk_uid_anunciante) references usuarios(uid),
	foreign key (fk_id_endereco) references enderecos(id)

)");
        migrationBuilder.Sql(@"create table avaliacoes (
	id int not null,
	fk_uid_doador int,
	fk_uid_receptor int,
	nota int not null,
	comentario varchar(255),
	
	foreign key (fk_uid_doador) references usuarios(uid),
	foreign key (fk_uid_receptor) references usuarios(uid)
)");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            //Para reverter as alterações
            //migrationBuilder.Sql("DROP TABLE exemplo");
        }
    }
}
