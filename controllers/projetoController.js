const { Op } = require('sequelize'); 
const { projetoDTO } = require('../dtos/projetoDTO');
const Projeto = require('../models').Projeto;
const Programa = require('../models').Programa;
const Rota = require('../models').Rota;
const Keyword = require('../models').Keyword;
const ProjetoKeyword = require('../models').ProjetoKeyword;

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
  let { programa_id, keywords } = req.body; // Incluímos 'keywords' no corpo da requisição

  try {
    console.log('Verificando programa com ID:', programa_id);

    const programa = await Programa.findByPk(programa_id, {
      include: { model: Rota, as: 'Rota' }
    });

    if (!programa) {
      return res.status(404).json({ message: 'Programa não encontrado.' });
    }

    console.log('Programa encontrado:', programa);

    if (usuarioLogado.tipo !== 'admin' && programa.Rota.empresa_id !== usuarioLogado.empresa_id) {
      return res.status(403).json({ message: 'Acesso negado.' });
    }

    // Criar o projeto sem o campo 'impulso'
    console.log('Criando novo projeto com os dados:', req.body);
    const novoProjeto = await Projeto.create(req.body);  // Supondo que req.body não contém 'impulso'

    console.log('Novo projeto criado com ID:', novoProjeto.id);

    // Verifica se 'keywords' é uma string e divide as palavras-chave se necessário
    if (typeof keywords === 'string') {
      keywords = keywords.split(',').map(kw => kw.trim()); // Divida por vírgulas e remova espaços extras
    }

    // Se houver keywords no corpo da requisição, associá-las ao projeto
    if (keywords && keywords.length > 0) {
      console.log('Associando keywords:', keywords);

      for (const keywordNome of keywords) {
        console.log('Processando keyword:', keywordNome);

        // Verifica se a keyword já existe
        let keyword = await Keyword.findOne({ where: { nome: keywordNome } });

        // Se a keyword não existir, cria uma nova
        if (!keyword) {
          console.log(`Keyword não encontrada, criando nova keyword: ${keywordNome}`);
          keyword = await Keyword.create({ nome: keywordNome });
        } else {
          console.log(`Keyword encontrada: ${keywordNome}`);
        }

        // Associa a keyword ao projeto
        console.log(`Associando keyword ${keyword.id} ao projeto ${novoProjeto.id}`);
        await ProjetoKeyword.create({
          projeto_id: novoProjeto.id,
          keyword_id: keyword.id
        });
      }
    }

    res.status(201).json(novoProjeto);
  } catch (error) {
    console.error('Erro ao criar o projeto:', error);
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

    await projeto.update(req.body);
    res.status(200).json(projeto);
  } catch (error) {
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
          where: { empresa_id: usuarioLogado.empresa_id }
        }
      ]
    });
  } else {
    // Admin pode ver todos os projetos
    includeOptions.push({ model: Programa, include: [{ model: Rota, as: 'Rota' }] });
  }

  // Filtro por rota_id
  if (rota_id) {
    includeOptions.push({
      model: Programa,
      include: [
        {
          model: Rota,
          as: 'Rota',
          where: { id: rota_id }
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

    if (projetos.length === 0) {
      return res.status(404).json({ message: 'Nenhum projeto encontrado com os filtros aplicados.' });
    }

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
