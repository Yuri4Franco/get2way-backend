const Oferta = require('../models').Oferta;
const Projeto = require('../models').Projeto;
const Programa = require('../models').Programa;
const Rota = require('../models').Rota;
const Empresa = require('../models').Empresa;
const Impulso = require('../models').Impulso;

// Criar uma nova Oferta
const CadastrarOferta = async (req, res) => {
  try {
    const { data_inicio, data_fim, status, projeto_id } = req.body;

    const novaOferta = await Oferta.create({
      data_inicio,
      data_fim,
      status,
      projeto_id,
    });

    res.status(201).json(novaOferta);
  } catch (error) {
    console.error('Erro ao criar Oferta:', error);
    res.status(500).json({ error: `Erro ao criar Oferta: ${error.message}` });
  }
};

// Buscar todas as Ofertas
const BuscarTodasOfertas = async (req, res) => {
  try {
    const ofertas = await Oferta.findAll();
    res.status(200).json(ofertas);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar Ofertas' });
  }
};

// Buscar uma Oferta por ID
const BuscarOfertaPorId = async (req, res) => {
  try {
    const oferta = await Oferta.findByPk(req.params.id);
    if (oferta) {
      res.status(200).json(oferta);
    } else {
      res.status(404).json({ error: 'Oferta não encontrada' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar Oferta' });
  }
};

// Atualizar uma Oferta
const AtualizarOferta = async (req, res) => {
  try {
    const { data_inicio, data_fim, status, projeto_id } = req.body;
    const oferta = await Oferta.findByPk(req.params.id);

    if (oferta) {
      oferta.data_inicio = data_inicio;
      oferta.data_fim = data_fim;
      oferta.status = status;
      oferta.projeto_id = projeto_id;
      await oferta.save();
      res.status(200).json(oferta);
    } else {
      res.status(404).json({ error: 'Oferta não encontrada' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar Oferta' });
  }
};

// Deletar uma Oferta
const DeletarOferta = async (req, res) => {
  try {
    const oferta = await Oferta.findByPk(req.params.id);
    if (oferta) {
      await oferta.destroy();
      res.status(200).json({ message: 'Oferta deletada com sucesso' });
    } else {
      res.status(404).json({ error: 'Oferta não encontrada' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Erro ao deletar Oferta' });
  }
};

// Filtro: Buscar ofertas por empresa
const BuscarOfertasPorEmpresa = async (req, res) => {
  try {
    const empresaId = req.params.empresaId;

    const ofertas = await Oferta.findAll({
      include: [
        {
          model: Projeto,
          include: [
            {
              model: Programa,
              include: [
                {
                  model: Rota,
                  where: { empresa_id: empresaId },
                },
              ],
            },
          ],
        },
      ],
    });

    res.status(200).json(ofertas);
  } catch (error) {
    res.status(500).json({ error: `Erro ao buscar ofertas por empresa: ${error.message}` });
  }
};

// Filtro: Buscar ofertas apenas de projetos que tenham impulso
const BuscarOfertasPorImpulso = async (req, res) => {
  try {
    const ofertas = await Oferta.findAll({
      include: [
        {
          model: Projeto,
          where: { impulso_id: { [Sequelize.Op.ne]: null } },
          include: [Impulso],
        },
      ],
    });

    res.status(200).json(ofertas);
  } catch (error) {
    res.status(500).json({ error: `Erro ao buscar ofertas por impulso: ${error.message}` });
  }
};

module.exports = {
  CadastrarOferta,
  BuscarTodasOfertas,
  BuscarOfertaPorId,
  AtualizarOferta,
  DeletarOferta,
  BuscarOfertasPorEmpresa,
  BuscarOfertasPorImpulso,
};
