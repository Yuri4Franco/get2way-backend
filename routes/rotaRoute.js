const express = require('express');
const router = express.Router();
const rotaController = require('../controllers/rotaController');
const AutenticarToken = require('../middlewares/auth');

// Rota para criar uma nova rota
router.post('/rotas', AutenticarToken, rotaController.CadastrarRota);

// Rota para buscar todas as rotas
router.get('/rotas', AutenticarToken, rotaController.BuscarTodasRotas);

// Selecionar rota por ID
router.get('/rotas/:id', AutenticarToken, rotaController.SelecionarRota);

// Rota para atualizar uma rota
router.put('/rotas/:id', AutenticarToken, rotaController.AtualizarRota);

// Rota para deletar uma rota
router.delete('/rotas/:id', AutenticarToken, rotaController.DeletarRota);

// Rotas da empresa
router.get('/rotas/empresa/:empresa_id', AutenticarToken, rotaController.BuscarRotasPorEmpresaId);

module.exports = router;