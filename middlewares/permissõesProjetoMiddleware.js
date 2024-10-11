const { Programa, Rota } = require('../models');

const PermissoesProjeto = async (req, res, next) => {
  const usuarioLogado = req.user;

  // Verifica se é admin
  if (usuarioLogado.tipo === 'admin') {
    return next(); // Admin tem acesso completo, pode prosseguir
  }

  const { programa_id } = req.body; // Obter o programa_id do corpo da requisição
  if (!programa_id) {
    return res.status(400).json({ message: 'O ID do programa é obrigatório.' });
  }

  try {
    // Buscar o programa associado à empresa do usuário
    const programa = await Programa.findByPk(programa_id, {
      include: {
        model: Rota,
        as: 'Rota',
        where: { empresa_id: usuarioLogado.empresa_id }
      }
    });

    if (!programa) {
      return res.status(403).json({ message: 'Acesso negado. O programa não pertence à empresa logada.' });
    }

    next(); // Permite seguir para o próximo middleware ou controller
  } catch (error) {
    console.error('Erro ao verificar permissões:', error);
    return res.status(500).json({ error: 'Erro ao verificar permissões.' });
  }
};

module.exports = PermissoesProjeto;
