const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');
const authenticateToken = require('../middlewares/auth');


// Cadastrar um usuário
router.post('/usuarios', usuarioController.CadastrarUsuario);

// Responsavel cadastrar usuario
router.post('/cadastrar-usuario', authenticateToken, usuarioController.ResponsavelCadastrarUsuario);

// Login
router.post('/login', usuarioController.Login);

// Buscar usuario dinamico
router.get('/usuarios/buscar', usuarioController.BuscarUsuarioDinamico);

// Atualizar um usuário
router.put('/usuarios/:id', usuarioController.AtualizarUsuario);

// Deletar um usuário
router.delete('/usuarios/:id', usuarioController.DeletarUsuario);

// Ver um usuário pelo ID
router.get('/usuarios/:id', usuarioController.VerUsuario);

// Ver todos os usuários
router.get('/usuarios', usuarioController.VerTodosUsuarios);


module.exports = router;
