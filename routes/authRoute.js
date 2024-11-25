const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/login', authController.Login);
router.post('/logout', authController.Logout);
router.post('/auth', authController.VerificarToken);

module.exports = router
