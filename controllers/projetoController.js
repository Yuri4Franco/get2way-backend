const { Op } = require('sequelize');
const { projetoDTO } = require('../dtos/projetoDTO');
const Projeto = require('../models').Projeto;
const Programa = require('../models').Programa;
const Rota = require('../models').Rota;
const Keyword = require('../models').Keyword;
const ProjetoKeyword = require('../models').ProjetoKeyword;
const Empresa = require('../models').Empresa;
const Impulso = require('../models').Impulso;
const fs = require('fs');
const path = require('path');

const { literal } = require('sequelize');



// Selecionar o projeto
const SelecionarProjeto = async (req, res) => {
  const { id } = req.params;
  const usuarioLogado = req.user;

  try {
    const projeto = await Projeto.findByPk(id, {
      attributes: {
        include: [
          [literal(`(
            SELECT COUNT(*)
            FROM interesses AS i
            WHERE i.oferta_id IN (
              SELECT o.id
              FROM ofertas AS o
              WHERE o.projeto_id = Projeto.id
            )
          )`), 'total_interesses']
        ]
      },
      include: [
        {
          model: Programa,
          include: { model: Rota, as: 'Rota' }
        },
        {
          model: Impulso,
          as: 'Impulso',
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
  usuario_id = req.user.id;

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
    const status = 'NÃO PÚBLICADO'
    const arquivoPath = req.file ? `/uploads/arquivos/${req.file.filename}` : null;
    const novoProjeto = await Projeto.create({ ...req.body, status, usuario_id, upload: arquivoPath });

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

    // Verifica se o status do projeto permite atualização
    if (projeto.status !== 'NÃO PÚBLICADO') {
      return res.status(400).json({ message: 'Não é permitido atualizar projetos que não estão com status "NÃO PÚBLICADO".' });
    }

    // Se houver um novo arquivo, exclui o antigo
    const novoArquivoPath = req.file ? `/uploads/arquivos/${req.file.filename}` : null;
    if (novoArquivoPath && projeto.upload) {
      const caminhoAntigo = path.join(__dirname, '..', projeto.upload);
      fs.unlink(caminhoAntigo, (err) => {
        if (err) console.error('Erro ao deletar arquivo antigo:', err);
      });
    }

    // Filtra os campos que realmente mudaram
    const camposParaAtualizar = {};
    Object.keys(req.body).forEach((campo) => {
      if (projeto[campo] !== req.body[campo]) {
        camposParaAtualizar[campo] = req.body[campo];
      }
    });

    // Inclui o campo upload se houver um novo arquivo
    if (novoArquivoPath) {
      camposParaAtualizar.upload = novoArquivoPath;
    }

    if (Object.keys(camposParaAtualizar).length === 0) {
      return res.status(200).json({ message: 'Nenhuma alteração detectada.' });
    }

    await projeto.update(camposParaAtualizar);
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



// Deletar um projeto
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

  if (programa_id) whereConditions.programa_id = programa_id;
  if (status) whereConditions.status = status;
  if (prioridade) whereConditions.prioridade = prioridade;
  if (usuarioLogado.tipo === 'ict') whereConditions.status = "PUBLICADO";

  const programaInclude = {
    model: Programa,
    required: true,
    include: [
      {
        model: Rota,
        as: 'Rota',
        required: true,
        where: {},
        include: { model: Empresa }
      }
    ]
  };

  if (usuarioLogado.tipo === 'empresa') {
    programaInclude.include[0].where.empresa_id = usuarioLogado.empresa_id;
  }

  if (rota_id) {
    programaInclude.include[0].where.id = rota_id;
  }

  if (Object.keys(programaInclude.include[0].where).length === 0) {
    delete programaInclude.include[0].where;
  }

  includeOptions.push(programaInclude);

  if (keyword) {
    includeOptions.push({
      model: Keyword,
      as: 'keywords',
      where: { nome: keyword },
      required: true
    });
  }

  includeOptions.push({
    model: Impulso,
    as: 'Impulso',
  });

  try {
    const projetos = await Projeto.findAll({
      where: whereConditions,
      attributes: {
        include: [
          [literal(`(
            SELECT COUNT(*)
            FROM interesses AS i
            WHERE i.oferta_id IN (
              SELECT o.id
              FROM ofertas AS o
              WHERE o.projeto_id = Projeto.id
            )
          )`), 'total_interesses']
        ]
      },
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
