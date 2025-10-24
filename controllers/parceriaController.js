const Parceria = require("../models/index.js").Parceria;
const Ict = require("../models").Ict;
const Interesse = require("../models/index.js").Interesse;
const Oferta = require("../models/index.js").Oferta;
const Projeto = require("../models/index.js").Projeto;
const Programa = require("../models/index.js").Programa;
const Usuario = require("../models/index.js").Usuario;
const Rota = require("../models/index.js").Rota;
const Empresa = require("../models/index.js").Empresa;
const Responsavel = require("../models").Responsavel;
const { Op } = require("sequelize");
const sequelize = require("../config/sequelize.js");
const enviarEmail = require("../services/emailService.js");

// Formalizar uma parceria
const AceitarInteresse = async (req, res) => {
  const usuarioLogado = req.user;
  const { interesse_id } = req.body;

  const t = await sequelize.transaction();

  try {
    const interesse = await Interesse.findByPk(interesse_id, {
      include: {
        model: Oferta,
        as: "Oferta",
        include: {
          model: Projeto,
          include: [
            {
              model: Programa,
              include: {
                model: Rota,
                as: "Rota",
                attributes: ["empresa_id"],
              },
            },
            {
              model: Usuario,
              as: "Responsavel",
              attributes: ["nome", "email", "telefone"],
            },
          ],
        },
      },
      transaction: t,
    });

    if (!interesse || !interesse.Oferta) {
      await t.rollback();
      return res
        .status(404)
        .json({ message: "Interesse ou oferta não encontrado." });
    }
    // Verificação de segurança
    const isAdmin = usuarioLogado.tipo === "admin";
    const rotaEmpresaId = interesse.Oferta.Projeto.Programa.Rota.empresa_id;
    const isEmpresaAutorizada =
      usuarioLogado.tipo === "empresa" &&
      usuarioLogado.empresa_id === rotaEmpresaId;

    if (!isAdmin && !isEmpresaAutorizada) {
      await t.rollback();
      return res.status(403).json({ message: "Acesso negado." });
    }

    // Criação da parceria
    const novaParceria = await Parceria.create(
      {
        interesse_id: interesse.id,
        status: "ATIVO",
      },
      { transaction: t }
    );

    // Atualizar o status do projeto para "EM ANDAMENTO"
    const projeto = interesse.Oferta.Projeto;
    projeto.status = "EM ANDAMENTO";
    await projeto.save({ transaction: t });

    // Atualizar o status da oferta para "ENCERRADA"
    const oferta = interesse.Oferta;
    oferta.status = "ENCERRADA";
    await oferta.save({ transaction: t });

    // Aceitar interesse
    await Interesse.update(
      { status: Interesse.STATUS.ACEITO },
      {
        where: {
          oferta_id: oferta.id,
          status: Interesse.STATUS.PENDENTE,
          id: interesse_id,
        },
        transaction: t,
      }
    );

    // Rejeitar outros interesses associados à mesma oferta
    await Interesse.update(
      { status: Interesse.STATUS.RECUSADO },
      {
        where: {
          oferta_id: oferta.id,
          status: Interesse.STATUS.PENDENTE,
          id: { [Op.ne]: interesse_id },
        },
        transaction: t,
      }
    );

    // Obter o e-mail do interessado e os dados do responsável pelo projeto
    const interessado = await Usuario.findByPk(interesse.usuario_id);
    const responsavelProjeto = interesse.Oferta.Projeto.Responsavel;

    await t.commit();

    res.status(201).json({
      message: "Parceria formalizada com sucesso",
      parceria: novaParceria,
    });

    // Envio de e-mail, caso ambos tenham sido encontrados
    if (interessado && responsavelProjeto) {
      await enviarEmail(
        interessado.email,
        "Interesse Aceito - Gate2Way",
        `Olá ${interessado.nome},\n\nSeu interesse no projeto "${projeto.nome}" foi aceito! Entre em contato com o responsável pelo projeto para mais detalhes:\n\nNome: ${responsavelProjeto.nome}\nEmail: ${responsavelProjeto.email}\nTelefone: ${responsavelProjeto.telefone}\n\nAtenciosamente,\nEquipe Gate2Way`
      );
      console.log("E-mail enviado para:", interessado.email);

      await enviarEmail(
        responsavelProjeto.email,
        "Interesse Aceito - Gate2Way",
        `Olá ${responsavelProjeto.nome},\n\nO interessado "${interessado.nome}" aceitou seu interesse no projeto "${projeto.nome}".\n\nAtenciosamente,\nEquipe Gate2Way`
      );
      console.log("E-mail enviado para:", responsavelProjeto.email);
    } else {
      console.error(
        "Interessado ou responsável pelo projeto não encontrado, e-mail não enviado."
      );
    }
  } catch (error) {
    await t.rollback();
    console.error("Erro ao formalizar a parceria:", error);
    res
      .status(500)
      .json({ message: `Erro ao formalizar a parceria: ${error.message}` });
  }
};

// Atualizar uma parceria
const AtualizarParceria = async (req, res) => {
  const usuarioLogado = req.user;
  const { parceria_id } = req.params;
  const { status, data_fim } = req.body;

  try {
    console.log("Usuário logado:", usuarioLogado);
    console.log("Atualizando parceria ID:", parceria_id);

    const parceria = await Parceria.findByPk(parceria_id, {
      include: {
        model: Interesse,
        include: {
          model: Oferta,
          as: "Oferta",
          include: {
            model: Projeto,
            include: {
              model: Programa,
              include: {
                model: Rota,
                include: {
                  model: ICT,
                  where: { id: usuarioLogado.ict_id },
                },
              },
            },
          },
        },
      },
    });

    if (!parceria) {
      console.log("Parceria não encontrado ou acesso negado");
      return res
        .status(404)
        .json({ message: "Parceria não encontrado ou acesso negado." });
    }

    parceria.status = status;
    parceria.data_fim = data_fim;
    await parceria.save();

    console.log("Parceria atualizado:", parceria);

    res
      .status(200)
      .json({ message: "Parceria atualizado com sucesso", parceria });
  } catch (error) {
    console.error("Erro ao atualizar parceria:", error);
    res.status(500).json({ message: "Erro ao atualizar parceria." });
  }
};

// Deletar uma parceria
const DeletarParceria = async (req, res) => {
  const { parceria_id } = req.params;
  const usuarioLogado = req.user;

  try {
    console.log("Usuário logado:", usuarioLogado);
    console.log("Deletando parceria ID:", parceria_id);

    const parceria = await Parceria.findByPk(parceria_id, {
      include: {
        model: Interesse,
        include: {
          model: Oferta,
          include: {
            model: Projeto,
            include: {
              model: Programa,
              include: {
                model: Rota,
                include: {
                  model: ICT,
                  where: { id: usuarioLogado.ict_id },
                },
              },
            },
          },
        },
      },
    });

    if (!parceria) {
      console.log("Parceria não encontrado ou acesso negado");
      return res
        .status(404)
        .json({ message: "Parceria não encontrado ou acesso negado." });
    }

    await parceria.destroy();
    console.log("Parceria deletado com sucesso");

    res.status(200).json({ message: "Parceria deletado com sucesso." });
  } catch (error) {
    console.error("Erro ao deletar parceria:", error);
    res.status(500).json({ message: "Erro ao deletar parceria." });
  }
};

// Listar todas as parcerias de uma empresa ou ICT
const ListarParcerias = async (req, res) => {
  const usuarioLogado = req.user;

  try {
    let parcerias;

    if (usuarioLogado.tipo === "empresa") {
      parcerias = await Parceria.findAll({
        include: {
          model: Interesse,
          include: [
            {
              model: Oferta,
              as: "Oferta",
              include: {
                model: Projeto,
                include: {
                  model: Programa,
                  include: {
                    model: Rota,
                    as: "Rota",
                    where: { empresa_id: usuarioLogado.empresa_id },
                    include: { model: Empresa },
                  },
                },
              },
            },
            {
              model: Usuario,
              include: {
                model: Responsavel,
                include: { model: Ict },
              },
            },
          ],
        },
      });
    } else if (usuarioLogado.tipo === "ict") {
      parcerias = await Parceria.findAll({
        include: {
          model: Interesse,
          where: { usuario_id: usuarioLogado.id },
          include: [
            {
              model: Oferta,
              as: "Oferta",
              include: {
                model: Projeto,
                include: {
                  model: Programa,
                  include: {
                    model: Rota,
                    as: "Rota",
                    include: { model: Empresa },
                  },
                },
              },
            },
            {
              model: Usuario,
              include: {
                model: Responsavel,
                include: { model: Ict },
              },
            },
          ],
        },
      });
    } else {
      parcerias = await Parceria.findAll({
        include: {
          model: Interesse,
          include: [
            {
              model: Oferta,
              as: "Oferta",
              include: {
                model: Projeto,
                include: {
                  model: Programa,
                  include: {
                    model: Rota,
                    as: "Rota",
                    include: { model: Empresa },
                  },
                },
              },
            },
            {
              model: Usuario,
              include: {
                model: Responsavel,
                include: { model: Ict },
              },
            },
          ],
        },
      });
    }

    res.status(200).json(parcerias);
  } catch (error) {
    console.error("Erro ao listar parcerias:", error);
    res.status(500).json({ message: "Erro ao listar parcerias." });
  }
};

// Selecionar parceria por ID
const SelecionarParceriaPorId = async (req, res) => {
  const { parceria_id } = req.params;
  const usuarioLogado = req.user;

  try {
    console.log("Buscando parceria por ID:", parceria_id);

    const parceria = await Parceria.findByPk(parceria_id, {
      include: {
        model: Interesse,
        include: {
          model: Oferta,
          include: {
            model: Projeto,
            include: {
              model: Programa,
              include: {
                model: Rota,
                include: { model: ICT, where: { id: usuarioLogado.ict_id } },
              },
            },
          },
        },
      },
    });

    if (!parceria) {
      console.log("Parceria não encontrado ou acesso negado");
      return res
        .status(404)
        .json({ message: "Parceria não encontrado ou acesso negado." });
    }

    console.log("Parceria encontrado:", parceria);

    res.status(200).json(parceria);
  } catch (error) {
    console.error("Erro ao buscar parceria:", error);
    res.status(500).json({ message: "Erro ao buscar parceria." });
  }
};

module.exports = {
  AceitarInteresse,
  AtualizarParceria,
  DeletarParceria,
  ListarParcerias,
  SelecionarParceriaPorId,
};
