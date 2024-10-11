const express = require('express');
const router = express.Router();
const programaController = require('../controllers/programaController');
const authenticateToken = require('../middlewares/auth');

// Rota para criar um novo Programa
router.post('/programas', authenticateToken, programaController.CadastrarPrograma);

// Rota para buscar todos os Programas
router.get('/programas', authenticateToken, programaController.BuscarTodosProgramas);

// Rota para atualizar um Programa
router.put('/programas/:id', authenticateToken, programaController.AtualizarPrograma);

// Rota para deletar um Programa
router.delete('/programas/:id', authenticateToken, programaController.DeletarPrograma);

module.exports = router;
