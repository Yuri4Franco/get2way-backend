const express = require('express');
const router = express.Router();
const AutenticarToken = require('../middlewares/auth');
const authController = require('../controllers/authController');

router.post('/login', authController.Login);
router.post('/logout', authController.Logout);
router.post('/auth', authController.VerificarToken);
router.get('/me', AutenticarToken, authController.GetUser);

module.exports = router
