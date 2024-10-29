const { check, validationResult } = require('express-validator');
const Usuario = require('../models').Usuario;

const validarPrimeiroAcesso = [
  check('novaSenha').isLength({ min: 6 }).withMessage('A nova senha deve ter pelo menos 6 caracteres.'),
  check('confirmacaoSenha')
    .custom((value, { req }) => value === req.body.novaSenha)
    .withMessage('A confirmação de senha deve coincidir com a nova senha.'),
  
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      // Verificar se o usuário está em seu primeiro acesso
      const usuarioLogado = req.user;
      const usuario = await Usuario.findByPk(usuarioLogado.id);

      if (!usuario || !usuario.primeiro_acesso) {
        return res.status(403).json({ message: 'Acesso negado. A troca de senha no primeiro acesso não é permitida.' });
      }

      next();
    } catch (error) {
      console.error('Erro ao validar primeiro acesso:', error);
      res.status(500).json({ error: 'Erro ao validar primeiro acesso.' });
    }
  }
];

module.exports = validarPrimeiroAcesso;
