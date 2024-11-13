const Interesse = require('../models').Interesse;
const Usuario = require('../models').Usuario;
const Oferta = require('../models').Oferta;
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
              as: 'Rota',
              where: { empresa_id: usuarioLogado.empresa_id }
            }
          }
        }
      });

      if (!oferta) {
        return res.status(403).json({ message: 'Acesso negado: Oferta não pertence a um projeto da sua empresa.' });
      }
    }

    const interesse = await Interesse.create({ oferta_id, proposta, usuario_id: usuarioLogado.id });

    res.status(201).json({ message: 'Interesse criado com sucesso', interesse });
  } catch (error) {
    res.status(500).json({ error: `Erro ao criar interesse: ${error.message}` });
  }
};

// Listar todos os interesses de uma oferta
async function BuscarInteressesPorOferta(req, res) {
  try {
    const ofertaId = req.params.ofertaId;
    console.log("Iniciando busca de interesses para a oferta:", ofertaId); // Log para verificar ofertaId
    
    // Verifique se `ofertaId` está presente
    if (!ofertaId) {
      console.log("Erro: ID da oferta não foi fornecido na URL.");
      return res.status(400).json({ message: "ID da oferta é necessário" });
    }

    console.log("Buscando oferta com ID:", ofertaId);
    const oferta = await Oferta.findByPk(ofertaId, {
      include: [
        {
          model: Interesse,
          as: 'interesses',
        },
      ],
    });

    if (!oferta) {
      console.log("Oferta não encontrada.");
      return res.status(404).json({ message: "Oferta não encontrada" });
    }

    console.log("Oferta encontrada:", oferta.toJSON());
    console.log("Interesses associados à oferta:", oferta.interesses);

    res.json(oferta);
  } catch (error) {
    console.error("Erro ao buscar interesses da oferta:", error);
    res.status(500).json({ message: "Erro ao buscar interesses" });
  }
};

// Selecionar um interesse
const SelecionarInteresse = async (req, res) => {
  const usuarioLogado = req.user;
  const { interesse_id } = req.params;

  try {
    console.log("Iniciando processo de seleção do interesse:", interesse_id);
    console.log("Usuário logado:", usuarioLogado);

    // Buscar o interesse com base no interesse_id fornecido e incluir a oferta e suas associações
    const interesse = await Interesse.findByPk(interesse_id, {
      include: {
        model: Oferta,
        as: 'Oferta',
        include: {
          model: Projeto,
          include: {
            model: Programa,
            include: {
              model: Rota,
              as: 'Rota',
              where: usuarioLogado.tipo === 'admin' ? {} : { empresa_id: usuarioLogado.empresa_id }
            }
          }
        }
      }
    });

    // Log do interesse e de suas associações para verificação
    if (interesse) {
      console.log("Interesse encontrado:", interesse.toJSON());
      console.log("Oferta associada:", interesse.Oferta ? interesse.Oferta.toJSON() : "Nenhuma oferta associada");
    } else {
      console.log("Interesse não encontrado ou sem permissão de acesso.");
      return res.status(404).json({ message: 'Interesse não encontrado ou não pertence a um projeto da sua empresa.' });
    }

    // Atualizar o status do interesse para "selecionado"
    console.log("Atualizando status do interesse para 'selecionado'.");
    interesse.status = 'selecionado';
    await interesse.save();

    console.log("Status atualizado com sucesso. Interesse selecionado.");
    res.status(200).json({ message: 'Interesse selecionado com sucesso.', interesse });
  } catch (error) {
    console.error("Erro ao selecionar o interesse:", error);
    res.status(500).json({ error: `Erro ao selecionar o interesse: ${error.message}` });
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
    const interesses = await Interesse.findAll({
      where: { usuario_id: usuarioLogado.id },
          include: [
            {
              model: Oferta,
              as: 'Oferta',
              include: {
                model: Projeto,
                include: {
                  model: Programa,
                  include: {
                    model: Rota,
                    as: 'Rota',
                    where: usuarioLogado.tipo === 'admin' ? {} : { empresa_id: usuarioLogado.empresa_id }
                  }
                }
              }
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
  SelecionarInteresse,
  ListarInteressesPorUsuario,
  RejeitarInteresse
};
