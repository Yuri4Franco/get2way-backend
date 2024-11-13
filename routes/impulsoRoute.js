const express = require('express');
const router = express.Router();
const impulsoController = require('../controllers/impulsoController');
const AutenticarToken = require('../middlewares/auth');

// Rota para criar um novo Impulso
router.post('/impulsos', AutenticarToken, impulsoController.CadastrarImpulso);

// Rota para buscar todos os Impulsos
router.get('/impulsos', AutenticarToken, impulsoController.BuscarTodosImpulsos);

// Rota para buscar um Impulso por ID
router.get('/impulsos/:id', AutenticarToken, impulsoController.BuscarImpulsoPorId);

// Rota para atualizar um Impulso
router.put('/impulsos/:id', AutenticarToken, impulsoController.AtualizarImpulso);

// Rota para deletar um Impulso
router.delete('/impulsos/:id', AutenticarToken, impulsoController.DeletarImpulso);

module.exports = router;