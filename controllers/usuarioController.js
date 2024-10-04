const Usuario = require('../models').Usuario;
const { Op } = require('sequelize');

// Cadastrar um usuário no sistema
const CadastrarUsuario = async (req, res) => {
  const { nome, email, senha, tipo, endereco, telefone } = req.body;
  try {
    const novoUsuario = await Usuario.create({
      nome,
      email,
      senha,
      tipo,
      primeiro_acesso: true,
      endereco,
      telefone,
    });
    res.status(201).json(novoUsuario);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao cadastrar o usuário.' });
  }
};

// Atualizar um usuário existente
const AtualizarUsuario = async (req, res) => {
  const { id } = req.params;
  const { nome, email, senha, tipo, endereco, telefone } = req.body;

  try {
    const usuario = await Usuario.findByPk(id);
    if (!usuario) {
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }

    await usuario.update({
      nome,
      email,
      senha,
      tipo,
      endereco,
      telefone,
    });

    res.status(200).json(usuario);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar o usuário.' });
  }
};

// Deletar um usuário
const DeletarUsuario = async (req, res) => {
  const { id } = req.params;

  try {
    const usuario = await Usuario.findByPk(id);
    if (!usuario) {
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }

    await usuario.destroy();
    res.status(200).json({ message: 'Usuário deletado com sucesso.' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao deletar o usuário.' });
  }
};

// Ver um usuário pelo ID
const VerUsuario = async (req, res) => {
  const { id } = req.params;

  try {
    const usuario = await Usuario.findByPk(id);
    if (!usuario) {
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }

    res.status(200).json(usuario);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar o usuário.' });
  }
};

// Ver todos os usuários
const VerTodosUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.findAll();
    res.status(200).json(usuarios);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar os usuários.' });
  }
};

const BuscarUsuarioDinamico = async (req, res) => {
  const { q } = req.query; // O termo de busca passado na URL

  if (!q) {
    return res.status(400).json({ error: 'Por favor, forneça um termo de busca.' });
  }

  try {
    const usuarios = await Usuario.findAll({
      where: {
        [Op.or]: [
          { nome: { [Op.like]: `%${q}%` } },
          { email: { [Op.like]: `%${q}%` } },
          { telefone: { [Op.like]: `%${q}%` } },
          { tipo: { [Op.like]: `%${q}%` } }
        ]
      }
    });

    if (usuarios.length === 0) {
      return res.status(404).json({ message: 'Nenhum usuário encontrado.' });
    }

    res.status(200).json(usuarios);
  } catch (error) {
    console.error('Erro ao buscar usuários:', error);
    res.status(500).json({ error: 'Erro ao buscar usuários' });
  }
};

module.exports = {
  CadastrarUsuario,
  AtualizarUsuario,
  DeletarUsuario,
  VerUsuario,
  VerTodosUsuarios,
  BuscarUsuarioDinamico
};
