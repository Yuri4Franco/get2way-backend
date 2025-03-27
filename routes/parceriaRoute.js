const express = require('express');
const router = express.Router();
const parceriaController = require('../controllers/parceriaController');
const AutenticarToken = require('../middlewares/auth');

// Rotas CRUD para parceria
router.post('/parcerias', AutenticarToken, parceriaController.AceitarInteresse); // Criar parceria
router.get('/parcerias', AutenticarToken, parceriaController.ListarParcerias); // Buscar todos os Parcerias
router.get('/parcerias/:id', AutenticarToken, parceriaController.SelecionarParceriaPorId); // Buscar parceria por ID
router.put('/parcerias/:id', AutenticarToken, parceriaController.AtualizarParceria); // Atualizar parceria por ID
router.delete('/parcerias/:id', AutenticarToken, parceriaController.DeletarParceria); // Deletar parceria por ID

module.exports = router;
