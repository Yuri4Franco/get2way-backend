const Empresa = require('../models').Empresa;
const Usuario = require('../models').Usuario;
const upload = require('../config/multerFotoPerfil');
const fs = require('fs');
const path = require('path');

// Função para verificar se o usuário é admin
const VerificarAdmin = async (usuarioId) => {
  const usuario = await Usuario.findByPk(usuarioId);
  return usuario.tipo === 'admin';
};

// Método para cadastrar a empresa com foto de perfil
const CadastrarEmpresa = async (req, res) => {
  const usuarioLogado = req.user;

  try {
    const isAdmin = await VerificarAdmin(usuarioLogado.id);

    if (!isAdmin) {
      return res.status(403).json({ error: 'Acesso negado. Apenas administradores podem cadastrar empresas.' });
    }

    // Extrai dados da requisição
    const { nome, cnpj, razao_social, endereco, area, telefone, email, site } = req.body;
    const fotoPerfilPath = req.file ? `/uploads/fotos/${req.file.filename}` : null;

    // Cria nova empresa
    const novaEmpresa = await Empresa.create({
      nome,
      cnpj,
      razao_social,
      endereco,
      area,
      telefone,
      email,
      site,
      foto_perfil: fotoPerfilPath
    });

    res.status(201).json({
      message: 'Empresa cadastrada com sucesso!',
      empresa: novaEmpresa
    });
  } catch (error) {
    console.error('Erro ao cadastrar empresa:', error);

    // Remove a imagem se houver erro no processo
    if (req.file && req.file.path) {
      fs.unlink(req.file.path, (err) => {
        if (err) console.error('Erro ao deletar imagem:', err);
      });
    }
    res.status(500).json({ error: 'Erro ao cadastrar a empresa.' });
  }
};

// Atualizar uma Empresa (apenas admin pode)
const AtualizarEmpresa = async (req, res) => {
  const usuarioLogado = req.user;
  console.log('Iniciando atualização da empresa. Usuário logado:', usuarioLogado);

  try {
    const isAdmin = await VerificarAdmin(usuarioLogado.id);
    console.log('Verificação de administrador concluída:', isAdmin);

    if (!isAdmin) {
      console.log('Acesso negado para usuário não administrador');
      return res.status(403).json({ error: 'Acesso negado. Apenas administradores podem atualizar empresas.' });
    }

    const { id } = req.params;
    const { nome, cnpj, razao_social, endereco, area, telefone, email, site } = req.body;
    const novaFotoPerfilPath = req.file ? `/uploads/fotos/${req.file.filename}` : null;
    console.log('Dados recebidos:', { id, nome, cnpj, razao_social, endereco, area, telefone, email, site, novaFotoPerfilPath });

    const empresa = await Empresa.findByPk(id);
    if (!empresa) {
      console.log('Empresa não encontrada com ID:', id);
      return res.status(404).json({ message: 'Empresa não encontrada.' });
    }
    console.log('Empresa encontrada:', empresa);

    // Se uma nova imagem de perfil foi enviada, remove a antiga
    if (novaFotoPerfilPath && empresa.foto_perfil) {
      const caminhoAntigo = path.join(__dirname, '..', empresa.foto_perfil);
      fs.unlink(caminhoAntigo, (err) => {
        if (err) {
          console.error('Erro ao deletar imagem antiga:', err);
        } else {
          console.log('Imagem antiga deletada com sucesso:', caminhoAntigo);
        }
      });
    }

    // Atualiza a empresa
    await empresa.update({
      nome,
      cnpj,
      razao_social,
      endereco,
      area,
      telefone,
      email,
      site,
      foto_perfil: novaFotoPerfilPath || empresa.foto_perfil // Mantém a antiga se não houver nova
    });
    console.log('Empresa atualizada com sucesso:', empresa);

    res.status(200).json({
      message: 'Empresa atualizada com sucesso!',
      empresa
    });
  } catch (error) {
    console.error('Erro ao atualizar empresa:', error);

    // Remove a nova imagem se houver erro no processo
    if (req.file && req.file.path) {
      fs.unlink(req.file.path, (err) => {
        if (err) {
          console.error('Erro ao deletar nova imagem:', err);
        } else {
          console.log('Nova imagem deletada com sucesso:', req.file.path);
        }
      });
    }
    res.status(500).json({ error: 'Erro ao atualizar a empresa.' });
  }
};


// Deletar uma Empresa (apenas admin pode)
const DeletarEmpresa = async (req, res) => {
  const usuarioLogado = req.user;

  try {
    const isAdmin = await VerificarAdmin(usuarioLogado.id);

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
const ConsultarEmpresaPorId = async (req, res) => {
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
const ConsultarTodasEmpresas = async (req, res) => {
  const usuarioLogado = req.user;

  try {
    const isAdmin = await VerificarAdmin(usuarioLogado.id);

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
  CadastrarEmpresa,
  AtualizarEmpresa,
  DeletarEmpresa,
  ConsultarEmpresaPorId,
  ConsultarTodasEmpresas
};
