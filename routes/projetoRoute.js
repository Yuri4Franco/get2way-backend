const express = require('express');
const router = express.Router();
const projetoController = require('../controllers/projetoController'); 
const { validateProjeto } = require('../middlewares/projetoMiddleware');
const authenticateToken = require('../middlewares/auth');

// Listar todos os projetos
router.get('/projetos', authenticateToken, projetoController.ListarTodosProjetos);

// Filtros
router.get('/projetos/programa/:programa_id', authenticateToken, projetoController.getProjetosByProgramaId);
router.get('/projetos/rota/:rota_id', authenticateToken, projetoController.getProjetosByRotaId);;
router.get('/projetos/status/:status', authenticateToken, projetoController.getProjetosByStatus);
router.get('/projetos/keyword/:keyword', authenticateToken, projetoController.getProjetosByKeyword);
router.get('/projetos/prioridade/:prioridade', authenticateToken, projetoController.getProjetosByPrioridade);

// Selecionar projeto por ID
router.get('/projetos/:id', authenticateToken, projetoController.getProjetoById);

// Criar projeto
router.post('/projetos', authenticateToken, validateProjeto, projetoController.createProjeto);

// Atualizar projeto
router.put('/projetos/:id', authenticateToken, validateProjeto, projetoController.updateProjeto);

// Deletar projeto
router.delete('/projetos/:id', authenticateToken, projetoController.deleteProjeto);

module.exports = router;
