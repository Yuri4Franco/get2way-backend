const express = require('express');
const router = express.Router();
const programaController = require('../controllers/programaController');
const AutenticarToken = require('../middlewares/auth');

// Rota para criar um novo Programa
router.post('/programas', AutenticarToken, programaController.CadastrarPrograma);

// Selecionar um Programa por ID
router.get('/programas/:id', AutenticarToken, programaController.SelecionarPrograma);

// Rota para buscar todos os Programas
router.get('/programas', AutenticarToken, programaController.BuscarTodosProgramas);   

// Rota para atualizar um Programa
router.put('/programas/:id', AutenticarToken, programaController.AtualizarPrograma);

// Rota para deletar um Programa
router.delete('/programas/:id', AutenticarToken, programaController.DeletarPrograma);

// Buscar programas de uma empresa
router.get('/programas/empresa/:empresa_id', AutenticarToken, programaController.BuscarProgramaPorEmpresaId);

module.exports = router;
