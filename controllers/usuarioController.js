const Usuario = require('../models').Usuario;
const Responsavel = require('../models').Responsavel;
const { Op } = require('sequelize');  
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();



//login
const Login = async (req, res) => {
  const { email, senha } = req.body;

  try {
    // Verifica se o usuário existe
    const usuario = await Usuario.findOne({ where: { email } });
    if (!usuario) {
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }

    // Verifica se a senha está correta
    const senhaCorreta = await bcrypt.compare(senha, usuario.senha);
    if (!senhaCorreta) {  
      return res.status(401).json({ message: 'Senha incorreta.' });
    }

    // Busca as informações de empresa_id ou ict_id no modelo de Responsavel
    const responsavel = await Responsavel.findOne({ where: { usuario_id: usuario.id } });

    if (!responsavel) {
      return res.status(403).json({ message: 'Responsável não encontrado.' });
    }

    const { empresa_id, ict_id } = responsavel;

    // Gera o token JWT, incluindo empresa_id ou ict_id
    const token = jwt.sign(
      { id: usuario.id, email: usuario.email, role: usuario.tipo, empresa_id, ict_id },
      process.env.JWT_SECRET
    );

    // Retorna as informações no login
    res.status(200).json({
      message: 'Login bem-sucedido!',
      token,
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        tipo: usuario.tipo,
        empresa_id,
        ict_id
      }
    });
  } catch (error) {
    console.error('Erro ao fazer login:', error);
    res.status(500).json({ message: 'Erro ao fazer login.' });
  }
};

// Responsavel cadastra outro responsavel
const ResponsavelCadastrarUsuario = async (req, res) => {
  const { nome, email, senha, endereco, telefone, cargo } = req.body;
  const usuarioLogado = req.user; // O usuário que está logado

  console.log('Usuário logado:', usuarioLogado); // Log do usuário logado

  try {
    // 1. Buscar o registro de "Responsavel" do usuário logado
    const responsavelLogado = await Responsavel.findOne({
      where: { usuario_id: usuarioLogado.id }
    });

    console.log('Responsável logado:', responsavelLogado); // Log do responsável logado

    if (!responsavelLogado) {
      return res.status(403).json({ error: 'Usuário não tem permissão para cadastrar.' });
    }

    // 3. Armazenar o `empresa_id` ou `ict_id` corretamente
    let empresa_id = null;
    let ict_id = null;

    if (usuarioLogado.role === 'empresa') {
      empresa_id = responsavelLogado.empresa_id;  // Pega a empresa do responsável logado
      if (!empresa_id) {
        return res.status(403).json({ error: 'Empresa não associada ao responsável logado.' });
      }
    } else if (usuarioLogado.role === 'ict') {
      ict_id = responsavelLogado.ict_id;  // Pega a ICT do responsável logado
      if (!ict_id) {
        return res.status(403).json({ error: 'ICT não associada ao responsável logado.' });
      }
    } else {
      return res.status(400).json({ error: 'Tipo de usuário inválido.' });
    }

    // 4. Gerar hash da senha
    const senhaHash = await bcrypt.hash(senha, 10);

    // 5. Cadastrar o novo usuário com o tipo correto
    const novoUsuario = await Usuario.create({
      nome,
      email,
      senha: senhaHash,
      tipo: usuarioLogado.role, // O tipo é forçado a ser igual ao do responsável
      primeiro_acesso: true,
      endereco,
      telefone,
    });

    // 6. Criar o registro de "Responsavel" associado ao novo usuário
    await Responsavel.create({
      usuario_id: novoUsuario.id,
      cargo,
      empresa_id,
      ict_id
    });

    res.status(201).json({ 
      message: 'Usuário e responsável cadastrados com sucesso!',
      usuario: novoUsuario 
    });
  } catch (error) {
    console.error('Erro ao cadastrar o usuário e responsável:', error); // Log do erro
    res.status(500).json({ error: 'Erro ao cadastrar o usuário e responsável.' });
  }
};


// ADMIN Cadastrar um usuário no sistema
const CadastrarUsuario = async (req, res) => {
  const { nome, email, senha, tipo, endereco, telefone } = req.body;
  try {

    const senhaHash = await bcrypt.hash(senha, 10);

    const novoUsuario = await Usuario.create({
      nome,
      email,
      senha: senhaHash,
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

// ADMIN Atualizar um usuário existente
const AtualizarUsuario = async (req, res) => {
  const { id } = req.params;
  const { nome, email, senha, tipo, endereco, telefone } = req.body;

  try {
    const usuario = await Usuario.findByPk(id);

    const senhaHash = await bcrypt.hash(senha, 10);
    if (!usuario) {
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }

    await usuario.update({
      nome,
      email,
      senha: senhaHash,
      tipo,
      endereco,
      telefone,
    });

    res.status(200).json(usuario);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar o usuário.' });
  }
};

// ADMIN Deletar um usuário
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

// ADMIN Ver um usuário pelo ID
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

// ADMIN Ver todos os usuários
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
  BuscarUsuarioDinamico,
  ResponsavelCadastrarUsuario,
  Login
};
