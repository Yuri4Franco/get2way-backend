const Interesse = require('../models').Interesse;
const Usuario = require('../models').Usuario;
const Oferta = require('../models').Oferta;
const InteresseHasUsuario = require('../models').InteresseHasUsuario;
const Projeto = require('../models').Projeto;
const Programa = require('../models').Programa;
const Rota = require('../models').Rota;

// Criar um interesse de um usuário em uma oferta
const CriarInteresse = async (req, res) => {
  const usuarioLogado = req.user;

  try {
    const { oferta_id, proposta } = req.body;

    // Permitir que o admin ignore a verificação de empresa
    if (usuarioLogado.tipo !== 'admin') {
      const oferta = await Oferta.findByPk(oferta_id, {
        include: {
          model: Projeto,
          include: {
            model: Programa,
            include: {
              model: Rota,
              where: { empresa_id: usuarioLogado.empresa_id }
            }
          }
        }
      });

      if (!oferta) {
        return res.status(403).json({ message: 'Acesso negado: Oferta não pertence a um projeto da sua empresa.' });
      }
    }

    const interesse = await Interesse.create({ oferta_id, proposta });
    await InteresseHasUsuario.create({ interesse_id: interesse.id, usuario_id: usuarioLogado.id });

    res.status(201).json({ message: 'Interesse criado com sucesso', interesse });
  } catch (error) {
    res.status(500).json({ error: `Erro ao criar interesse: ${error.message}` });
  }
};

// Listar todos os interesses de uma oferta
const BuscarInteressesPorOferta = async (req, res) => {
  const { oferta_id } = req.params;
  const usuarioLogado = req.user;

  try {
    const oferta = await Oferta.findByPk(oferta_id, {
      include: [
        {
          model: Interesse,
          as: 'interesses',
          include: [
            {
              model: Usuario,
              as: 'usuarios',
              through: { attributes: [] },
            }
          ]
        },
        {
          model: Projeto,
          include: {
            model: Programa,
            include: {
              model: Rota,
              where: usuarioLogado.tipo === 'admin' ? {} : { empresa_id: usuarioLogado.empresa_id }
            }
          }
        }
      ]
    });

    if (!oferta) {
      return res.status(403).json({ message: 'Acesso negado: Você não tem permissão para ver interesses dessa oferta.' });
    }

    res.status(200).json(oferta.interesses);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar interesses da oferta.' });
  }
};

// Detalhar um interesse de um usuário específico para uma oferta
const DetalharInteressePorUsuario = async (req, res) => {
  const usuarioLogado = req.user;
  const { ofertaId, usuarioId } = req.params;

  try {
    const interesse = await InteresseHasUsuario.findOne({
      where: { usuario_id: usuarioId },
      include: [
        {
          model: Interesse,
          where: { oferta_id: ofertaId },
          include: {
            model: Oferta,
            include: {
              model: Projeto,
              include: {
                model: Programa,
                include: {
                  model: Rota,
                  where: usuarioLogado.tipo === 'admin' ? {} : { empresa_id: usuarioLogado.empresa_id }
                }
              }
            }
          }
        },
        { model: Usuario, where: { id: usuarioId } },
      ]
    });

    if (!interesse) {
      return res.status(403).json({ message: 'Acesso negado ou interesse não encontrado.' });
    }

    res.status(200).json(interesse);
  } catch (error) {
    res.status(500).json({ error: `Erro ao buscar interesse do usuário: ${error.message}` });
  }
};

// Rejeitar um interesse
const RejeitarInteresse = async (req, res) => {
  const usuarioLogado = req.user;
  const { interesse_id } = req.params;

  try {
    const interesse = await Interesse.findByPk(interesse_id, {
      include: {
        model: Oferta,
        include: {
          model: Projeto,
          include: {
            model: Programa,
            include: {
              model: Rota,
              where: usuarioLogado.tipo === 'admin' ? {} : { empresa_id: usuarioLogado.empresa_id }
            }
          }
        }
      }
    });

    if (!interesse) {
      return res.status(404).json({ message: 'Interesse não encontrado ou não pertence a um projeto da sua empresa.' });
    }

    await interesse.destroy();
    res.status(200).json({ message: 'Interesse rejeitado e removido com sucesso.' });
  } catch (error) {
    res.status(500).json({ error: `Erro ao rejeitar o interesse: ${error.message}` });
  }
};

// Listar todos os interesses de um usuário
const ListarInteressesPorUsuario = async (req, res) => {
  const usuarioLogado = req.user;

  try {
    const interesses = await InteresseHasUsuario.findAll({
      where: { usuario_id: usuarioLogado.id },
      include: [
        {
          model: Interesse,
          include: [
            {
              model: Oferta,
              include: {
                model: Projeto,
                include: {
                  model: Programa,
                  include: {
                    model: Rota,
                    where: usuarioLogado.tipo === 'admin' ? {} : { empresa_id: usuarioLogado.empresa_id }
                  }
                }
              }
            }
          ],
        }
      ],
    });

    res.status(200).json(interesses);
  } catch (error) {
    res.status(500).json({ error: `Erro ao buscar interesses do usuário: ${error.message}` });
  }
};

module.exports = {
  CriarInteresse,
  BuscarInteressesPorOferta,
  DetalharInteressePorUsuario,
  ListarInteressesPorUsuario,
  RejeitarInteresse
};
