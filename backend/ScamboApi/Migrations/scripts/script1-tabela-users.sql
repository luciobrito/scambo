create table db_scambo.usuarios(
	uid int primary key,
	nome varchar(100) not null,
	email varchar(100) not null,
	senha varchar(100) not null,
	telefone varchar(15) not null
);