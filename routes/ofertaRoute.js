const express = require('express');
const router = express.Router();
const ofertaController = require('../controllers/ofertaController');


// Cadastrar uma nova oferta
router.post('/ofertas', ofertaController.CadastrarOferta);

// Atualizar uma oferta
router.put('/ofertas/:id', ofertaController.AtualizarOferta);

// Deletar uma oferta
router.delete('/ofertas/:id', ofertaController.DeletarOferta);

// Consultar uma oferta por ID
router.get('/ofertas/:id', ofertaController.BuscarOfertaPorId);

// Listar todas as ofertas
router.get('/ofertas', ofertaController.BuscarTodasOfertas);

// Buscar ofertas por empresa
router.get('/ofertas/empresa/:empresa_id', ofertaController.BuscarOfertasPorEmpresa);

// Buscar ofertas por impulso
router.get('/ofertas/impulso/:impulso_id', ofertaController.BuscarOfertasPorImpulso);

module.exports = router;

