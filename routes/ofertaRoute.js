const express = require('express');
const router = express.Router();
const ofertaController = require('../controllers/ofertaController');
const AutenticarToken = require('../middlewares/auth');


// Cadastrar uma nova oferta
router.post('/ofertas', AutenticarToken, ofertaController.CadastrarOferta);

// Atualizar uma oferta
router.put('/ofertas/:id', AutenticarToken, ofertaController.AtualizarOferta);

// Deletar uma oferta
router.delete('/ofertas/:id', AutenticarToken, ofertaController.DeletarOferta);

// Consultar uma oferta por ID
router.get('/ofertas/:id', AutenticarToken, ofertaController.SelecionarOferta);

// Listar todas as ofertas
router.get('/ofertas', AutenticarToken, ofertaController.VerOfertas);

module.exports = router;

