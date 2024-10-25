const express = require('express');
const app = express();
const sequelize = require('./config/sequelize');
const projetoRoutes = require('./routes/projetoRoute');
const usuarioRoutes = require('./routes/usuarioRoute');
const empresaRoutes = require('./routes/empresaRoute');
const rotaRoute = require('./routes/rotaRoute');
const programaRoutes = require('./routes/programaRoute');
const responsavelRoutes = require('./routes/responsavelRoute');
const ictRoute = require('./routes/ictRoute');
const impulsoRoute = require('./routes/impulsoRoute');
const ofertaRoutes = require('./routes/ofertaRoute');
const interesseRoutes = require('./routes/interesseRoute');
const contratoRoutes = require('./routes/contratoRoute');
const authRoute = require('./routes/authRoute');



// Middleware para lidar com JSON
app.use(express.json()); 

// Rotas
app.use('/api', projetoRoutes);  // Rotas começam com /api

app.use('/api', usuarioRoutes);

app.use('/api', empresaRoutes);

app.use('/api', rotaRoute);

app.use('/api', programaRoutes);

app.use('/api', responsavelRoutes);

app.use('/api', ictRoute);

app.use('/api', impulsoRoute);

app.use('/api', ofertaRoutes);

app.use('/api', interesseRoutes);

app.use('/api', contratoRoutes);

app.use('/api', authRoute);

// Iniciar o servidor
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
