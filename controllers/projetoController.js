const { Op } = require('sequelize'); 
const { projetoDTO } = require('../dtos/projetoDTO');
const Projeto = require('../models').Projeto;
const Programa = require('../models').Programa;
const Rota = require('../models').Rota;
const Keyword = require('../models').Keyword;
const ProjetoKeyword = require('../models').ProjetoKeyword;
const Empresa = require('../models').Empresa;
const fs = require('fs');
const path = require('path');

// Selecionar o projeto
const SelecionarProjeto = async (req, res) => {  
  const { id } = req.params;
  const usuarioLogado = req.user;

  try {
    const projeto = await Projeto.findByPk(id, {
      include: [
        {
          model: Programa,
          include: { model: Rota, as: 'Rota' }
        }
      ]
    });

    if (!projeto) {
      return res.status(404).json({ message: 'Projeto não encontrado.' });
    }

    if (usuarioLogado.tipo !== 'admin' && projeto.Programa.Rota.empresa_id !== usuarioLogado.empresa_id) {
      return res.status(403).json({ message: 'Acesso negado.' });
    }

    const projetoData = projetoDTO(projeto);
    res.status(200).json(projetoData);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar o projeto.' });
  }
};

// Cadastrar um projeto
const CadastrarProjeto = async (req, res) => {
  const usuarioLogado = req.user;
  let { programa_id, keywords } = req.body;
  usuario_id = req.user.empresa_id;

  try {
    const programa = await Programa.findByPk(programa_id, {
      include: { model: Rota, as: 'Rota' }
    });

    if (!programa) {
      return res.status(404).json({ message: 'Programa não encontrado.' });
    }

    if (usuarioLogado.tipo !== 'admin' && programa.Rota.empresa_id !== usuarioLogado.empresa_id) {
      return res.status(403).json({ message: 'Acesso negado.' });
    }

    // Cria o projeto e salva o caminho do arquivo, se disponível
    const arquivoPath = req.file ? `/uploads/arquivos/${req.file.filename}` : null;
    const novoProjeto = await Projeto.create({ ...req.body, usuario_id, upload: arquivoPath });

    if (typeof keywords === 'string') {
      keywords = keywords.split(',').map(kw => kw.trim());
    }

    if (keywords && keywords.length > 0) {
      for (const keywordNome of keywords) {
        let keyword = await Keyword.findOne({ where: { nome: keywordNome } });
        if (!keyword) {
          keyword = await Keyword.create({ nome: keywordNome });
        }
        await ProjetoKeyword.create({
          projeto_id: novoProjeto.id,
          keyword_id: keyword.id
        });
      }
    }

    res.status(201).json(novoProjeto);
  } catch (error) {
    console.error('Erro ao criar o projeto:', error);

    // Remove o arquivo se houver erro no cadastro
    if (req.file && req.file.path) {
      fs.unlink(req.file.path, (err) => {
        if (err) console.error('Erro ao deletar arquivo:', err);
      });
    }

    res.status(500).json({ error: 'Erro ao criar o projeto.' });
  }
};

// Atualizar um projeto
const AtualizarProjeto = async (req, res) => {
  const { id } = req.params;
  const usuarioLogado = req.user;

  try {
    const projeto = await Projeto.findByPk(id, {
      include: {
        model: Programa,
        include: { model: Rota, as: 'Rota' }
      }
    });

    if (!projeto) {
      return res.status(404).json({ message: 'Projeto não encontrado.' });
    }

    if (usuarioLogado.tipo !== 'admin' && projeto.Programa.Rota.empresa_id !== usuarioLogado.empresa_id) {
      return res.status(403).json({ message: 'Acesso negado.' });
    }

    // Se houver um novo arquivo, exclui o antigo
    const novoArquivoPath = req.file ? `/uploads/arquivos/${req.file.filename}` : null;
    if (novoArquivoPath && projeto.upload) {
      const caminhoAntigo = path.join(__dirname, '..', projeto.upload);
      fs.unlink(caminhoAntigo, (err) => {
        if (err) console.error('Erro ao deletar arquivo antigo:', err);
      });
    }

    await projeto.update({ ...req.body, upload: novoArquivoPath || projeto.upload });
    res.status(200).json(projeto);
  } catch (error) {
    console.error('Erro ao atualizar o projeto:', error);

    // Remove o novo arquivo se houver erro
    if (req.file && req.file.path) {
      fs.unlink(req.file.path, (err) => {
        if (err) console.error('Erro ao deletar novo arquivo:', err);
      });
    }

    res.status(500).json({ error: 'Erro ao atualizar o projeto.' });
  }
};


// Deletar um projeto (aplica segurança)
const DeletarProjeto = async (req, res) => {
  const { id } = req.params;
  const usuarioLogado = req.user;

  try {
    const projeto = await Projeto.findByPk(id, {
      include: {
        model: Programa,
        include: {
          model: Rota,
          as: 'Rota'
        }
      }
    });

    if (!projeto) {
      return res.status(404).json({ message: 'Projeto não encontrado.' });
    }

    if (usuarioLogado.tipo !== 'admin' && projeto.Programa.Rota.empresa_id !== usuarioLogado.empresa_id) {
      return res.status(403).json({ message: 'Acesso negado. Você não tem permissão para deletar este projeto.' });
    }

    await projeto.destroy();
    res.status(200).json({ message: 'Projeto deletado com sucesso.' });
  } catch (error) {
    console.error('Erro ao deletar projeto:', error); 
    res.status(500).json({ error: 'Erro ao deletar o projeto.' });
  }
};

// Ver Projetos e Filtrar
const VerProjetos = async (req, res) => {
  const usuarioLogado = req.user;
  const { programa_id, rota_id, status, keyword, prioridade } = req.query;

  const whereConditions = {};
  const includeOptions = [];

  // Filtro por programa_id
  if (programa_id) whereConditions.programa_id = programa_id;

  // Filtro por status
  if (status) whereConditions.status = status;

  // Filtro por prioridade
  if (prioridade) whereConditions.prioridade = prioridade;

  // Filtro para admin e empresa
  if (usuarioLogado.tipo !== 'admin') {
    includeOptions.push({
      model: Programa,
      include: [
        {
          model: Rota,
          as: 'Rota',
          where: { empresa_id: usuarioLogado.empresa_id },
          include:{ model: Empresa }
        }
      ]
    });
  } else {
    // Admin pode ver todos os projetos
    includeOptions.push({ model: Programa, include: [{ model: Rota, as: 'Rota', include: { model: Empresa} }] });
  }

  // Filtro por rota_id
  if (rota_id) {
    includeOptions.push({
      model: Programa,
      include: [
        {
          model: Rota,
          as: 'Rota',
          where: { id: rota_id },
          include:{ model: Empresa }
        }
      ]
    });
  }

  // Filtro por keyword
  if (keyword) {
    includeOptions.push({
      model: Keyword,
      as: 'keywords',
      where: { nome: keyword }
    });
  }

  try {
    const projetos = await Projeto.findAll({
      where: whereConditions,
      include: includeOptions
    });

    res.status(200).json(projetos);
  } catch (error) {
    console.error('Erro ao buscar projetos:', error);
    res.status(500).json({ error: 'Erro ao buscar projetos.' });
  }
};


module.exports = {
  SelecionarProjeto,
  CadastrarProjeto,
  AtualizarProjeto,
  DeletarProjeto,
  VerProjetos
};
