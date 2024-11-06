const express = require('express');
const router = express.Router();
const ictController = require('../controllers/ictController');
const AutenticarToken = require('../middlewares/auth');
const upload = require('../config/multerFotoPerfil');

// Rota para criar um novo Ict
router.post('/icts', AutenticarToken, upload.single('foto_perfil'), ictController.CadastrarIct);

// Rota para buscar todos os Icts
router.get('/icts', AutenticarToken, ictController.BuscarTodasIcts);      

// Rota para buscar um Ict por ID
router.get('/icts/:id', AutenticarToken, ictController.BuscarIctPorId);

// Rota para atualizar um Ict
router.put('/icts/:id', AutenticarToken, upload.single('foto_perfil'), ictController.AtualizarIct);

// Rota para deletar um Ict
router.delete('/icts/:id', AutenticarToken, ictController.DeletarIct);

module.exports = router;