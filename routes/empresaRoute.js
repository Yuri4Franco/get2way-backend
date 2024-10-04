const express = require('express');
const router = express.Router();
const empresaController = require('../controllers/empresaController');


// Cadastrar uma nova empresa
router.post('/empresas', empresaController.cadastrarEmpresa);

// Atualizar uma empresa
router.put('/empresas/:id', empresaController.atualizarEmpresa);

// Deletar uma empresa
router.delete('/empresas/:id', empresaController.deletarEmpresa);  

// Consultar uma empresa por ID
router.get('/empresas/:id', empresaController.consultarEmpresaPorId); 

// Listar todas as empresas
router.get('/empresas', empresaController.consultarTodasEmpresas);  

module.exports = router;
