const Ict = require('../models').Ict;
const Usuario = require('../models').Usuario;

// Função para verificar se o usuário é admin
const verificarAdmin = async (usuarioId) => {
  const usuario = await Usuario.findByPk(usuarioId);
  return usuario.tipo === 'admin';
};

// Criar uma nova ICT
const CadastrarIct = async (req, res) => {
  const usuarioLogado = req.user;

  try {
    const isAdmin = await verificarAdmin(usuarioLogado.id);

    if (!isAdmin) {
      return res.status(403).json({ error: 'Acesso negado. Apenas administradores podem cadastrar ICTs.' });
    }

    const { nome, cnpj, razao_social, endereco, telefone, email, site, foto_perfil } = req.body;

    const novaIct = await Ict.create({
      nome,
      cnpj,
      razao_social,
      endereco,
      telefone,
      email,
      site,
      foto_perfil
    });

    res.status(201).json(novaIct);
  } catch (error) {
    console.error('Erro ao criar ICT:', error);
    res.status(500).json({ error: `Erro ao criar ICT: ${error.message}` });
  }
};

// Buscar todas as ICTs
const BuscarTodasIcts = async (req, res) => {
  const usuarioLogado = req.user;

  try {
    const isAdmin = await verificarAdmin(usuarioLogado.id);

    if (!isAdmin) {
      return res.status(403).json({ error: 'Acesso negado. Apenas administradores podem visualizar todas as ICTs.' });
    }

    const icts = await Ict.findAll();
    res.status(200).json(icts);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar ICTs' });
  }
};

// Buscar uma ICT por ID
const BuscarIctPorId = async (req, res) => {
  const usuarioLogado = req.user;

  try {
    const isAdmin = await verificarAdmin(usuarioLogado.id);

    if (!isAdmin) {
      return res.status(403).json({ error: 'Acesso negado. Apenas administradores podem visualizar uma ICT.' });
    }

    const ict = await Ict.findByPk(req.params.id);
    if (ict) {
      res.status(200).json(ict);
    } else {
      res.status(404).json({ error: 'ICT não encontrada' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar ICT' });
  }
};

// Atualizar uma ICT
const AtualizarIct = async (req, res) => {
  const usuarioLogado = req.user;

  try {
    const isAdmin = await verificarAdmin(usuarioLogado.id);

    if (!isAdmin) {
      return res.status(403).json({ error: 'Acesso negado. Apenas administradores podem atualizar ICTs.' });
    }

    const { nome, cnpj, razao_social, endereco, telefone, email, site, foto_perfil } = req.body;
    const ict = await Ict.findByPk(req.params.id);

    if (ict) {
      ict.nome = nome;
      ict.cnpj = cnpj;
      ict.razao_social = razao_social;
      ict.endereco = endereco;
      ict.telefone = telefone;
      ict.email = email;
      ict.site = site;
      ict.foto_perfil = foto_perfil;
      await ict.save();
      res.status(200).json(ict);
    } else {
      res.status(404).json({ error: 'ICT não encontrada' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar ICT' });
  }
};

// Deletar uma ICT
const DeletarIct = async (req, res) => {
  const usuarioLogado = req.user;

  try {
    const isAdmin = await verificarAdmin(usuarioLogado.id);

    if (!isAdmin) {
      return res.status(403).json({ error: 'Acesso negado. Apenas administradores podem deletar ICTs.' });
    }

    const ict = await Ict.findByPk(req.params.id);
    if (ict) {
      await ict.destroy();
      res.status(200).json({ message: 'ICT deletada com sucesso' });
    } else {
      res.status(404).json({ error: 'ICT não encontrada' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Erro ao deletar ICT' });
  }
};

module.exports = {
  CadastrarIct,
  BuscarTodasIcts,
  BuscarIctPorId,
  AtualizarIct,
  DeletarIct,
};
