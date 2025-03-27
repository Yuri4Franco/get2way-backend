const multer = require('multer');
const { check, validationResult } = require('express-validator');

// Configuração do multer
const upload = multer();

const validateProjeto = [
  // Middleware para lidar com multipart/form-data
  upload.none(),

  check('nome')
    .notEmpty().withMessage('Nome é obrigatório')
    .isLength({ max: 100 }).withMessage('Nome pode ter no máximo 100 caracteres'),

  check('descricao')
    .notEmpty().withMessage('Descrição é obrigatória')
    .isLength({ max: 255 }).withMessage('Descrição pode ter no máximo 255 caracteres'),

  check('trl')
    .notEmpty().withMessage('TRL é obrigatório')
    .isInt({ min: 1, max: 9 }).withMessage('TRL deve ser um número entre 1 e 9'),

  check('data_inicio')
    .notEmpty().withMessage('Data de início é obrigatória')
    .isISO8601().withMessage('Data de início deve estar no formato YYYY-MM-DD'),

  check('data_fim')
    .optional()
    .isISO8601().withMessage('Data de fim deve estar no formato YYYY-MM-DD')
    .custom((value, { req }) => {
      if (new Date(value) < new Date(req.body.data_inicio)) {
        throw new Error('Data de fim deve ser posterior à data de início');
      }
      return true;
    }),

  check('justificativas')
    .optional()
    .isLength({ min: 10, max: 255 }).withMessage('Justificativas devem ter entre 10 e 255 caracteres'),

  check('objsmart')
    .optional()
    .isLength({ min: 10, max: 255 }).withMessage('Objetivos SMART devem ter entre 10 e 255 caracteres'),

  check('beneficios')
    .optional()
    .isLength({ min: 10, max: 255 }).withMessage('Benefícios devem ter entre 10 e 255 caracteres'),

  check('produto')
    .optional()
    .isLength({ max: 255 }).withMessage('Produto pode ter no máximo 255 caracteres'),

  check('requisitos')
    .optional()
    .isLength({ min: 10, max: 255 }).withMessage('Requisitos devem ter entre 10 e 255 caracteres'),

  check('stakeholders')
    .optional()
    .isLength({ max: 255 }).withMessage('Stakeholders podem ter no máximo 255 caracteres'),

  check('equipe')
    .optional()
    .isLength({ max: 255 }).withMessage('Equipe pode ter no máximo 255 caracteres'),

  check('premissas')
    .optional()
    .isLength({ max: 255 }).withMessage('Premissas podem ter no máximo 255 caracteres'),

  check('grupo_de_entrega')
    .optional()
    .isLength({ max: 255 }).withMessage('Grupo de entrega pode ter no máximo 255 caracteres'),

  check('restricoes')
    .optional()
    .isLength({ min: 10, max: 255 }).withMessage('Restrições devem ter entre 10 e 255 caracteres'),

  check('riscos')
    .optional()
    .isLength({ min: 10, max: 255 }).withMessage('Riscos devem ter entre 10 e 255 caracteres'),

  check('linha_do_tempo')
    .optional()
    .isLength({ max: 255 }).withMessage('Linha do tempo pode ter no máximo 255 caracteres'),

  check('custos')
    .optional()
    .isLength({ max: 255 }).withMessage('Custos podem ter no máximo 255 caracteres'),

  check('upload')
    .optional()
    .isLength({ max: 255 }).withMessage('Upload pode ter no máximo 255 caracteres'),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

module.exports = {
  validateProjeto,
};
