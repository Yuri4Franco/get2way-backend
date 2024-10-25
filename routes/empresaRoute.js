const express = require('express');
const router = express.Router();
const empresaController = require('../controllers/empresaController');
const AutenticarToken = require('../middlewares/auth');


// Cadastrar uma nova empresa
router.post('/empresas', AutenticarToken, empresaController.cadastrarEmpresa);

// Atualizar uma empresa
router.put('/empresas/:id', AutenticarToken, empresaController.atualizarEmpresa);

// Deletar uma empresa
router.delete('/empresas/:id', AutenticarToken, empresaController.deletarEmpresa);  

// Consultar uma empresa por ID
router.get('/empresas/:id', AutenticarToken, empresaController.consultarEmpresaPorId); 

// Listar todas as empresas
router.get('/empresas', AutenticarToken, empresaController.consultarTodasEmpresas);  

module.exports = router;
