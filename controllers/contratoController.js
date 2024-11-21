const Contrato = require('../models').Contrato;
const ICT = require('../models').ICT;
const Interesse = require('../models').Interesse;
const Oferta = require('../models').Oferta;
const Projeto = require('../models').Projeto;
const Programa = require('../models').Programa;
const Usuario = require('../models').Usuario;
const Rota = require('../models').Rota;
const Empresa = require('../models').Empresa;
const { Op } = require('sequelize');
const sequelize = require('../config/sequelize.js');
const enviarEmail = require('../services/emailService');

const AceitarInteresse = async (req, res) => {
  const usuarioLogado = req.user;
  const { interesse_id, data_inicio, data_fim } = req.body;

  const t = await sequelize.transaction(); // Inicia uma transação

  try {
    const interesse = await Interesse.findByPk(interesse_id, {
      include: {
        model: Oferta,
        as: 'Oferta',
        include: {
          model: Projeto,
          include: [
            {
              model: Programa,
              include: {
                model: Rota,
                as: 'Rota',
                attributes: ['empresa_id'], // Inclui o empresa_id da rota para verificação
              }
            },
            {
              model: Usuario, // Responsável pelo projeto
              as: 'Responsavel', // Ajuste o alias conforme necessário
              attributes: ['nome', 'email', 'telefone'] // Dados do responsável
            }
          ]
        }
      },
      transaction: t
    });

    if (!interesse || !interesse.Oferta) {
      await t.rollback();
      return res.status(404).json({ message: 'Interesse ou oferta não encontrado.' });
    }

    // Verificar se o usuário é admin ou se é uma empresa autorizada
    const isAdmin = usuarioLogado.tipo === 'admin';
    const rotaEmpresaId = interesse.Oferta.Projeto.Programa.Rota.empresa_id;
    const isEmpresaAutorizada = usuarioLogado.tipo === 'empresa' && usuarioLogado.empresa_id === rotaEmpresaId;

    if (!isAdmin && !isEmpresaAutorizada) {
      await t.rollback();
      return res.status(403).json({ message: 'Acesso negado.' });
    }

    // Criação do contrato
    const novoContrato = await Contrato.create({
      interesse_id: interesse.id,
      status: 'ATIVO',
    }, { transaction: t });

    // Atualizar o status do projeto e da oferta
    const projeto = interesse.Oferta.Projeto;
    projeto.status = 'EM ANDAMENTO';
    await projeto.save({ transaction: t });

    const oferta = interesse.Oferta;
    oferta.status = 'ENCERRADA';
    await oferta.save({ transaction: t });

    // Remover outros interesses associados à mesma oferta
    await Interesse.destroy({
      where: { oferta_id: oferta.id, id: { [Op.ne]: interesse_id } },
      transaction: t
    });

    // Obter o e-mail do interessado e os dados do responsável pelo projeto
    console.log('Buscando interessado pelo usuario_id:', interesse.usuario_id);
    const interessado = await Usuario.findByPk(interesse.usuario_id);

    console.log('Buscando responsável pelo projeto...');
    const responsavelProjeto = interesse.Oferta.Projeto.Responsavel;

    // Log para verificar se os dados do interessado e responsável foram obtidos corretamente
    if (interessado) {
      console.log('Interessado encontrado:', { nome: interessado.nome, email: interessado.email });
    } else {
      console.log('Interessado não encontrado.');
    }

    if (responsavelProjeto) {
      console.log('Responsável pelo projeto encontrado:', {
        nome: responsavelProjeto.nome,
        email: responsavelProjeto.email,
        telefone: responsavelProjeto.telefone
      });
    } else {
      console.log('Responsável pelo projeto não encontrado.');
    }

    // Envio de e-mail, caso ambos tenham sido encontrados
    if (interessado && responsavelProjeto) {
      await enviarEmail(
        interessado.email,
        'Interesse Aceito - Gate2Way',
        `Olá ${interessado.nome},\n\nSeu interesse no projeto "${projeto.nome}" foi aceito! Entre em contato com o responsável pelo projeto para mais detalhes:\n\nNome: ${responsavelProjeto.nome}\nEmail: ${responsavelProjeto.email}\nTelefone: ${responsavelProjeto.telefone}\n\nAtenciosamente,\nEquipe Gate2Way`
      );
      console.log('E-mail enviado para:', interessado.email);
    } else {
      console.log('Interessado ou responsável pelo projeto não encontrado, e-mail não enviado.');
    }

    await t.commit();

    res.status(201).json({ message: 'Contrato formalizado com sucesso!', contrato: novoContrato });
  } catch (error) {
    await t.rollback();
    console.error('Erro ao formalizar o contrato:', error);
    res.status(500).json({ error: `Erro ao formalizar o contrato: ${error.message}` });
  }
};



// Atualizar um contrato
const AtualizarContrato = async (req, res) => {
  const usuarioLogado = req.user;
  const { contrato_id } = req.params;
  const { status, data_fim } = req.body;

  try {
    console.log('Usuário logado:', usuarioLogado);
    console.log('Atualizando contrato ID:', contrato_id);

    const contrato = await Contrato.findByPk(contrato_id, {
      include: {
        model: Interesse,
        include: {
          model: Oferta,
          as: 'Oferta',
          include: {
            model: Projeto,
            include: {
              model: Programa,
              include: {
                model: Rota,
                include: {
                  model: ICT,
                  where: { id: usuarioLogado.ict_id }
                }
              }
            }
          }
        }
      }
    });

    if (!contrato) {
      console.log('Contrato não encontrado ou acesso negado');
      return res.status(404).json({ message: 'Contrato não encontrado ou acesso negado.' });
    }

    contrato.status = status;
    contrato.data_fim = data_fim;
    await contrato.save();

    console.log('Contrato atualizado:', contrato);

    res.status(200).json({ message: 'Contrato atualizado com sucesso', contrato });
  } catch (error) {
    console.error('Erro ao atualizar contrato:', error);
    res.status(500).json({ error: 'Erro ao atualizar contrato.' });
  }
};

// Deletar um contrato
const DeletarContrato = async (req, res) => {
  const { contrato_id } = req.params;
  const usuarioLogado = req.user;

  try {
    console.log('Usuário logado:', usuarioLogado);
    console.log('Deletando contrato ID:', contrato_id);

    const contrato = await Contrato.findByPk(contrato_id, {
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
                  where: { id: usuarioLogado.ict_id }
                }
              }
            }
          }
        }
      }
    });

    if (!contrato) {
      console.log('Contrato não encontrado ou acesso negado');
      return res.status(404).json({ message: 'Contrato não encontrado ou acesso negado.' });
    }

    await contrato.destroy();
    console.log('Contrato deletado com sucesso');

    res.status(200).json({ message: 'Contrato deletado com sucesso.' });
  } catch (error) {
    console.error('Erro ao deletar contrato:', error);
    res.status(500).json({ error: 'Erro ao deletar contrato.' });
  }
};

// Listar todos os contratos de uma empresa ou ICT
const ListarContratos = async (req, res) => {
  const usuarioLogado = req.user;

  try {
    let contratos;

    if (usuarioLogado.tipo === 'empresa') {
      contratos = await Contrato.findAll({
        include: {
          model: Interesse,
          include: {
            model: Oferta,
            as: 'Oferta',
            include: {
              model: Projeto,
              include: {
                model: Programa,
                include: { model: Rota, as: 'Rota', where: { empresa_id: usuarioLogado.empresa_id }, include: { model: Empresa } }
              }
            }
          }
        }
      });
    } else if (usuarioLogado.tipo === 'ict') {
      contratos = await Contrato.findAll({
        include: {
          model: Interesse,
          where: { usuario_id: usuarioLogado.id },
          include: {
            model: Oferta,
            as: 'Oferta',
            include: {
              model: Projeto,
              include: {
                model: Programa,
                include: { model: Rota, as: 'Rota', include: { model: Empresa } }
              }
            }
          }
        }
      });
    }

    res.status(200).json(contratos);
  } catch (error) {
    console.error('Erro ao listar contratos:', error);
    res.status(500).json({ error: 'Erro ao listar contratos.' });
  }
};

// Selecionar contrato por ID
const SelecionarContratoPorId = async (req, res) => {
  const { contrato_id } = req.params;
  const usuarioLogado = req.user;

  try {
    console.log('Buscando contrato por ID:', contrato_id);

    const contrato = await Contrato.findByPk(contrato_id, {
      include: {
        model: Interesse,
        include: {
          model: Oferta,
          include: {
            model: Projeto,
            include: {
              model: Programa,
              include: { model: Rota, include: { model: ICT, where: { id: usuarioLogado.ict_id } } }
            }
          }
        }
      }
    });

    if (!contrato) {
      console.log('Contrato não encontrado ou acesso negado');
      return res.status(404).json({ message: 'Contrato não encontrado ou acesso negado.' });
    }

    console.log('Contrato encontrado:', contrato);

    res.status(200).json(contrato);
  } catch (error) {
    console.error('Erro ao buscar contrato:', error);
    res.status(500).json({ error: 'Erro ao buscar contrato.' });
  }
};

module.exports = {
  AceitarInteresse,
  AtualizarContrato,
  DeletarContrato,
  ListarContratos,
  SelecionarContratoPorId
};
