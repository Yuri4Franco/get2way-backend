const express = require('express');
const router = express.Router();
const responsavelController = require('../controllers/responsavelController');

// Rota para criar um novo Responsavel
router.post('/responsaveis', responsavelController.CadastrarResponsavel);

// Rota para buscar todos os Responsaveis
router.get('/responsaveis', responsavelController.BuscarTodosResponsaveis);

// Buscar responsavel dinamico 
router.get('/responsaveis/buscar', responsavelController.BuscarResponsavelDinamico);

// Rota para buscar um Responsavel por ID
router.get('/responsaveis/:id', responsavelController.BuscarResponsavelPorId);

// Rota para atualizar um Responsavel
router.put('/responsaveis/:id', responsavelController.AtualizarResponsavel);

// Rota para deletar um Responsavel
router.delete('/responsaveis/:id', responsavelController.DeletarResponsavel);

module.exports = router;
