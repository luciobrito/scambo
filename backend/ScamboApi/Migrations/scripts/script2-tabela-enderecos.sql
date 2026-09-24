create table db_scambo.endereços (
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

