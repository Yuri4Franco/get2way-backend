const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');
const AutenticarToken = require('../middlewares/auth');


// Cadastrar um usuário
router.post('/usuarios', AutenticarToken, usuarioController.CadastrarUsuario);

// Responsavel cadastrar usuario
router.post('/cadastrar-usuario', AutenticarToken, usuarioController.ResponsavelCadastrarUsuario);

// Buscar usuario dinamico
router.get('/usuarios/buscar', AutenticarToken, usuarioController.BuscarUsuarioDinamico);

// Atualizar um usuário
router.put('/usuarios/:id', AutenticarToken, usuarioController.AtualizarUsuario);

// Deletar um usuário
router.delete('/usuarios/:id', AutenticarToken, usuarioController.DeletarUsuario);

// Ver um usuário pelo ID
router.get('/usuarios/:id', AutenticarToken, usuarioController.VerUsuario);

// Ver todos os usuários
router.get('/usuarios', AutenticarToken, usuarioController.VerTodosUsuarios);


module.exports = router;
