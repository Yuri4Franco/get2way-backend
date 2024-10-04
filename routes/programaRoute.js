const express = require('express');
const router = express.Router();
const programaController = require('../controllers/programaController');

// Rota para criar um novo Programa
router.post('/programas', programaController.CadastrarPrograma);

// Rota para buscar todos os Programas
router.get('/programas', programaController.BuscarTodosProgramas);

// Rota para buscar um Programa por ID
router.get('/programas/:id', programaController.BuscarProgramaPorId);

// Rota para atualizar um Programa
router.put('/programas/:id', programaController.AtualizarPrograma);

// Rota para deletar um Programa
router.delete('/programas/:id', programaController.DeletarPrograma);

module.exports = router;
