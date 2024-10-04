const Rota = require('../models').Rota;
const Empresa = require('../models').Empresa;

// Criar uma nova Rota
const CadastrarRota = async (req, res) => {
    try {
        const rota = await Rota.create(req.body);
        res.status(201).json(rota);
      } catch (error) {
        console.error('Erro ao criar rota:', error);
        res.status(500).json({ error: `Erro ao criar rota: ${error.message}` });
      }
    };

// Buscar todas as Rotas
const BuscarTodasRotas = async (req, res) => {
  try {
    const rotas = await Rota.findAll();
    res.status(200).json(rotas);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar rotas' });
  }
};

// Buscar uma Rota por ID
const BuscarRotaPorId = async (req, res) => {
  try {
    const rota = await Rota.findByPk(req.params.id);
    if (rota) {
      res.status(200).json(rota);
    } else {
      res.status(404).json({ error: 'Rota não encontrada' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar rota' });
  }
};

// Atualizar uma Rota
const AtualizarRota = async (req, res) => {
  try {
    const { nome, descricao, empresa_id } = req.body;
    const rota = await Rota.findByPk(req.params.id);

    if (rota) {
      rota.nome = nome;
      rota.descricao = descricao;
      rota.empresa_id = empresa_id;
      await rota.save();
      res.status(200).json(rota);
    } else {
      res.status(404).json({ error: 'Rota não encontrada' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar rota' });
  }
};

// Deletar uma Rota
const DeletarRota = async (req, res) => {
  try {
    const rota = await Rota.findByPk(req.params.id);
    if (rota) {
      await rota.destroy();
      res.status(200).json({ message: 'Rota deletada com sucesso' });
    } else {
      res.status(404).json({ error: 'Rota não encontrada' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Erro ao deletar rota' });
  }
};

const BuscarRotasPorEmpresaId = async (req, res) => {
    try {
      const rotas = await Rota.findAll({
        where: { empresa_id: req.params.empresa_id }
      });
  
      if (rotas.length > 0) {
        res.status(200).json(rotas);
      } else {
        res.status(404).json({ error: 'Nenhuma rota encontrada para esta empresa' });
      }
    } catch (error) {
      res.status(500).json({ error: `Erro ao buscar rotas por empresa: ${error.message}` });
    }
  };


module.exports = {
  CadastrarRota,
  BuscarTodasRotas,
  BuscarRotaPorId,  
  AtualizarRota,
  DeletarRota,
  BuscarRotasPorEmpresaId
};