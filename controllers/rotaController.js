const Rota = require('../models').Rota;
const Empresa = require('../models').Empresa;

// Criar uma nova Rota (Admin ou Empresa pode criar, mas empresa só pode criar para si mesma)
const CadastrarRota = async (req, res) => {
  const { tipo, empresa_id } = req.user;

  try {
    
    const rota = await Rota.create({ ...req.body, empresa_id });
    res.status(201).json(rota);
  } catch (error) {
    console.error('Erro ao criar rota:', error);
    res.status(500).json({ error: `Erro ao criar rota: ${error.message}` });
  }
};

// Buscar todas as Rotas (Apenas Admin pode ver todas as rotas)
const BuscarTodasRotas = async (req, res) => {
  const { tipo, empresa_id } = req.user; // Obtendo o tipo de usuário e a empresa associada do token JWT

  try {
    let rotas;

    // Verifica se o usuário é um administrador
    if (tipo === 'admin') {
      rotas = await Rota.findAll({ include: { model: Empresa }}); // Administrador vê todas as rotas
    } else if (tipo === 'empresa') {
      // Se for uma empresa, filtra as rotas pelo `empresa_id` associado
      rotas = await Rota.findAll({ where: { empresa_id }, include: { model: Empresa }});
    } else {
      return res.status(403).json({ error: 'Acesso negado.' });
    }

    res.status(200).json(rotas);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar rotas' });
  }
};

// Selecionar uma Rota específica (Apenas admin ou a empresa dona pode visualizar a rota)
const SelecionarRota = async (req, res) => {
  const { tipo, empresa_id } = req.user;

  try {
    const rota = await Rota.findByPk(req.params.id, { include: { model: Empresa }});

    if (!rota) {
      return res.status(404).json({ error: 'Rota não encontrada' });
    }

    // Se não for admin, a empresa só pode visualizar suas próprias rotas
    if (tipo !== 'admin' && rota.empresa_id !== empresa_id) {
      return res.status(403).json({ error: 'Você só pode visualizar rotas da sua própria empresa.' });
    }

    res.status(200).json(rota);
  } catch (error) {
    console.error('Erro ao selecionar rota:', error);
    res.status(500).json({ error: 'Erro ao selecionar rota' });
  }
};

// Atualizar uma Rota (Apenas admin ou a empresa dona pode atualizar a rota)
const AtualizarRota = async (req, res) => {
  const { tipo, empresa_id } = req.user;

  try {
    const rota = await Rota.findByPk(req.params.id);

    if (!rota) {
      return res.status(404).json({ error: 'Rota não encontrada' });
    }

    // Se não for admin, a empresa só pode atualizar suas próprias rotas
    if (tipo !== 'admin' && rota.empresa_id !== empresa_id) {
      return res.status(403).json({ error: 'Você só pode atualizar rotas da sua própria empresa.' });
    }

    // Atualiza os dados da rota
    const { nome, descricao } = req.body;
    rota.nome = nome;
    rota.descricao = descricao;
    await rota.save();

    res.status(200).json(rota);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar rota' });
  }
};

// Deletar uma Rota (Apenas admin ou a empresa dona pode deletar a rota)
const DeletarRota = async (req, res) => {
  const { tipo, empresa_id } = req.user;

  try {
    const rota = await Rota.findByPk(req.params.id);

    if (!rota) {
      return res.status(404).json({ error: 'Rota não encontrada' });
    }

    // Se não for admin, a empresa só pode deletar suas próprias rotas
    if (tipo !== 'admin' && rota.empresa_id !== empresa_id) {
      return res.status(403).json({ error: 'Você só pode deletar rotas da sua própria empresa.' });
    }

    await rota.destroy();
    res.status(200).json({ message: 'Rota deletada com sucesso' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao deletar rota' });
  }
};

// Buscar rotas de uma empresa específica (somente admin pode ver)
const BuscarRotasPorEmpresaId = async (req, res) => {
  const { tipo } = req.user;

  try {
    // Verifica se o usuário é admin
    if (tipo !== 'admin') {
      return res.status(403).json({ error: 'Acesso negado. Apenas administradores podem acessar esta rota.' });
    }

    const rotas = await Rota.findAll({
      where: { empresa_id: req.params.empresa_id }
    });

    if (rotas.length > 0) {
      res.status(200).json(rotas);
    } else {
      res.status(404).json({ error: 'Nenhuma rota encontrada para esta empresa' });
    }
  } catch (error) {
    res.status(500).json({ error: `Erro ao buscar rotas por empresa: ${error.message}` });
  }
};

module.exports = {
  CadastrarRota,
  BuscarTodasRotas,
  SelecionarRota,
  AtualizarRota,
  DeletarRota,
  BuscarRotasPorEmpresaId
};
