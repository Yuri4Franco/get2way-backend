const express = require('express');
const router = express.Router();
const rotaController = require('../controllers/rotaController');
const autenticaToken = require('../middlewares/auth');

// Rota para criar uma nova rota
router.post('/rotas', autenticaToken, rotaController.CadastrarRota);

// Rota para buscar todas as rotas
router.get('/rotas', autenticaToken, rotaController.BuscarTodasRotas);

// Rota para atualizar uma rota
router.put('/rotas/:id', autenticaToken, rotaController.AtualizarRota);

// Rota para deletar uma rota
router.delete('/rotas/:id', autenticaToken, rotaController.DeletarRota);

// Rotas da empresa
router.get('/rotas/empresa/:empresa_id', autenticaToken, rotaController.BuscarRotasPorEmpresaId);

module.exports = router;