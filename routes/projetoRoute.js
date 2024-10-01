const express = require('express');
const router = express.Router();
const projetoController = require('../controllers/projetoController');  // Certifique-se de que a importação está correta
const { validateProjeto } = require('../middlewares/projetoMiddleware');

// Definindo as rotas para os projetos
router.get('/projetos/programa/:programa_id', projetoController.getProjetosByProgramaId);
router.get('/projetos/rota/:rota_id', projetoController.getProjetosByRotaId);
router.get('/projetos/rota/:rota_id/programa/:programa_id', projetoController.getProjetosByRotaAndProgramaId);
router.get('/projetos/status/:status', projetoController.getProjetosByStatus);

// Rota para recuperar um projeto por ID
router.get('/projetos/:id', projetoController.getProjetoById);

// Rota para criar um novo projeto
router.post('/projetos', validateProjeto,projetoController.createProjeto);

// Rota para atualizar um projeto existente
router.put('/projetos/:id', validateProjeto, projetoController.updateProjeto);

// Rota para deletar um projeto
router.delete('/projetos/:id', projetoController.deleteProjeto);

module.exports = router;
