const Usuario = require('../models').Usuario;
const Responsavel = require('../models').Responsavel;
const Empresa = require('../models').Empresa;
const Ict = require('../models').Ict;
const enviarEmail = require('../services/emailService');
const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');

// Trocar senha primeiro acesso:
const TrocarSenhaPrimeiroAcesso = async (req, res) => {
  const usuarioLogado = req.user;
  const { novaSenha } = req.body;

  try {
    // Buscar o usuário no banco de dados
    const usuario = await Usuario.findByPk(usuarioLogado.id);

    if (!usuario) {
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }

    // Verifica se é o primeiro acesso e atualiza a senha
    if (usuario.primeiro_acesso) {
      const novaSenhaHash = await bcrypt.hash(novaSenha, 10);

      usuario.senha = novaSenhaHash;
      usuario.primeiro_acesso = false; // Atualiza o campo para false após a troca de senha
      await usuario.save();

      res.status(200).json({ message: 'Senha atualizada com sucesso. Primeiro acesso concluído.' });
    } else {
      res.status(403).json({ message: 'A troca de senha inicial já foi realizada.' });
    }
  } catch (error) {
    console.error('Erro ao trocar senha:', error);
    res.status(500).json({ message: 'Erro ao trocar senha.' });
  }
};


// Responsavel cadastra outro responsavel
const ResponsavelCadastrarUsuario = async (req, res) => {
  const { nome, email, senha, endereco, telefone, cargo } = req.body;
  const usuarioLogado = req.user;

  console.log('Usuário logado:', usuarioLogado);

  try {
    const responsavelLogado = await Responsavel.findOne({
      where: { usuario_id: usuarioLogado.id }
    });

    console.log('Responsável logado:', responsavelLogado);

    if (!responsavelLogado) {
      return res.status(403).json({ message: 'Usuário não tem permissão para cadastrar.' });
    }
    let empresa_id = null;
    let ict_id = null;

    if (usuarioLogado.tipo === 'empresa') {
      empresa_id = responsavelLogado.empresa_id;
      if (!empresa_id) {
        return res.status(403).json({ message: 'Empresa não associada ao responsável logado.' });
      }
    } else if (usuarioLogado.tipo === 'ict') {
      ict_id = responsavelLogado.ict_id;
      if (!ict_id) {
        return res.status(403).json({ message: 'ICT não associada ao responsável logado.' });
      }
    } else {
      return res.status(400).json({ message: 'Tipo de usuário inválido.' });
    }

    const senhaHash = await bcrypt.hash(senha, 10);
    const novoUsuario = await Usuario.create({
      nome,
      email,
      senha: senhaHash,
      tipo: usuarioLogado.tipo, // O tipo é forçado a ser igual ao do responsável
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

    await enviarEmail(
      email,
      'Bem-vindo à plataforma Gate2Way',
      `Olá ${nome},\n\nVocê foi cadastrado na plataforma Gate2Way.\n\nDados de acesso:\nEmail: ${email}\nSenha: ${senha}\n\nPor segurança, recomendamos que altere sua senha após o primeiro acesso.\n\nAtenciosamente,\nEquipe Gate2Way`
    );

    res.status(201).json({
      message: 'Usuário e responsável cadastrados com sucesso!',
      usuario: novoUsuario
    });
  } catch (error) {
    console.error('Erro ao cadastrar o usuário e responsável:', error); // Log do erro
    res.status(500).json({ message: 'Erro ao cadastrar o usuário e responsável.' });
  }
};

// ADMIN Cadastrar um usuário no sistema
const CadastrarUsuario = async (req, res) => {
  const { nome, email, senha, tipo, endereco, telefone, cargo, empresa_id, ict_id } = req.body;
  const usuarioLogado = req.user;

  // Verifica se o usuário logado é admin
  if (usuarioLogado.tipo !== 'admin') {
    return res.status(403).json({ message: 'Acesso negado. Apenas administradores podem cadastrar usuários.' });
  }

  try {
    const senhaHash = await bcrypt.hash(senha, 10);

    // Cria o novo usuário
    const novoUsuario = await Usuario.create({
      nome,
      email,
      senha: senhaHash,
      tipo,
      primeiro_acesso: true,
      endereco,
      telefone,
    });

    // Determina a associação com empresa ou ICT
    let responsavelEmpresaId = null;
    let responsavelIctId = null;

    if (tipo === 'empresa' && empresa_id) {
      responsavelEmpresaId = empresa_id;
    } else if (tipo === 'ict' && ict_id) {
      responsavelIctId = ict_id;
    } else if (tipo === 'empresa' || tipo === 'ict') {
      return res.status(400).json({ message: 'É necessário informar empresa_id ou ict_id para o tipo de usuário especificado.' });
    }

    // Cria o responsável associado ao usuário
    await Responsavel.create({
      usuario_id: novoUsuario.id,
      cargo,
      empresa_id: responsavelEmpresaId,
      ict_id: responsavelIctId,
    });

    await enviarEmail(
      email,
      'Bem-vindo à plataforma Gate2Way',
      `Olá ${nome},\n\nVocê foi cadastrado na plataforma Gate2Way.\n\nDados de acesso:\nEmail: ${email}\nSenha: ${senha}\n\nPor segurança, recomendamos que altere sua senha após o primeiro acesso.\n\nAtenciosamente,\nEquipe Gate2Way`
    );

    res.status(201).json({
      message: 'Usuário e responsável cadastrados com sucesso!',
      usuario: novoUsuario
    });
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') { //erro de unique constraint não respeitado
      var field = error.errors[0].path;
      
      if (field === 'email') {
        return res.status(409).json({ 
          error: 'Este e-mail já é usado por outro usuário' 
        });
      } 
    }

    console.error('Erro ao cadastrar o usuário e responsável:', error);
    res.status(500).json({ message: 'Erro ao cadastrar o usuário e responsável.' });
  }
};

// ADMIN E USUARIO Atualizar um usuário existente
const AtualizarUsuario = async (req, res) => {
  const { id } = req.params;
  const usuarioLogado = req.user;
  const { cargo } = req.body;
  console.log('Usuário logado:', usuarioLogado);
  console.log('Atualizando usuário ID:', id);
  console.log('Cargo Recebido', cargo);

  try {
    const usuario = await Usuario.findByPk(id, {
      include: { model: Responsavel, as: 'Responsavels' }
    });

    if (!usuario) {
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }

    const responsavel = await Responsavel.findOne({ where: { usuario_id: id } });

    console.log('Usuário encontrado:', usuario);

    const isAdmin = usuarioLogado.tipo === 'admin';

    // Verificação de permissão
    if (!isAdmin && usuario.id !== usuarioLogado.id) {
      return res.status(403).json({ message: 'Acesso negado. Você só pode atualizar sua própria conta.' });
    }

    // Prepara campos permitidos
    const camposPermitidos = ['nome', 'email', 'senha', 'telefone', 'endereco'];
    const camposParaAtualizar = {};

    for (const campo of camposPermitidos) {
      if (req.body[campo] !== undefined && usuario[campo] !== req.body[campo]) {
        if (campo === 'senha') {
          camposParaAtualizar.senha = await bcrypt.hash(req.body.senha, 10);
        } else {
          camposParaAtualizar[campo] = req.body[campo];
        }
      }
    }

    if (Object.keys(camposParaAtualizar).length > 0) {
      await usuario.update(camposParaAtualizar);
    }

    if (responsavel && cargo !== undefined) {
      console.log('Cargo do responsável:', responsavel.cargo);
      if (responsavel.cargo !== cargo) {
        await responsavel.update({ cargo });
      }
    }
    res.status(200).json({ message: 'Usuário atualizado com sucesso.', usuario, responsavel });
  } catch (error) {
    console.error('Erro ao atualizar usuário:', error);

    if (error.name === 'SequelizeUniqueConstraintError') { //erro de unique constraint não respeitado
      var field = error.errors[0].path;
      
      if (field === 'email') {
        return res.status(409).json({ 
          error: 'Este e-mail já é usado por outro usuário' 
        });
      } 
    }

    res.status(500).json({ message: 'Erro ao atualizar o usuário.' });
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
    res.status(500).json({ message: 'Erro ao deletar o usuário.' });
  }
};

// ADMIN Ver um usuário pelo ID
const VerUsuario = async (req, res) => {
  const { id } = req.params;

  try {
    const usuario = await Usuario.findByPk(id, {
      include: {
        model: Responsavel, as: 'Responsavels', include: [
          { model: Empresa, required: false },
          { model: Ict, required: false }
        ]
      }
    });

    if (req.user.tipo !== "admin" && usuario.id !== req.user.id) {
      return res.status(403).json({ message: 'Acesso negado.' });
    }

    if (!usuario) {
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }

    res.status(200).json(usuario);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar o usuário.' });
  }
};

// ADMIN Ver todos os usuários
const VerTodosUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.findAll({
      include:
      {
        model: Responsavel, as: 'Responsavels', include: [
          { model: Empresa, required: false },
          { model: Ict, required: false }
        ]
      }
    });

    if (req.user.tipo !== 'admin') {
      return res.status(403).json({ message: 'Acesso negado.' });
    }

    res.status(200).json(usuarios);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar os usuários.' });
  }
};

const BuscarUsuarioDinamico = async (req, res) => {
  const { q } = req.query; // O termo de busca passado na URL

  if (req.user.tipo !== 'admin') {
    return res.status(403).json({ message: 'Acesso negado.' });
  }

  if (!q) {
    return res.status(400).json({ message: 'Por favor, forneça um termo de busca.' });
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
    res.status(500).json({ message: 'Erro ao buscar usuários' });
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
  TrocarSenhaPrimeiroAcesso
};
