const express = require('express');
const router = express.Router();
const interesseController = require('../controllers/interesseController');

// Rota para criar um interesse de um usuário em uma oferta
router.post('/interesses', interesseController.CriarInteresse);

// Rota para listar todos os interesses de uma oferta
router.get('/interesses/oferta/:oferta_id', interesseController.BuscarInteressesPorOferta);

// Rota para detalhar o interesse de um usuário específico em uma oferta
router.get('/interesses/oferta/:oferta_id/usuario/:usuarioId', interesseController.DetalharInteressePorUsuario);

// Rota para listar todos os interesses de um usuário
router.get('/interesses/usuario/:usuarioId', interesseController.ListarInteressesPorUsuario);

module.exports = router;
