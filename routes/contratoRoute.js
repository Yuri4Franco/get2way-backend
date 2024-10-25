const express = require('express');
const router = express.Router();
const contratoController = require('../controllers/contratoController');
const AutenticarToken = require('../middlewares/auth');

// Rotas CRUD para contrato
router.post('/contratos', AutenticarToken, contratoController.AceitarInteresse); // Criar contrato
router.get('/contratos', AutenticarToken, contratoController.ListarContratos); // Buscar todos os contratos
router.get('/contratos/:id', AutenticarToken, contratoController.SelecionarContratoPorId); // Buscar contrato por ID
router.put('/contratos/:id', AutenticarToken, contratoController.AtualizarContrato); // Atualizar contrato por ID
router.delete('/contratos/:id', AutenticarToken, contratoController.DeletarContrato); // Deletar contrato por ID

module.exports = router;
