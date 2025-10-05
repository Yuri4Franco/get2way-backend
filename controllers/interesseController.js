const Interesse = require("../models").Interesse;
const Usuario = require("../models").Usuario;
const Responsavel = require("../models").Responsavel;
const Oferta = require("../models").Oferta;
const Projeto = require("../models").Projeto;
const Programa = require("../models").Programa;
const Rota = require("../models").Rota;
const Ict = require("../models").Ict;
const Empresa = require("../models").Empresa;
const enviarEmail = require("../services/emailService");

// Criar um interesse de um usuário em uma oferta

const CriarInteresse = async (req, res) => {
  const usuarioLogado = req.user;

  try {
    const { oferta_id, proposta } = req.body;

    const ict = await Ict.findByPk(usuarioLogado.ict_id);
    const usuario = await Usuario.findByPk(usuarioLogado.id);

    // Permitir que o admin ignore a verificação de empresa
    if (usuarioLogado.tipo !== "admin") {
      const oferta = await Oferta.findByPk(oferta_id, {
        include: {
          model: Projeto,
          include: {
            model: Programa,
            include: {
              model: Rota,
              as: "Rota",
              where: { empresa_id: usuarioLogado.empresa_id },
            },
          },
        },
      });

      if (!oferta) {
        return res.status(403).json({
          message:
            "Acesso negado: Oferta não pertence a um projeto da sua empresa.",
        });
      }
    }

    // Criar o interesse
    const interesse = await Interesse.create({
      oferta_id,
      proposta,
      usuario_id: usuarioLogado.id,
    });

    // Obter informações adicionais para o e-mail
    const oferta = await Oferta.findByPk(oferta_id, {
      include: {
        model: Projeto,
        include: {
          model: Usuario, // Responsável pelo projeto
          as: "Responsavel",
          attributes: ["nome", "email"], // Incluindo o ICT (ou o nome da organização)
        },
      },
    });

    if (!oferta) {
      return res.status(404).json({ message: "Oferta não encontrada." });
    }

    const projeto = oferta.Projeto;
    const responsavel = projeto.Responsavel;

    if (!projeto || !responsavel) {
      return res.status(404).json({
        message: "Projeto ou responsável pelo projeto não encontrado.",
      });
    }

    // Dados para o e-mail para o usuário que demonstrou interesse
    const emailUsuario = usuario.email;
    const nomeUsuario = usuario.nome;
    const telefoneUsuario = usuario.telefone;

    const conteudoEmailUsuario = `
      Olá ${nomeUsuario}, você demonstrou interesse no projeto "${projeto.nome}".
      
      Sua proposta:
      ${proposta}
      
      Informações do Responsável pelo Projeto:
      Nome: ${responsavel.nome}
      Email: ${responsavel.email}
      Telefone: ${responsavel.telefone}
      ICT: ${ict.nome}

      Entre em contato para mais detalhes.
      
      Atenciosamente,
      Equipe Gate2Way

    `;

    // Enviar e-mail para o usuário que demonstrou interesse
    await enviarEmail(
      emailUsuario,
      `Novo Interesse no Projeto: ${projeto.nome}`,
      conteudoEmailUsuario
    );

    // Dados para o e-mail para o responsavel pelo projeto
    const emailResponsavel = responsavel.email;
    const nomeResponsavel = responsavel.nome;
    const nomeProjeto = projeto.nome;

    const conteudoEmail = `
      Olá ${nomeResponsavel}, um novo interesse foi registrado no seu projeto "${nomeProjeto}".
      
      Proposta:
      ${proposta}
      
      Informações do Usuário que demonstrou interesse:
      Nome: ${usuario.nome}
      Email: ${usuario.email}
      Telefone: ${usuario.telefone}
      ICT: ${ict.nome}

      Entre em contato para mais detalhes.
      
      Atenciosamente,
      Equipe Gate2Way
    `;

    // Enviar e-mail para o responsável pelo projeto
    await enviarEmail(
      emailResponsavel,
      `Novo Interesse no Projeto: ${nomeProjeto}`,
      conteudoEmail
    );

    // Responder com sucesso
    res.status(201).json({
      message: "Interesse criado com sucesso e e-mail enviado.",
      interesse,
    });
  } catch (error) {
    console.error("Erro ao criar interesse:", error);
    res
      .status(500)
      .json({ error: `Erro ao criar interesse: ${error.message}` });
  }
};

// Listar todos os interesses de uma oferta
async function BuscarInteressesPorOferta(req, res) {
  try {
    const ofertaId = req.params.ofertaId;

    if (!ofertaId) {
      return res.status(400).json({ message: "Oferta não encontrada." });
    }

    const oferta = await Oferta.findByPk(ofertaId, {
      include: [
        {
          model: Interesse,
          as: "interesses",
          include: {
            model: Usuario,
            include: {
              model: Responsavel,
              include: {
                model: Ict,
              },
            },
          },
        },
      ],
    });

    if (!oferta) {
      return res.status(404).json({ message: "Oferta não encontrada" });
    }

    console.log("Oferta encontrada:", oferta.toJSON());

    res.json(oferta);
  } catch (error) {
    console.error("Erro ao buscar propostas da oferta:", error);
    res.status(500).json({ message: "Erro ao buscar propostas" });
  }
}

// Selecionar um interesse
const SelecionarInteresse = async (req, res) => {
  const usuarioLogado = req.user;
  const { id } = req.params;

  try {
    console.log("Iniciando processo de seleção do interesse:", id);
    console.log("Usuário logado:", usuarioLogado);

    // Buscar o interesse com base no id fornecido e incluir a oferta e suas associações
    const interesse = await Interesse.findByPk(id, {
      include: {
        model: Oferta,
        as: "Oferta",
        include: {
          model: Projeto,
          include: {
            model: Programa,
            include: {
              model: Rota,
              as: "Rota",
              where:
                usuarioLogado.tipo === "admin"
                  ? {}
                  : { empresa_id: usuarioLogado.empresa_id },
              include: { model: Empresa },
            },
          },
        },
      },
    });

    console.log("Status atualizado com sucesso. Interesse selecionado.");
    res
      .status(200)
      .json({ message: "Interesse selecionado com sucesso.", interesse });
  } catch (error) {
    console.error("Erro ao selecionar o interesse:", error);
    res
      .status(500)
      .json({ error: `Erro ao selecionar o interesse: ${error.message}` });
  }
};

// Rejeitar um interesse
const RejeitarInteresse = async (req, res) => {
  const usuarioLogado = req.user;
  const { id } = req.params;

  try {
    const interesse = await Interesse.findByPk(id, {
      include: {
        model: Oferta,
        as: "Oferta",
        include: {
          model: Projeto,
          include: {
            model: Programa,
            include: {
              model: Rota,
              as: "Rota",
              where:
                usuarioLogado.tipo === "admin"
                  ? {}
                  : { empresa_id: usuarioLogado.empresa_id },
              include: { model: Empresa },
            },
          },
        },
      },
    });

    if (!interesse) {
      return res.status(404).json({
        message:
          "Proposta não encontrada ou não pertence a um projeto da sua empresa.",
      });
    }

    await interesse.update({ status: Interesse.STATUS.RECUSADO });
    res.status(200).json({ message: "Proposta rejeitada com sucesso." });
  } catch (error) {
    console.error("Erro ao rejeitar proposta:", error);
    res.status(500).json({ error: "Ocorreu um erro ao rejeitar a proposta" });
  }
};

// Listar todos os interesses
const ListarInteresses = async (req, res) => {
  const usuarioLogado = req.user;

  try {
    let whereConditions = {}; // Condições de busca para os interesses
    let includeOptions = []; // Opções de inclusão nas associações

    // Caso o usuário seja um ICT
    if (usuarioLogado.tipo === "ict") {
      whereConditions = { usuario_id: usuarioLogado.id }; // Apenas os interesses criados por este usuário
    }

    // Caso o usuário seja uma empresa (para gerenciar interesses em seus projetos)
    if (usuarioLogado.tipo === "empresa") {
      includeOptions = [
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
                where: { empresa_id: usuarioLogado.empresa_id }, // Restringe às rotas da empresa
              },
            },
          },
        },
      ];
    }

    // Caso o usuário seja admin (sem restrições)
    if (usuarioLogado.tipo === "admin") {
      includeOptions = [
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
              },
            },
          },
        },
      ];
    }

    // Busca os interesses com as condições e associações apropriadas
    const interesses = await Interesse.findAll({
      where: whereConditions,
      include: includeOptions,
    });

    // Responde com a lista de interesses
    res.status(200).json(interesses);
  } catch (error) {
    console.error("Erro ao listar interesses: ", error);
    res.status(500).json({ error: "Erro ao listar interesses" });
  }
};

module.exports = {
  CriarInteresse,
  BuscarInteressesPorOferta,
  SelecionarInteresse,
  ListarInteresses,
  RejeitarInteresse,
};
