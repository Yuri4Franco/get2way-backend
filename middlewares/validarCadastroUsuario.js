const { check, validationResult } = require('express-validator');

// Middleware de validação para o cadastro de usuários
const validarUsuarioCadastro = [
  // Validar campos obrigatórios e formatos específicos
  check('nome')
    .notEmpty().withMessage('O nome é obrigatório.')
    .isLength({ min: 2 }).withMessage('O nome deve ter pelo menos 2 caracteres.'),
    
  check('email')
    .notEmpty().withMessage('O email é obrigatório.')
    .isEmail().withMessage('O email deve ser válido.'),

  check('senha')
    .notEmpty().withMessage('A senha é obrigatória.')
    .isLength({ min: 6 }).withMessage('A senha deve ter pelo menos 6 caracteres.'),

  check('tipo')
    .notEmpty().withMessage('O tipo de usuário é obrigatório.')
    .isIn(['admin', 'empresa', 'ict']).withMessage('O tipo de usuário deve ser admin, empresa ou ict.'),

  check('endereco')
    .optional()
    .isString().withMessage('O endereço deve ser uma string.'),

  check('telefone')
    .optional()
    .isString().withMessage('O telefone deve ser uma string.'),

  check('cargo')
    .notEmpty().withMessage('O cargo é obrigatório.'),

  // Valida empresa_id e ict_id com base no tipo de usuário
  check('empresa_id')
    .optional()
    .if(check('tipo').equals('empresa'))
    .notEmpty().withMessage('empresa_id é obrigatório para usuários do tipo empresa.')
    .isInt().withMessage('empresa_id deve ser um número inteiro.'),

  check('ict_id')
    .optional()
    .if(check('tipo').equals('ict'))
    .notEmpty().withMessage('ict_id é obrigatório para usuários do tipo ICT.')
    .isInt().withMessage('ict_id deve ser um número inteiro.'),

  // Processa os resultados da validação
  (req, res, next) => {
    const erros = validationResult(req);
    if (!erros.isEmpty()) {
      return res.status(400).json({ errors: erros.array() });
    }
    next();
  }
];

module.exports = validarUsuarioCadastro;
