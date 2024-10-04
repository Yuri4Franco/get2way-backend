const express = require('express');
const router = express.Router();
const rotaController = require('../controllers/rotaController');

// Rota para criar uma nova rota
router.post('/rotas', rotaController.CadastrarRota);

// Rota para buscar todas as rotas
router.get('/rotas', rotaController.BuscarTodasRotas);

// Rota para buscar uma rota por ID
router.get('/rotas/:id', rotaController.BuscarRotaPorId);

// Rota para atualizar uma rota
router.put('/rotas/:id', rotaController.AtualizarRota);

// Rota para deletar uma rota
router.delete('/rotas/:id', rotaController.DeletarRota);

// Rota para buscar rotas por empresa
router.get('/rotas/empresa/:empresa_id', rotaController.BuscarRotasPorEmpresaId);

module.exports = router;