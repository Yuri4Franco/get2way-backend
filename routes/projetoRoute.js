const express = require('express');
const router = express.Router();
const projetoController = require('../controllers/projetoController'); 
const { validateProjeto } = require('../middlewares/validarProjeto');
const AutenticarToken = require('../middlewares/auth');
const upload = require('../config/multerArquivos'); 

// Listar projetos e filtrar
router.get('/projetos', AutenticarToken, projetoController.VerProjetos);

// Selecionar projeto por ID
router.get('/projetos/:id', AutenticarToken, projetoController.SelecionarProjeto);

// Criar projeto
router.post('/projetos', AutenticarToken, upload.single('upload'), projetoController.CadastrarProjeto);

// Atualizar projeto
router.put('/projetos/:id', AutenticarToken, upload.single('upload'), projetoController.AtualizarProjeto);

// Deletar projeto
router.delete('/projetos/:id', AutenticarToken, projetoController.DeletarProjeto);

module.exports = router;