const express = require('express');
const router = express.Router();
const ictController = require('../controllers/ictController');

// Rota para criar um novo Ict
router.post('/icts', ictController.CadastrarIct);

// Rota para buscar todos os Icts
router.get('/icts', ictController.BuscarTodasIcts);      

// Rota para buscar um Ict por ID
router.get('/icts/:id', ictController.BuscarIctPorId);

// Rota para atualizar um Ict
router.put('/icts/:id', ictController.AtualizarIct);

// Rota para deletar um Ict
router.delete('/icts/:id', ictController.DeletarIct);

module.exports = router;