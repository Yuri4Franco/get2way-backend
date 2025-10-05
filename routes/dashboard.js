const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const AutenticarToken = require('../middlewares/auth');

router.get('/dashboard-data', AutenticarToken, dashboardController.GetData);   

module.exports = router;