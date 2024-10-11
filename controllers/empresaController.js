const Empresa = require('../models').Empresa;
const Usuario = require('../models').Usuario;

// Função para verificar se o usuário é admin
const verificarAdmin = async (usuarioId) => {
  const usuario = await Usuario.findByPk(usuarioId);
  return usuario.tipo === 'admin';
};

// Cadastrar uma nova Empresa (apenas admin pode)
const cadastrarEmpresa = async (req, res) => {
  const usuarioLogado = req.user;

  try {
    const isAdmin = await verificarAdmin(usuarioLogado.id);

    if (!isAdmin) {
      return res.status(403).json({ error: 'Acesso negado. Apenas administradores podem cadastrar empresas.' });
    }

    const { nome, cnpj, razao_social, endereco, area, telefone, email, site, foto_perfil } = req.body;

    const novaEmpresa = await Empresa.create({
      nome,
      cnpj,
      razao_social,
      endereco,
      area,
      telefone,
      email,
      site,
      foto_perfil
    });

    res.status(201).json(novaEmpresa);
  } catch (error) {
    console.error('Erro ao cadastrar empresa:', error);
    res.status(500).json({ error: 'Erro ao cadastrar a empresa.' });
  }
};

// Atualizar uma Empresa (apenas admin pode)
const atualizarEmpresa = async (req, res) => {
  const usuarioLogado = req.user;

  try {
    const isAdmin = await verificarAdmin(usuarioLogado.id);

    if (!isAdmin) {
      return res.status(403).json({ error: 'Acesso negado. Apenas administradores podem atualizar empresas.' });
    }

    const { id } = req.params;
    const { nome, cnpj, razao_social, endereco, area, telefone, email, site, foto_perfil } = req.body;

    const empresa = await Empresa.findByPk(id);
    if (!empresa) {
      return res.status(404).json({ message: 'Empresa não encontrada.' });
    }

    await empresa.update({
      nome,
      cnpj,
      razao_social,
      endereco,
      area,
      telefone,
      email,
      site,
      foto_perfil
    });

    res.status(200).json(empresa);
  } catch (error) {
    console.error('Erro ao atualizar empresa:', error);
    res.status(500).json({ error: 'Erro ao atualizar a empresa.' });
  }
};

// Deletar uma Empresa (apenas admin pode)
const deletarEmpresa = async (req, res) => {
  const usuarioLogado = req.user;

  try {
    const isAdmin = await verificarAdmin(usuarioLogado.id);

    if (!isAdmin) {
      return res.status(403).json({ error: 'Acesso negado. Apenas administradores podem deletar empresas.' });
    }

    const { id } = req.params;

    const empresa = await Empresa.findByPk(id);
    if (!empresa) {
      return res.status(404).json({ message: 'Empresa não encontrada.' });
    }

    await empresa.destroy();
    res.status(200).json({ message: 'Empresa deletada com sucesso.' });
  } catch (error) {
    console.error('Erro ao deletar empresa:', error);
    res.status(500).json({ error: 'Erro ao deletar a empresa.' });
  }
};

// Consultar uma Empresa por ID (todos podem ver, mas apenas suas empresas)
const consultarEmpresaPorId = async (req, res) => {
  const usuarioLogado = req.user;

  try {
    const empresa = await Empresa.findByPk(req.params.id);

    if (!empresa) {
      return res.status(404).json({ message: 'Empresa não encontrada.' });
    }

    // Se não for admin, verificar se a empresa é a mesma que a do usuário
    if (usuarioLogado.tipo !== 'admin' && usuarioLogado.empresa_id !== empresa.id) {
      return res.status(403).json({ error: 'Acesso negado. Você só pode consultar sua própria empresa.' });
    }

    res.status(200).json(empresa);
  } catch (error) {
    console.error('Erro ao consultar empresa:', error);
    res.status(500).json({ error: 'Erro ao consultar a empresa.' });
  }
};

// Consultar todas as Empresas (apenas admin pode)
const consultarTodasEmpresas = async (req, res) => {
  const usuarioLogado = req.user;

  try {
    const isAdmin = await verificarAdmin(usuarioLogado.id);

    if (!isAdmin) {
      return res.status(403).json({ error: 'Acesso negado. Apenas administradores podem visualizar todas as empresas.' });
    }

    const empresas = await Empresa.findAll();
    res.status(200).json(empresas);
  } catch (error) {
    console.error('Erro ao consultar empresas:', error);
    res.status(500).json({ error: 'Erro ao consultar as empresas.' });
  }
};

module.exports = {
  cadastrarEmpresa,
  atualizarEmpresa,
  deletarEmpresa,
  consultarEmpresaPorId,
  consultarTodasEmpresas
};
