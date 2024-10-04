const express = require('express');
const router = express.Router();
const impulsoController = require('../controllers/impulsoController');

// Rota para criar um novo Impulso
router.post('/impulsos', impulsoController.CadastrarImpulso);

// Rota para buscar todos os Impulsos
router.get('/impulsos', impulsoController.BuscarTodosImpulsos);

// Rota para buscar um Impulso por ID
router.get('/impulsos/:id', impulsoController.BuscarImpulsoPorId);

// Rota para atualizar um Impulso
router.put('/impulsos/:id', impulsoController.AtualizarImpulso);

// Rota para deletar um Impulso
router.delete('/impulsos/:id', impulsoController.DeletarImpulso);

module.exports = router;