const e = require('express');

const Programa = require('../models').Programa;
const Empresa = require('../models').Empresa;
const Projeto = require('../models').Projeto;
const Usuario = require('../models').Usuario;
const Rota = require('../models').Rota;

// Função para verificar se o usuário é admin
const VerificarAdmin = async (usuarioId) => {
  const usuario = await Usuario.findByPk(usuarioId);
  return usuario.tipo === 'admin';
};

// Função para verificar se a rota pertence à empresa do usuário logado
const verificarRotaDaEmpresa = async (empresaId, rotaId) => {
  const rota = await Rota.findByPk(rotaId);
  return rota && rota.empresa_id === empresaId;
};

// Criar um novo Programa (empresas podem criar apenas programas em suas rotas)
const CadastrarPrograma = async (req, res) => {
  const usuarioLogado = req.user;
  const { rota_id, nome, descricao } = req.body;

  try {
    // Verificar se o usuário é admin
    const isAdmin = await VerificarAdmin(usuarioLogado.id);

    // Se o usuário for empresa, verificar se a rota pertence à empresa dele antes de cadastrar o programa
    if (!isAdmin) {
      console.log('é empresa');
      const rotaPertenceEmpresa = await verificarRotaDaEmpresa(usuarioLogado.empresa_id, rota_id);
      if (!rotaPertenceEmpresa) {
        return res.status(403).json({ message: 'Acesso negado. A rota selecionada deve pertencer à sua empresa.' });
      }
    }

    // Após a verificação, criar o programa
    const programa = await Programa.create({
      nome,
      descricao,
      rota_id
    });

    res.status(201).json(programa);
  } catch (error) {
    console.error('Erro ao criar programa:', error);
    res.status(500).json({ message: `Erro ao criar programa: ${error.message}` });
  }
};

// Buscar todos os Programas
const BuscarTodosProgramas = async (req, res) => {
  const usuarioLogado = req.user;

  try {
    if (usuarioLogado.tipo === 'admin') {
      // Admin pode ver todos os programas
      const programas = await Programa.findAll({
        include: {
          model: Rota,
          as: 'Rota',
          include: {
            model: Empresa
          }
        },
      });
      return res.status(200).json(programas);
    } else {
      // Empresas só podem ver programas associados às suas rotas
      const programas = await Programa.findAll({
        include: {
          model: Rota,
          where: { empresa_id: usuarioLogado.empresa_id },
          as: 'Rota',
          include: {
            model: Empresa
          }
        },
      });
      return res.status(200).json(programas);
    }
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar programas' });
  }
};
const SelecionarPrograma = async (req, res) => {
  const usuarioLogado = req.user;

  try {
    console.log("Buscando programa com ID:", req.params.id);

    // Buscar o programa e incluir a Rota associada
    const programa = await Programa.findByPk(req.params.id, {
      include: {
        model: Rota,
        as: 'Rota', // Certifique-se de que o alias está correto
        include: {
          model: Empresa
        }
      },
    });

    if (!programa) {
      return res.status(404).json({ message: 'Programa não encontrado' });
    }

    console.log("Rota associada ao programa:", programa.Rota);

    const isAdmin = usuarioLogado.tipo === 'admin';
    const isProprietario = programa.Rota.empresa_id === usuarioLogado.empresa_id;

    // Verifica se o usuário é admin ou o proprietário do programa
    if (!isAdmin && !isProprietario) {
      return res.status(403).json({ message: 'Acesso negado. Você só pode visualizar seus próprios programas.' });
    }

    // Se a verificação passar, retorna o programa
    res.status(200).json(programa);
  } catch (error) {
    console.error('Erro ao selecionar programa:', error);
    res.status(500).json({ message: 'Erro ao selecionar programa' });
  }
};

// Atualizar um Programa (apenas admin ou empresa proprietária)
const AtualizarPrograma = async (req, res) => {
  const usuarioLogado = req.user;

  try {
    console.log("Buscando programa com ID:", req.params.id);

    // Buscar o programa e incluir a Rota associada
    const programa = await Programa.findByPk(req.params.id, {
      include: {
        model: Rota, // Certifique-se de que a associação está correta
        as: 'Rota'  // Use o alias correto para a relação
      },
    });

    if (!programa) {
      console.log("Programa não encontrado.");
      return res.status(404).json({ message: 'Programa não encontrado' });
    }

    console.log("Rota associada ao programa:", programa.Rota);

    const isAdmin = usuarioLogado.tipo === 'admin';
    const isProprietario = programa.Rota.empresa_id === usuarioLogado.empresa_id;

    if (!isAdmin && !isProprietario) {
      console.log("Acesso negado. Empresa:", usuarioLogado.empresa_id, "Proprietário do programa:", programa.Rota.empresa_id);
      return res.status(403).json({ message: 'Acesso negado. Você só pode atualizar seus próprios programas.' });
    }

    // Atualizar o programa com os novos dados
    const { nome, descricao, rota_id } = req.body;
    programa.nome = nome;
    programa.descricao = descricao;
    programa.rota_id = rota_id;
    await programa.save();

    res.status(200).json(programa);
  } catch (error) {
    console.error('Erro ao atualizar programa:', error);
    res.status(500).json({ message: 'Erro ao atualizar programa' });
  }
};

// Deletar um Programa (apenas admin ou empresa proprietária)
const DeletarPrograma = async (req, res) => {
  const usuarioLogado = req.user;

  try {
    console.log("Buscando programa para deletar com ID:", req.params.id);

    // Buscar o programa e incluir a Rota associada
    const programa = await Programa.findByPk(req.params.id, {
      include: {
        model: Rota,
        as: 'Rota', // O alias 'Rota' deve ser usado aqui
      },
    });

    if (!programa) {
      return res.status(404).json({ message: 'Programa não encontrado' });
    }

    console.log("Rota associada ao programa:", programa.Rota);

    const isAdmin = usuarioLogado.tipo === 'admin';
    const isProprietario = programa.Rota.empresa_id === usuarioLogado.empresa_id;

    if (!isAdmin && !isProprietario) {
      return res.status(403).json({ message: 'Acesso negado. Você só pode deletar seus próprios programas.' });
    }

    // Deletar o programa
    await programa.destroy();
    res.status(200).json({ message: 'Programa deletado com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar programa:', error);
    res.status(500).json({ message: 'Erro ao deletar programa' });
  }
};

const BuscarProgramaPorEmpresaId = async (req, res) => {
  const { tipo } = req.user;

  try {
    // Verifica se o usuário é admin
    if (tipo !== 'admin') {
      return res.status(403).json({ message: 'Acesso negado. Apenas administradores podem acessar esta rota.' });
    }

    const programas = await Programa.findAll({
      include: {
        model: Rota,
        as: 'Rota', // O alias 'Rota' deve ser usado aqui
        where: { empresa_id: req.params.empresa_id }
      },

    });
    if (programas.length > 0) {
      res.status(200).json(programas);
    } else {
      res.status(404).json({ message: 'Nenhum programa foi encontrado para esta empresa' });
    }
  } catch (error) {
    res.status(500).json({ message: `Erro ao buscar rotas por empresa: ${error.message}` });
  }
};




module.exports = {
  CadastrarPrograma,
  BuscarTodosProgramas,
  SelecionarPrograma,
  AtualizarPrograma,
  DeletarPrograma,
  BuscarProgramaPorEmpresaId
};
