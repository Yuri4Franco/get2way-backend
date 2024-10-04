const Impulso = require('../models').Impulso;

// Criar um novo Impulso
const CadastrarImpulso = async (req, res) => {
  try {
    const { tipo, descricao, valor, data_inicio, data_fim } = req.body;

    const novoImpulso = await Impulso.create({
      tipo,
      descricao,
      valor,
      data_inicio,
      data_fim
    });

    res.status(201).json(novoImpulso);
  } catch (error) {
    console.error('Erro ao criar Impulso:', error);
    res.status(500).json({ error: `Erro ao criar Impulso: ${error.message}` });
  }
};

// Buscar todos os Impulsos
const BuscarTodosImpulsos = async (req, res) => {
  try {
    const impulsos = await Impulso.findAll();
    res.status(200).json(impulsos);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar Impulsos' });
  }
};

// Buscar um Impulso por ID
const BuscarImpulsoPorId = async (req, res) => {
  try {
    const impulso = await Impulso.findByPk(req.params.id);
    if (impulso) {
      res.status(200).json(impulso);
    } else {
      res.status(404).json({ error: 'Impulso não encontrado' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar Impulso' });
  }
};

// Atualizar um Impulso
const AtualizarImpulso = async (req, res) => {
  try {
    const { tipo, descricao, valor, data_inicio, data_fim } = req.body;
    const impulso = await Impulso.findByPk(req.params.id);

    if (impulso) {
      impulso.tipo = tipo;
      impulso.descricao = descricao;
      impulso.valor = valor;
      impulso.data_inicio = data_inicio;
      impulso.data_fim = data_fim;
      await impulso.save();
      res.status(200).json(impulso);
    } else {
      res.status(404).json({ error: 'Impulso não encontrado' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar Impulso' });
  }
};

// Deletar um Impulso
const DeletarImpulso = async (req, res) => {
  try {
    const impulso = await Impulso.findByPk(req.params.id);
    if (impulso) {
      await impulso.destroy();
      res.status(200).json({ message: 'Impulso deletado com sucesso' });
    } else {
      res.status(404).json({ error: 'Impulso não encontrado' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Erro ao deletar Impulso' });
  }
};

module.exports = {
  CadastrarImpulso,
  BuscarTodosImpulsos,
  BuscarImpulsoPorId,
  AtualizarImpulso,
  DeletarImpulso,
};
