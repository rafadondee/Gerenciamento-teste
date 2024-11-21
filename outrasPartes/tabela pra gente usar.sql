CREATE TABLE usuario (
	id_usuario serial PRIMARY KEY not null,
	nome varchar(255) not null,
	email VARCHAR(100) not null
);

CREATE TABLE tarefas (
	id_tarefa serial PRIMARY KEY not null,
	id_usuario serial,
	descricao varchar(255) not null,
	nome_setor varchar(255) not null,
	prioridade varchar(255) not null CHECK (prioridade IN ('baixa', 'media', 'alta')),
	data_cadastro date not null,
	status varchar(255) not null check (status in ('a fazer', 'fazendo', 'pronto')) default 'a fazer'
	FOREIGN KEY (id_usuario) REFERENCES usuario (id_usuario),
)