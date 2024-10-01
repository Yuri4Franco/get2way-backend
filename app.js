const express = require('express');
const app = express();
const sequelize = require('./config/sequelize');
const projetoRoutes = require('./routes/projetoRoute');  // Certifique-se de que está importando corretamente

// Middleware para lidar com JSON
app.use(express.json()); 

// Registrar as rotas de projetos
app.use('/api', projetoRoutes);  // Rotas começam com /api

// Iniciar o servidor
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
