const Contrato = require('../models').Contrato;

// Criar um novo contrato
const criarContrato = async (req, res) => {
  try {
    const contrato = await Contrato.create(req.body);
    res.status(201).json(contrato);
  } catch (error) {
    console.error('Erro ao criar contrato:', error);
    res.status(500).json({ error: `Erro ao criar contrato: ${error.message}` });
  }
};

// Buscar todos os contratos
const buscarTodosContratos = async (req, res) => {
  try {
    const contratos = await Contrato.findAll();
    res.status(200).json(contratos);
  } catch (error) {
    console.error('Erro ao buscar contratos:', error);
    res.status(500).json({ error: 'Erro ao buscar contratos.' });
  }
};

// Buscar contrato por ID
const buscarContratoPorId = async (req, res) => {
  try {
    const contrato = await Contrato.findByPk(req.params.id);
    if (contrato) {
      res.status(200).json(contrato);
    } else {
      res.status(404).json({ error: 'Contrato não encontrado.' });
    }
  } catch (error) {
    console.error('Erro ao buscar contrato:', error);
    res.status(500).json({ error: 'Erro ao buscar contrato.' });
  }
};

// Atualizar contrato
const atualizarContrato = async (req, res) => {
  try {
    const contrato = await Contrato.findByPk(req.params.id);
    if (contrato) {
      await contrato.update(req.body);
      res.status(200).json(contrato);
    } else {
      res.status(404).json({ error: 'Contrato não encontrado.' });
    }
  } catch (error) {
    console.error('Erro ao atualizar contrato:', error);
    res.status(500).json({ error: 'Erro ao atualizar contrato.' });
  }
};

// Deletar contrato
const deletarContrato = async (req, res) => {
  try {
    const contrato = await Contrato.findByPk(req.params.id);
    if (contrato) {
      await contrato.destroy();
      res.status(200).json({ message: 'Contrato deletado com sucesso.' });
    } else {
      res.status(404).json({ error: 'Contrato não encontrado.' });
    }
  } catch (error) {
    console.error('Erro ao deletar contrato:', error);
    res.status(500).json({ error: 'Erro ao deletar contrato.' });
  }
};

module.exports = {
  criarContrato,
  buscarTodosContratos,
  buscarContratoPorId,
  atualizarContrato,
  deletarContrato,
};
