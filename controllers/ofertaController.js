const Oferta = require('../models').Oferta;
const Projeto = require('../models').Projeto;
const Programa = require('../models').Programa;
const Rota = require('../models').Rota;
const Keyword = require('../models').Keyword;
const { Op } = require('sequelize');

// Criar uma nova Oferta
const CadastrarOferta = async (req, res) => {
  const usuarioLogado = req.user;
  const { data_inicio, data_fim, projeto_id } = req.body;

  try {
    const projeto = await Projeto.findByPk(projeto_id, {
      include: {
        model: Programa,
        include: {
          model: Rota,
          as: 'Rota',
        },
      },
    });

    if (!projeto) {
      return res.status(404).json({ message: 'Projeto não encontrado.' });
    }

    if (usuarioLogado.role !== 'admin' && projeto.Programa.Rota.empresa_id !== usuarioLogado.empresa_id) {
      return res.status(403).json({ message: 'Acesso negado. Este projeto não pertence à sua empresa.' });
    }

    const novaOferta = await Oferta.create({
      data_inicio,
      data_fim,
      status: 'ATIVO',
      projeto_id,
    });

    projeto.status = 'ofertado';
    await projeto.save();

    res.status(201).json(novaOferta);
  } catch (error) {
    console.error('Erro ao criar Oferta:', error);
    res.status(500).json({ error: `Erro ao criar Oferta: ${error.message}` });
  }
};

// Buscar todas as ofertas (filtros para empresas e ICTs)
const VerOfertas = async (req, res) => {
  const usuarioLogado = req.user;
  const { nome, keyword, trl, prioridade, status, data_inicio, data_fim, empresa_id } = req.query;

  try {
    let whereConditions = {};
    let projetoConditions = {};

    if (usuarioLogado.role === 'empresa') {
      whereConditions = {
        '$Projeto.Programa.Rota.empresa_id$': usuarioLogado.empresa_id
      };
    } else if (usuarioLogado.role === 'ict') {
      whereConditions.status = 'ATIVO';
      if (empresa_id) {
        projetoConditions['$Programa.Rota.empresa_id$'] = empresa_id;
      }
    }

    if (nome) projetoConditions.nome = { [Op.like]: `%${nome}%` };
    if (trl) projetoConditions.trl = trl;
    if (prioridade) projetoConditions.prioridade = prioridade;
    if (status) whereConditions.status = status;
    if (data_inicio) whereConditions.data_inicio = { [Op.gte]: data_inicio };
    if (data_fim) whereConditions.data_fim = { [Op.lte]: data_fim };

    const ofertas = await Oferta.findAll({
      where: whereConditions,
      include: [
        {
          model: Projeto,
          where: projetoConditions,
          include: [
            {
              model: Programa,
              include: {
                model: Rota,
                as: 'Rota',
                where: usuarioLogado.role === 'empresa' ? { empresa_id: usuarioLogado.empresa_id } : undefined
              }
            },
            {
              model: Keyword,
              as: 'keywords',
              where: keyword ? { nome: { [Op.like]: `%${keyword}%` } } : undefined,
              required: false
            }
          ]
        }
      ]
    });

    res.status(200).json(ofertas);
  } catch (error) {
    console.error('Erro ao buscar ofertas:', error);
    res.status(500).json({ error: `Erro ao buscar ofertas: ${error.message}` });
  }
};

// Selecionar uma Oferta por ID
const SelecionarOferta = async (req, res) => {
  const usuarioLogado = req.user;
  const { id } = req.params;

  try {
    const oferta = await Oferta.findByPk(id, {
      include: {
        model: Projeto,
        include: {
          model: Programa,
          include: {
            model: Rota,
            as: 'Rota',
          }
        }
      }
    });

    if (!oferta) {
      return res.status(404).json({ error: 'Oferta não encontrada.' });
    }

    if (usuarioLogado.role === 'empresa' && oferta.Projeto.Programa.Rota.empresa_id !== usuarioLogado.empresa_id) {
      return res.status(403).json({ message: 'Acesso negado. Esta oferta não pertence à sua empresa.' });
    }

    if (usuarioLogado.role === 'ict' && oferta.status !== 'ATIVO') {
      return res.status(403).json({ message: 'Acesso negado. A oferta não está ativa.' });
    }

    res.status(200).json(oferta);
  } catch (error) {
    console.error('Erro ao buscar oferta:', error);
    res.status(500).json({ error: 'Erro ao buscar oferta.' });
  }
};

// Atualizar uma Oferta
const AtualizarOferta = async (req, res) => {
  const usuarioLogado = req.user;
  const { data_inicio, data_fim, status, projeto_id } = req.body;

  try {
    const oferta = await Oferta.findByPk(req.params.id, {
      include: {
        model: Projeto,
        include: {
          model: Programa,
          include: {
            model: Rota,
            as: 'Rota',
          },
        },
      },
    });

    if (!oferta) {
      return res.status(404).json({ message: 'Oferta não encontrada.' });
    }

    if (usuarioLogado.role !== 'admin' && oferta.Projeto.Programa.Rota.empresa_id !== usuarioLogado.empresa_id) {
      return res.status(403).json({ message: 'Acesso negado. Esta oferta não pertence à sua empresa.' });
    }

    oferta.data_inicio = data_inicio;
    oferta.data_fim = data_fim;
    oferta.status = status;
    oferta.projeto_id = projeto_id;
    await oferta.save();

    res.status(200).json(oferta);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar Oferta' });
  }
};

// Deletar uma Oferta
const DeletarOferta = async (req, res) => {
  const usuarioLogado = req.user;

  try {
    const oferta = await Oferta.findByPk(req.params.id, {
      include: {
        model: Projeto,
        include: {
          model: Programa,
          include: {
            model: Rota,
            as: 'Rota',
          },
        },
      },
    });

    if (!oferta) {
      return res.status(404).json({ message: 'Oferta não encontrada.' });
    }

    if (usuarioLogado.role !== 'admin' && oferta.Projeto.Programa.Rota.empresa_id !== usuarioLogado.empresa_id) {
      return res.status(403).json({ message: 'Acesso negado. Esta oferta não pertence à sua empresa.' });
    }

    await oferta.destroy();
    res.status(200).json({ message: 'Oferta deletada com sucesso' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao deletar Oferta' });
  }
};

module.exports = {
  CadastrarOferta,
  VerOfertas,
  SelecionarOferta,
  AtualizarOferta,
  DeletarOferta
};
