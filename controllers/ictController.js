const Ict = require('../models').Ict;
const Usuario = require('../models').Usuario;
const upload = require('../config/multerFotoPerfil');
const fs = require('fs');
const path = require('path');

// Função para verificar se o usuário é admin
const VerificarAdmin = async (usuarioId) => {
  const usuario = await Usuario.findByPk(usuarioId);
  return usuario.tipo === 'admin';
};

// Criar uma nova ICT com foto de perfil
const CadastrarIct = async (req, res) => {
  const usuarioLogado = req.user;

  try {
    const isAdmin = await VerificarAdmin(usuarioLogado.id);

    if (!isAdmin) {
      return res.status(403).json({ error: 'Acesso negado. Apenas administradores podem cadastrar ICTs.' });
    }

    const { nome, cnpj, razao_social, endereco, telefone, email, site } = req.body;
    const fotoPerfilPath = req.file ? `/uploads/fotos/${req.file.filename}` : null;

    const novaIct = await Ict.create({
      nome,
      cnpj,
      razao_social,
      endereco,
      telefone,
      email,
      site,
      foto_perfil: fotoPerfilPath
    });

    res.status(201).json({
      message: 'ICT cadastrada com sucesso!',
      ict: novaIct
    });
  } catch (error) {
    console.error('Erro ao criar ICT:', error);

    // Remover a imagem se houver erro
    if (req.file && req.file.path) {
      fs.unlink(req.file.path, (err) => {
        if (err) console.error('Erro ao deletar imagem:', err);
      });
    }

    if (error.name === 'SequelizeUniqueConstraintError') { //erro de unique constraint não respeitado
      var field = error.errors[0].path;
      
      if (field === 'razao_social') {
        return res.status(409).json({ 
          error: 'Esta razão social já está cadastrada para outra ICT.' 
        });
      } 
      
      if (field === 'cnpj') {
        return res.status(409).json({ 
          error: 'Este CNPJ já está cadastrado no sistema para outra ICT.' 
        });
      }
    }

    res.status(500).json({ error: `Erro ao criar ICT: ${error.message}` });
  }
};

// Atualizar uma ICT (com opção de atualizar a foto de perfil)
const AtualizarIct = async (req, res) => {
  const usuarioLogado = req.user;

  try {
    const isAdmin = await VerificarAdmin(usuarioLogado.id);

    if (!isAdmin) {
      return res.status(403).json({ error: 'Acesso negado. Apenas administradores podem atualizar ICTs.' });
    }

    const { nome, cnpj, razao_social, endereco, telefone, email, site } = req.body;
    const novaFotoPerfilPath = req.file ? `/uploads/fotos/${req.file.filename}` : null;

    const ict = await Ict.findByPk(req.params.id);
    if (!ict) {
      return res.status(404).json({ error: 'ICT não encontrada' });
    }

    // Se uma nova imagem de perfil foi enviada, remover a anterior
    if (novaFotoPerfilPath && ict.foto_perfil) {
      const caminhoAntigo = path.join(__dirname, '..', ict.foto_perfil);
      fs.unlink(caminhoAntigo, (err) => {
        if (err) console.error('Erro ao deletar imagem antiga:', err);
      });
    }

    // Atualizar campos da ICT
    await ict.update({
      nome,
      cnpj,
      razao_social,
      endereco,
      telefone,
      email,
      site,
      foto_perfil: novaFotoPerfilPath || ict.foto_perfil
    });

    res.status(200).json({
      message: 'ICT atualizada com sucesso!',
      ict
    });
  } catch (error) {
    console.error('Erro ao atualizar ICT:', error);

    // Remover a nova imagem se ocorrer um erro
    if (req.file && req.file.path) {
      fs.unlink(req.file.path, (err) => {
        if (err) console.error('Erro ao deletar nova imagem:', err);
      });
    }

    res.status(500).json({ error: 'Erro ao atualizar ICT' });
  }
};

// Outros métodos de CRUD para ICTs
// Buscar todas as ICTs (apenas admin pode)
const BuscarTodasIcts = async (req, res) => {
  const usuarioLogado = req.user;

  try {
    const isAdmin = await VerificarAdmin(usuarioLogado.id);

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
    const isAdmin = await VerificarAdmin(usuarioLogado.id);

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

// Deletar uma ICT
const DeletarIct = async (req, res) => {
  const usuarioLogado = req.user;

  try {
    const isAdmin = await VerificarAdmin(usuarioLogado.id);

    if (!isAdmin) {
      return res.status(403).json({ error: 'Acesso negado. Apenas administradores podem deletar ICTs.' });
    }

    const ict = await Ict.findByPk(req.params.id);
    if (ict) {
      // Remover imagem da ICT antes de deletar
      if (ict.foto_perfil) {
        const caminhoFoto = path.join(__dirname, '..', ict.foto_perfil);
        fs.unlink(caminhoFoto, (err) => {
          if (err) console.error('Erro ao deletar imagem da ICT:', err);
        });
      }

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
