const Contrato = require('../models').Contrato;
const Usuario = require('../models').Usuario;
const Responsavel = require('../models').Responsavel;
const ICT = require('../models').ICT;
const Interesse = require('../models').Interesse;
const Oferta = require('../models').Oferta;
const Projeto = require('../models').Projeto;
const Programa = require('../models').Programa;
const Rota = require('../models').Rota;
const { Op } = require('sequelize');

// Aceitar um interesse e formalizar o contrato
const AceitarInteresse = async (req, res) => {
  const usuarioLogado = req.user;
  const { interesse_id, oferta_id } = req.body;

  try {
    console.log('Usuário logado:', usuarioLogado);
    console.log('Verificando interesse ID:', interesse_id, 'e oferta ID:', oferta_id);

    const interesse = await Interesse.findByPk(interesse_id, {
      include: { 
        model: Oferta,
        where: { id: oferta_id },
        include: { 
          model: Projeto,
          include: {
            model: Programa,
            include: { model: Rota, where: { empresa_id: usuarioLogado.empresa_id } }
          }
        }
      }
    });

    if (!interesse) {
      console.log('Interesse não encontrado ou acesso negado');
      return res.status(404).json({ message: 'Interesse não encontrado ou acesso negado.' });
    }

    console.log('Interesse encontrado:', interesse);

    const novoContrato = await Contrato.create({
      interesse_id: interesse.id,
      status: 'ATIVO',
      data_inicio: new Date(),
    });

    console.log('Contrato formalizado:', novoContrato);

    const oferta = interesse.Oferta;
    const projeto = oferta.Projeto;
    projeto.status = 'EM ANDAMENTO';
    await projeto.save();
    console.log('Status do projeto atualizado para EM ANDAMENTO');

    oferta.status = 'ENCERRADA';
    await oferta.save();
    console.log('Status da oferta atualizado para ENCERRADA');

    await Interesse.destroy({ where: { oferta_id, id: { [Op.ne]: interesse_id } } });
    console.log('Interesses removidos com sucesso');

    res.status(201).json({ message: 'Contrato formalizado com sucesso!', contrato: novoContrato });
  } catch (error) {
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

    if (usuarioLogado.role === 'empresa') {
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
    } else if (usuarioLogado.role === 'ict') {
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
