create table db_scambo.avaliações (
	id int not null,
	fk_uid_doador int,
	fk_uid_receptor int,
	nota int not null,
	comentario varchar(255),
	
	foreign key (fk_uid_doador) references usuarios(uid),
	foreign key (fk_uid_receptor) references usuarios(uid)
)