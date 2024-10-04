const express = require('express');
const router = express.Router();
const contratoController = require('../controllers/contratoController');

// Rotas CRUD para contrato
router.post('/contratos', contratoController.criarContrato); // Criar contrato
router.get('/contratos', contratoController.buscarTodosContratos); // Buscar todos os contratos
router.get('/contratos/:id', contratoController.buscarContratoPorId); // Buscar contrato por ID
router.put('/contratos/:id', contratoController.atualizarContrato); // Atualizar contrato por ID
router.delete('/contratos/:id', contratoController.deletarContrato); // Deletar contrato por ID

module.exports = router;
