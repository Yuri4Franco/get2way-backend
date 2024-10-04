const Interesse = require('../models').Interesse;
const Usuario = require('../models').Usuario;
const Oferta = require('../models').Oferta;
const InteresseHasUsuario = require('../models').InteresseHasUsuario;

// Criar um interesse de um usuário em uma oferta
const CriarInteresse = async (req, res) => {
  try {
    const { usuario_id, oferta_id, proposta } = req.body;

    // Cria o interesse
    const interesse = await Interesse.create({ oferta_id, proposta });

    // Relaciona o interesse ao usuário (muitos para muitos)
    await InteresseHasUsuario.create({ interesse_id: interesse.id, usuario_id });

    res.status(201).json({ message: 'Interesse criado com sucesso', interesse });
  } catch (error) {
    res.status(500).json({ error: `Erro ao criar interesse: ${error.message}` });
  }
};

// Listar todos os interesses de uma oferta
const BuscarInteressesPorOferta = async (req, res) => {
  const { oferta_id } = req.params;

  try {
    console.log('Buscando oferta com ID:', oferta_id); // Log para verificar o ID da oferta

    // Buscar a oferta com os interesses e os usuários associados
    const oferta = await Oferta.findByPk(oferta_id, {
      include: [
        {
          model: Interesse,
          as: 'interesses',
          include: [
            {
              model: Usuario,
              as: 'usuarios',
              through: { attributes: [] }, // Evitar a duplicação da tabela pivot
            }
          ]
        }
      ]
    });

    // Log do resultado da oferta encontrada
    console.log('Resultado da busca pela oferta:', oferta);

    // Verifica se a oferta existe
    if (!oferta) {
      console.log('Oferta não encontrada'); // Log quando a oferta não é encontrada
      return res.status(404).json({ message: 'Oferta não encontrada.' });
    }

    // Log para verificar os interesses associados
    console.log('Interesses associados à oferta:', oferta.interesses);

    // Retorna os interesses associados à oferta
    res.status(200).json(oferta.interesses);
  } catch (error) {
    console.error('Erro ao buscar interesses da oferta:', error); // Log do erro
    res.status(500).json({ error: 'Erro ao buscar interesses da oferta.' });
  }
};

// Detalhar um interesse de um usuário específico para uma oferta
const DetalharInteressePorUsuario = async (req, res) => {
  try {
    const { ofertaId, usuarioId } = req.params;

    // Buscar o interesse específico da oferta e usuário
    const interesse = await InteresseHasUsuario.findOne({
      where: { usuario_id: usuarioId },
      include: [
        {
          model: Interesse,
          where: { oferta_id: ofertaId },
        },
        {
          model: Usuario,
          where: { id: usuarioId },
        },
      ],
    });

    if (!interesse) {
      return res.status(404).json({ error: 'Interesse não encontrado' });
    }

    res.status(200).json(interesse);
  } catch (error) {
    res.status(500).json({ error: `Erro ao buscar interesse do usuário: ${error.message}` });
  }
};

// Listar todos os interesses de um usuário
const ListarInteressesPorUsuario = async (req, res) => {
  try {
    const usuarioId = req.params.usuarioId;

    // Busca todos os interesses relacionados ao usuário
    const interesses = await InteresseHasUsuario.findAll({
      where: { usuario_id: usuarioId },
      include: [
        {
          model: Interesse,
          include: [
            {
              model: Oferta, // Inclui detalhes da oferta
            },
          ],
        },
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
};
