const express = require('express');
const router = express.Router();
const empresaController = require('../controllers/empresaController');
const AutenticarToken = require('../middlewares/auth');


// Cadastrar uma nova empresa
router.post('/empresas', AutenticarToken, empresaController.CadastrarEmpresa);

// Atualizar uma empresa
router.put('/empresas/:id', AutenticarToken, empresaController.AtualizarEmpresa);

// Deletar uma empresa
router.delete('/empresas/:id', AutenticarToken, empresaController.DeletarEmpresa);  

// Consultar uma empresa por ID
router.get('/empresas/:id', AutenticarToken, empresaController.ConsultarEmpresaPorId); 

// Listar todas as empresas
router.get('/empresas', AutenticarToken, empresaController.ConsultarTodasEmpresas);  

module.exports = router;
