const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();

// Configuração do pool de conexão com o banco de dados
const pool = new Pool({
    user: 'postgres', // Substitua pelo seu usuário do PostgreSQL (verifique no seu computador na hora da prova!)
    host: 'localhost',
    database: 'tarefasKanban', // Nome da sua database
    password: '12345', // Substitua pela sua senha
    port: 5432, // Porta padrão do PostgreSQL
});

app.use(cors());
app.use(express.json());

// Endpoint para obter todas as tarefas
app.get('/tarefas', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM tarefas');
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Erro ao buscar tarefas' });
  }
});

// Endpoint para obter uma tarefa específica
app.get('/tarefas/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM tarefas WHERE id_tarefa = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Tarefa não encontrada' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Erro ao buscar tarefa' });
  }
});

// Endpoint para adicionar uma nova tarefa
app.post('/tarefas', async (req, res) => {
  const { id_usuario, descricao, nome_setor, prioridade, data_cadastro, status } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO tarefas (id_usuario, descricao, nome_setor, prioridade, data_cadastro, status) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [id_usuario, descricao, nome_setor, prioridade, data_cadastro, status]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Erro ao adicionar tarefa' });
  }
});

// Endpoint para atualizar uma tarefa existente
app.put('/tarefas/:id', async (req, res) => {
  const { id } = req.params;
  const { id_usuario, descricao, nome_setor, prioridade, data_cadastro, status } = req.body;
  try {
    const result = await pool.query(
      'UPDATE tarefas SET id_usuario = $1, descricao = $2, nome_setor = $3, prioridade = $4, data_cadastro = $5, status = $6 WHERE id_tarefa = $7 RETURNING *',
      [id_usuario, descricao, nome_setor, prioridade, data_cadastro, status, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Tarefa não encontrada' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Erro ao atualizar tarefa' });
  }
});

// Endpoint para deletar uma tarefa
app.delete('/tarefas/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM tarefas WHERE id_tarefa = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Tarefa não encontrada' });
    }
    res.json({ message: 'Tarefa deletada com sucesso' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Erro ao deletar tarefa' });
  }
});

// Endpoint para adicionar um novo cliente
app.post('/usuarios', async (req, res) => {
  const { nome, email } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO usuario (nome, email) VALUES ($1, $2) RETURNING *',
      [nome, email]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Erro ao adicionar usuario' });
  }
});

// Endpoint para listar todos os clientes
app.get('/usuarios', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM usuario');
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Erro ao buscar usuario' });
  }
});

// Inicializa o servidor na porta 3000
app.listen(3000, () => {
  console.log('Servidor rodando na porta 3000');
});
