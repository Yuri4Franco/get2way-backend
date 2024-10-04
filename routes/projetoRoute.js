const express = require('express');
const router = express.Router();
const projetoController = require('../controllers/projetoController'); 
const { validateProjeto } = require('../middlewares/projetoMiddleware');



// Listar todos projetos
router.get('/projetos', projetoController.ListarTodosProjetos);

// Filtros
router.get('/projetos/programa/:programa_id', projetoController.getProjetosByProgramaId);
router.get('/projetos/rota/:rota_id', projetoController.getProjetosByRotaId);
router.get('/projetos/rota/:rota_id/programa/:programa_id', projetoController.getProjetosByRotaAndProgramaId);
router.get('/projetos/status/:status', projetoController.getProjetosByStatus);

// Selecionar
router.get('/projetos/:id', projetoController.getProjetoById);

// Criar
router.post('/projetos', validateProjeto,projetoController.createProjeto);

// Deletar
router.put('/projetos/:id', validateProjeto, projetoController.updateProjeto);

// Atualizar
router.delete('/projetos/:id', projetoController.deleteProjeto);


module.exports = router;
