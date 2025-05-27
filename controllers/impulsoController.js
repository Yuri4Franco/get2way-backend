const Impulso = require("../models").Impulso;
const { Op } = require('sequelize');

// Criar um novo Impulso
const CadastrarImpulso = async (req, res) => {
  try {
    const { tipo, descricao, valor, data_inicio, data_fim } = req.body;
    const empresa_id = req.user.empresa_id;

    const novoImpulso = await Impulso.create({
      tipo,
      descricao,
      valor,
      data_inicio,
      data_fim,
      empresa_id,
    });

    res.status(201).json(novoImpulso);
  } catch (error) {
    console.error("Erro ao criar Impulso:", error);
    res.status(500).json({ error: `Erro ao criar Impulso: ${error.message}` });
  }
};

// Buscar todos os Impulsos
const BuscarTodosImpulsos = async (req, res) => {
  const { empresa_id } = req.user;
  try {
    const impulsos = await Impulso.findAll({
      where: {
        [Op.or]: [
          { empresa_id: empresa_id },
          { empresa_id: null },
        ],
      },
    });
    res.status(200).json(impulsos);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar Impulsos" });
  }
};

// Selecionar um Impulso
const BuscarImpulsoPorId = async (req, res) => {
  try {
    const impulso = await Impulso.findByPk(req.params.id);
    if (impulso) {
      res.status(200).json(impulso);
    } else {
      res.status(404).json({ error: "Impulso não encontrado" });
    }
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar Impulso" });
  }
};

// Atualizar um Impulso
const AtualizarImpulso = async (req, res) => {
  try {
    const { tipo, descricao, valor, data_inicio, data_fim } = req.body;
    const impulso = await Impulso.findByPk(req.params.id);
    const usuario = req.user.empresa_id;

    if (impulso.empresa_id === usuario.empresa_id) {
      impulso.tipo = tipo;
      impulso.descricao = descricao;
      impulso.valor = valor;
      impulso.data_inicio = data_inicio;
      impulso.data_fim = data_fim;
      impulso.empresa_id = empresa_id;

      await impulso.save();
      res.status(200).json(impulso);
    } else {
      res.status(404).json({ error: "Impulso não encontrado" });
    }
  } catch (error) {
    res.status(500).json({ error: "Erro ao atualizar Impulso" });
  }
};

// Deletar um Impulso
const DeletarImpulso = async (req, res) => {
  try {
    const impulso = await Impulso.findByPk(req.params.id);
    if (impulso.empresa_id == req.user.empresa_id) {
      await impulso.destroy();
      res.status(200).json({ message: "Impulso deletado com sucesso" });
    } else {
      res
        .status(404)
        .json({ error: "Você não tem permissão para deletar esse impulso" });
    }
  } catch (error) {
    res.status(500).json({ error: "Erro ao deletar Impulso" });
  }
};

module.exports = {
  CadastrarImpulso,
  BuscarTodosImpulsos,
  BuscarImpulsoPorId,
  AtualizarImpulso,
  DeletarImpulso,
};
