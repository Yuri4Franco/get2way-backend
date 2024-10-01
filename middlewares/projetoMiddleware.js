const { body, validationResult } = require('express-validator');

const validateProjeto = [
  body('nome')
    .notEmpty().withMessage('Nome é obrigatório')
    .isLength({ max: 45 }).withMessage('Nome pode ter no máximo 45 caracteres'),

  body('descricao')
    .notEmpty().withMessage('Descrição é obrigatória')
    .isLength({ max: 255 }).withMessage('Descrição pode ter no máximo 255 caracteres'),

  body('trl')
    .isInt({ min: 1, max: 9 }).withMessage('trl deve ser um número entre 1 e 9'),

  body('acatech')
    .isInt({ min: 1, max: 5 }).withMessage('Acatech deve ser um número entre 1 e 5'),

  body('data_inicio')
    .isISO8601().withMessage('Data de início deve estar no formato YYYY-MM-DD'),

  body('data_fim')
    .isISO8601().withMessage('Data de fim deve estar no formato YYYY-MM-DD')
    .custom((value, { req }) => {
      if (new Date(value) < new Date(req.body.data_inicio)) {
        throw new Error('Data de fim deve ser posterior à data de início');
      }
      return true;
    }),

  body('justificativas')
    .notEmpty().withMessage('Justificativas são obrigatórias')
    .isLength({ min: 10, max: 255 }).withMessage('Justificativas devem ter entre 10 e 255 caracteres'),

  body('objsmart')
    .notEmpty().withMessage('Objetivos SMART são obrigatórios')
    .isLength({ min: 10, max: 255 }).withMessage('Objetivos SMART devem ter entre 10 e 255 caracteres'),

  body('beneficios')
    .notEmpty().withMessage('Benefícios são obrigatórios')
    .isLength({ min: 10, max: 255 }).withMessage('Benefícios devem ter entre 10 e 255 caracteres'),

  body('produto')
    .notEmpty().withMessage('Produto é obrigatório')
    .isLength({ max: 255 }).withMessage('Produto pode ter no máximo 255 caracteres'),

  body('requisitos')
    .notEmpty().withMessage('Requisitos são obrigatórios')
    .isLength({ min: 10, max: 255 }).withMessage('Requisitos devem ter entre 10 e 255 caracteres'),

  body('steakholders')
    .notEmpty().withMessage('Stakeholders são obrigatórios')
    .isLength({ max: 255 }).withMessage('Stakeholders podem ter no máximo 255 caracteres'),

  body('equipe')
    .notEmpty().withMessage('Equipe é obrigatória')
    .isLength({ max: 255 }).withMessage('Equipe pode ter no máximo 255 caracteres'),

  body('premissas')
    .notEmpty().withMessage('Premissas são obrigatórias')
    .isLength({ max: 255 }).withMessage('Premissas podem ter no máximo 255 caracteres'),

  body('grupo_de_entrega')
    .notEmpty().withMessage('Grupo de entrega é obrigatório')
    .isLength({ max: 255 }).withMessage('Grupo de entrega pode ter no máximo 255 caracteres'),

  body('restricoes')
    .optional()
    .isLength({ min: 10, max: 255 }).withMessage('Restrições devem ter entre 10 e 255 caracteres'),

  body('riscos')
    .optional()
    .isLength({ min: 10, max: 255 }).withMessage('Riscos devem ter entre 10 e 255 caracteres'),

  body('linha_do_tempo')
    .optional()
    .isLength({ max: 255 }).withMessage('Linha do tempo pode ter no máximo 255 caracteres'),

  body('custos')
    .optional()
    .isLength({ max: 255 }).withMessage('Custos podem ter no máximo 255 caracteres'),

  body('upload')
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
