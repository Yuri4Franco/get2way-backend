const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');
const { Op } = require('sequelize');

// Cadastrar um usuário
router.post('/usuarios', usuarioController.CadastrarUsuario);

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
