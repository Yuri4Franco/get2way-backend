const Contrato = require('../models').Contrato;
const ICT = require('../models').ICT;
const Interesse = require('../models').Interesse;
const Oferta = require('../models').Oferta;
const Projeto = require('../models').Projeto;
const Programa = require('../models').Programa;
const Usuario = require('../models').Usuario;
const Rota = require('../models').Rota;
const { Op } = require('sequelize');
const sequelize = require('../config/sequelize.js');
const enviarEmail = require('../services/emailService');

const AceitarInteresse = async (req, res) => {
  const usuarioLogado = req.user;
  const { interesse_id } = req.body;

  const t = await sequelize.transaction(); // Inicia uma transação

  try {
    console.log('Usuário logado:', usuarioLogado);
    console.log('Verificando interesse ID:', interesse_id);

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
                include: {
                  model: Usuario, // Assumindo que Usuario representa ICT e contém o email
                  as: 'ict_usuario' // Ajuste para o alias correto, se necessário
                }
              }
            },
            {
              model: Usuario, // Responsável pelo projeto
              as: 'responsavel', // Ajuste o alias conforme necessário
              attributes: ['nome', 'email', 'telefone'] // Dados do responsável
            }
          ]
        }
      },
      transaction: t
    });

    if (!interesse) {
      console.log('Interesse não encontrado.');
      await t.rollback();
      return res.status(404).json({ message: 'Interesse não encontrado.' });
    }

    if (!interesse.Oferta) {
      console.log('Oferta associada ao interesse não encontrada.');
      await t.rollback();
      return res.status(404).json({ message: 'Oferta associada ao interesse não encontrada.' });
    }

    const isAdmin = usuarioLogado.tipo === 'admin';
    const isAuthorized = isAdmin;

    if (!isAuthorized) {
      console.log('Acesso negado.');
      await t.rollback();
      return res.status(403).json({ message: 'Acesso negado.' });
    }

    // Criação do contrato
    const novoContrato = await Contrato.create({
      interesse_id: interesse.id,
      status: 'ATIVO',
      data_inicio: new Date(),
    }, { transaction: t });

    console.log('Contrato formalizado:', novoContrato);

    // Atualizar o status do projeto e da oferta
    const projeto = interesse.Oferta.Projeto;
    projeto.status = 'EM ANDAMENTO';
    await projeto.save({ transaction: t });
    console.log('Status do projeto atualizado para EM ANDAMENTO');

    const oferta = interesse.Oferta;
    oferta.status = 'ENCERRADA';
    await oferta.save({ transaction: t });
    console.log('Status da oferta atualizado para ENCERRADA');

    // Remover outros interesses associados à mesma oferta
    await Interesse.destroy({ where: { oferta_id: oferta.id, id: { [Op.ne]: interesse_id } }, transaction: t });
    console.log('Interesses removidos com sucesso');

    // Obter o e-mail do usuário ICT associado ao projeto
    const ictUsuario = interesse.Oferta.Projeto.Programa.Rota.ict_usuario; // Acesse o e-mail
    const responsavelProjeto = interesse.Oferta.Projeto.responsavel; // Obter dados do responsável pelo projeto

    if (ictUsuario && responsavelProjeto) {
      const { email, nome } = ictUsuario;
      const { nome: nomeResponsavel, email: emailResponsavel, telefone } = responsavelProjeto;

      await enviarEmail(
        email,
        'Interesse Aceito - Gate2Way',
        `Olá ${nome},\n\nSeu interesse no projeto "${projeto.nome}" foi aceito! Entre em contato com o responsável pelo projeto para mais detalhes:\n\nNome: ${nomeResponsavel}\nEmail: ${emailResponsavel}\nTelefone: ${telefone}\n\nAtenciosamente,\nEquipe Gate2Way`
      );
      console.log('E-mail enviado para o usuário ICT:', email);
    } else {
      console.log('Usuário ICT associado ou responsável pelo projeto não encontrado.');
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
            include: {
              model: Projeto,
              include: {
                model: Programa,
                include: { model: Rota, where: { empresa_id: usuarioLogado.empresa_id } }
              }
            }
          }
        }
      });
    } else if (usuarioLogado.tipo === 'ict') {
      contratos = await Contrato.findAll({
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
