const express = require('express');
const router = express.Router();
const interesseController = require('../controllers/interesseController');
const AutenticarToken = require('../middlewares/auth');

// Rota para criar um interesse de um usuário em uma oferta
router.post('/interesses', AutenticarToken, interesseController.CriarInteresse);

// Rota para listar todos os interesses de uma oferta
router.get('/interesses/oferta/:ofertaId', AutenticarToken, interesseController.BuscarInteressesPorOferta);

// Selecionar interesse por ID
router.get('/interesses/:interesse_id', AutenticarToken, interesseController.SelecionarInteresse);

// Rota para listar todos os interesses de um usuário
router.get('/interesses', AutenticarToken, interesseController.ListarInteressesPorUsuario);

module.exports = router;
    