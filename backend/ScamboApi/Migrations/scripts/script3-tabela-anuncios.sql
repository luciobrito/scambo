create table db_scambo.anuncios (
	id_anuncio int primary key,
	fk_uid_anunciante int,
	fk_id_endereco int,
	titulo varchar(100) not null,
	descricao varchar(255),
	estado enum('novo','pouco usado','usado') not null,
	condicao enum('impecável','desgastado','boas condições') not null,
	
	foreign key (fk_uid_anunciante) references usuarios(uid),
	foreign key (fk_id_endereco) references endereços(id)

)